import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for hackathon/dev
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class Scheme(BaseModel):
    id: str
    name: str
    description: str


class RerankRequest(BaseModel):
    userDescription: str
    schemes: list[Scheme]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


@app.get("/")
def health_check():
    return {"status": "AI service running"}


@app.post("/api/chat")
def chat(req: ChatRequest):
    message = req.message.strip()
    if not message:
        return {"reply": "Tell me what you need help with and I will look into it."}

    conversation = [
        {
            "role": "system",
            "content": """You are Setu, the helpful assistant for SchemeSetu, an Indian government scheme discovery service.
Help with any question related to Indian government schemes, eligibility, documents, benefits, applications, and the SchemeSetu search process.
Answer in 2 or 3 short sentences using plain text only. Do not use markdown, bullets, emojis, headings, symbols, or filler. Never invent a scheme, benefit, deadline, or eligibility rule. If exact eligibility is needed, ask the user to use Find schemes with their age, state, category, business type, and income. Clearly say when something must be verified on the official application portal. Do not request passwords, OTPs, bank details, or other sensitive information."""
        }
    ]

    for item in req.history[-8:]:
        if item.role in {"user", "assistant"} and item.content.strip():
            conversation.append({"role": item.role, "content": item.content[:2000]})
    conversation.append({"role": "user", "content": message[:2000]})

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=conversation,
            temperature=0.4,
            max_tokens=180,
        )
        reply = completion.choices[0].message.content.strip()
        return {"reply": reply}
    except Exception as e:
        return {
            "reply": "I am having trouble connecting right now. You can still use Find schemes to check your eligibility.",
            "error": str(e),
        }


@app.post("/api/rerank")
def rerank_schemes(req: RerankRequest):
    if not req.schemes:
        return {"ranked": []}

    scheme_list_text = "\n".join(
        [f"{s.id}: {s.name} - {s.description}" for s in req.schemes]
    )

    prompt = f"""You are helping match a government scheme to an entrepreneur's business idea.

Business description: "{req.userDescription}"

Here are the eligible schemes (already filtered by hard eligibility rules):
{scheme_list_text}

Rank these schemes from most to least relevant to the business description.
Respond ONLY with valid JSON, no other text, in this exact format:
{{"ranked": [{{"id": "scheme_id", "reason": "one short sentence why this fits"}}, ...]}}

IMPORTANT: The "id" field must be copied EXACTLY from the id values given above (e.g. "1", "2") - do NOT use the scheme name as the id.
Include ALL schemes from the list above, just reordered by relevance."""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw_text = completion.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        parsed = json.loads(raw_text)
        return parsed
    except Exception as e:
        # Fallback: return original order with no reasons if AI call fails
        return {
            "ranked": [{"id": s.id, "reason": ""} for s in req.schemes],
            "error": str(e),
        }

class ExtractRequest(BaseModel):
    freeText: str


@app.post("/api/extract")
def extract_profile(req: ExtractRequest):
    prompt = f"""Extract structured information from this person's description of themselves and their business idea.

Text: "{req.freeText}"

Extract these fields if mentioned or clearly implied:
- age (number)
- category (one of: General, SC, ST, OBC, Women, Disabled - infer "Women" if the person explicitly says they are a woman; otherwise use General if no category is mentioned)
- state (Indian state name, e.g. Telangana)
- businessType (one of: manufacturing, service, retail, agri - dairy/farming/livestock counts as agri)
- income (annual income in rupees, as a number, only if explicitly mentioned)
- description (a short 1-sentence summary of their business idea, in their own words, for use in semantic matching)

Respond ONLY with valid JSON in this exact format, using null for any field not mentioned:
{{"age": null, "category": null, "state": null, "businessType": null, "income": null, "description": null}}"""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        raw_text = completion.choices[0].message.content.strip()
        parsed = json.loads(raw_text)
        return parsed
    except Exception as e:
        return {
            "age": None, "category": None, "state": None,
            "businessType": None, "income": None, "description": req.freeText,
            "error": str(e)
        }

class GapRequest(BaseModel):
    userProfile: dict  # age, category, state, businessType, income
    nearMissSchemes: list[Scheme]


@app.post("/api/gap-explainer")
def explain_gaps(req: GapRequest):
    if not req.nearMissSchemes:
        return {"gaps": []}

    scheme_list_text = "\n".join(
        [f"{s.id}: {s.name} - {s.description}" for s in req.nearMissSchemes]
    )

    prompt = f"""A person has this profile: {json.dumps(req.userProfile)}

These schemes did NOT match their profile under strict eligibility rules, but they are close:
{scheme_list_text}

For each scheme, in one short sentence, explain what specific criteria they are likely missing
and what would need to change for them to qualify (e.g. income threshold, business type, state).
Be encouraging and specific, not vague.

Respond ONLY with valid JSON in this exact format:
{{"gaps": [{{"id": "scheme_id", "explanation": "one short sentence"}}, ...]}}

Use the exact "id" values given above."""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw_text = completion.choices[0].message.content.strip()
        parsed = json.loads(raw_text)
        return parsed
    except Exception as e:
        return {"gaps": [], "error": str(e)}