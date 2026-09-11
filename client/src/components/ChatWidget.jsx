import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendChatMessage } from '../api/aiApi';

function readStoredJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function cleanReply(reply) {
  return reply
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[*_#>`]/g, '')
    .replace(/^\s*[-•]\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(() => readStoredJson('schemesetu_chat_position', null));
  const [size, setSize] = useState(() => readStoredJson('schemesetu_chat_size', { width: 370, height: 520 }));
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 720);
  const widgetRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const didDragRef = useRef(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chat.welcome', 'Hi, I am Setu. I can help you understand scheme eligibility and find your next step.')
    }
  ]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 720;
      setIsMobile(mobile);
      if (!mobile && widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        setPosition((current) => {
          if (!current) return current;
          if (current.left > window.innerWidth - 60 || current.top > window.innerHeight - 60) {
            return {
              left: Math.max(8, Math.min(window.innerWidth - rect.width - 8, current.left)),
              top: Math.max(8, Math.min(window.innerHeight - rect.height - 8, current.top))
            };
          }
          return current;
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (position) localStorage.setItem('schemesetu_chat_position', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem('schemesetu_chat_size', JSON.stringify(size));
  }, [size]);

  const submitMessage = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: 'user', content: message }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(message, messages);
      setMessages([...nextMessages, {
        role: 'assistant',
        content: cleanReply(data.reply || t('chat.fallback', 'Please try that again or use Find schemes to check your eligibility.'))
      }]);
    } catch {
      setMessages([...nextMessages, {
        role: 'assistant',
        content: t('chat.connectionError', 'I cannot connect right now. Please try again in a moment.')
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startDrag = (event) => {
    if (isMobile || event.button !== 0) return;
    didDragRef.current = false;
    const rect = event.currentTarget.closest('.chat-widget').getBoundingClientRect();
    dragRef.current = { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    const move = (moveEvent) => {
      const offset = dragRef.current;
      if (Math.abs(moveEvent.clientX - event.clientX) > 4 || Math.abs(moveEvent.clientY - event.clientY) > 4) didDragRef.current = true;
      setPosition({
        left: Math.max(8, Math.min(window.innerWidth - rect.width - 8, moveEvent.clientX - offset.offsetX)),
        top: Math.max(8, Math.min(window.innerHeight - rect.height - 8, moveEvent.clientY - offset.offsetY))
      });
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      dragRef.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  useEffect(() => {
    if (isMobile || !widgetRef.current) return undefined;
    const frame = requestAnimationFrame(() => {
      const rect = widgetRef.current.getBoundingClientRect();
      setPosition((current) => {
        if (!current) return current;
        return {
          left: Math.max(8, Math.min(window.innerWidth - rect.width - 8, rect.left)),
          top: Math.max(8, Math.min(window.innerHeight - rect.height - 8, rect.top))
        };
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, isMobile]);

  const startResize = (event) => {
    if (isMobile) return;
    event.preventDefault();
    event.stopPropagation();
    const panel = event.currentTarget.closest('.chat-panel');
    const rect = panel.getBoundingClientRect();
    resizeRef.current = { startX: event.clientX, startY: event.clientY, width: rect.width, height: rect.height };
    const move = (moveEvent) => {
      const start = resizeRef.current;
      const width = Math.max(300, Math.min(560, start.width + moveEvent.clientX - start.startX));
      const height = Math.max(360, Math.min(window.innerHeight - 24, start.height + moveEvent.clientY - start.startY));
      setSize({ width, height });
      if (widgetRef.current) {
        const widgetRect = widgetRef.current.getBoundingClientRect();
        setPosition((current) => current ? {
          left: Math.max(8, Math.min(window.innerWidth - width - 8, widgetRect.left)),
          top: Math.max(8, Math.min(window.innerHeight - height - 8, widgetRect.top))
        } : current);
      }
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      resizeRef.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  const quickPrompts = [
    t('chat.promptEligibility', 'What details do I need to check eligibility?'),
    t('chat.promptBusiness', 'I want to start a small business')
  ];

  return (
    <aside ref={widgetRef} className={`chat-widget ${open ? 'is-open' : ''}`} style={(!isMobile && position) ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined}>
      {open && (
        <section className="chat-panel" style={!isMobile ? { width: size.width, height: size.height } : undefined} aria-label={t('chat.title', 'SchemeSetu assistant')}>
          <div className="chat-header" onPointerDown={startDrag}>
            <div className="chat-avatar" aria-hidden="true">
              <span className="chat-avatar-face" />
            </div>
            <div>
              <span className="chat-eyebrow">{t('chat.assistantLabel', 'AI assistant')}</span>
              <h2>{t('chat.title', 'Chat with Setu')}</h2>
            </div>
            <button type="button" className="chat-close" onPointerDown={(event) => event.stopPropagation()} onClick={() => setOpen(false)} aria-label={t('chat.close', 'Close chat')}>
              ×
            </button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map((item, index) => (
              <p key={`${item.role}-${index}`} className={`chat-message ${item.role}`}>
                {item.content}
              </p>
            ))}
            {loading && <p className="chat-message assistant chat-loading">{t('chat.thinking', 'Thinking...')}</p>}
          </div>
          {messages.length === 1 && (
            <div className="chat-prompts">
              {quickPrompts.map((prompt) => (
                <button type="button" key={prompt} onClick={() => setInput(prompt)}>{prompt}</button>
              ))}
            </div>
          )}

          <form className="chat-form" onSubmit={submitMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('chat.placeholder', 'Ask about government schemes...')}
              aria-label={t('chat.placeholder', 'Ask about government schemes...')}
              maxLength={2000}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label={t('chat.send', 'Send message')}>
              ↑
            </button>
          </form>
          <button type="button" className="chat-resize-grip" onPointerDown={startResize} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }} aria-label={t('chat.resize', 'Resize chat window')} title={t('chat.resize', 'Resize chat window')}>
            <span /><span /><span />
          </button>
        </section>
      )}
      <button type="button" className="chat-launcher" onPointerDown={startDrag} onClick={() => { if (!didDragRef.current) setOpen(!open); }} aria-expanded={open} aria-label={open ? t('chat.close', 'Close chat') : t('chat.open', 'Open Setu assistant')}>
        <span className="chat-launcher-dot" />
        <span className={`chat-bubble-icon ${open ? 'is-close' : ''}`} aria-hidden="true">
          {open ? '×' : ''}
        </span>
        {!open && <span className="chat-launcher-label">{t('chat.launcherLabel', 'Chat')}</span>}
      </button>
    </aside>
  );
}

export default ChatWidget;