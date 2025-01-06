"use client";

import { useState, useEffect } from "react";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

// todo: replace
interface SpeechRecognition {
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: any[];
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        onTranscript(transcript);
      };
      setRecognition(recognition);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  if (!recognition) {
    return null; // Voice recognition not supported
  }

  return (
    <button
      className={`btn ${isListening ? "btn-error" : "btn-primary"}`}
      onClick={toggleListening}
    >
      {isListening ? "Stop Listening" : "Start Voice Input"}
    </button>
  );
}
