import { useEffect, useRef, useState } from 'react';

function VoiceInputButton({ onResult, label = 'Use voice input' }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => onResult(event.results[0][0].transcript);
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [onResult]);

  if (!supported) {
    return <span className="voice-input-unavailable" title="Voice input is not supported by this browser">Voice unavailable</span>;
  }

  return (
    <button
      type="button"
      className={`voice-input-button ${listening ? 'is-listening' : ''}`}
      onClick={() => {
        if (listening) recognitionRef.current?.stop();
        else recognitionRef.current?.start();
      }}
      aria-label={listening ? 'Stop voice input' : label}
      title={listening ? 'Stop listening' : label}
    >
      <span aria-hidden="true">{listening ? '■' : '●'}</span>
      {listening ? 'Listening' : 'Speak'}
    </button>
  );
}

export default VoiceInputButton;
