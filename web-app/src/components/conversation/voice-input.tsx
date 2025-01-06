import React, { useState, useEffect, useCallback } from "react";

interface VoiceInputProps {
  onSpeechResult: (transcript: string) => void;
}

export function VoiceInput({ onSpeechResult }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        onSpeechResult(transcript);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, [onSpeechResult]);

  useEffect(() => {
    initializeSpeechRecognition();
  }, [initializeSpeechRecognition]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  }, [isListening, recognition]);

  if (!isSupported) {
    return null; // Or render a fallback UI
  }

  return (
    <button
      onClick={toggleListening}
      className={`btn ${isListening ? "btn-error" : "btn-primary"}`}
    >
      {isListening ? "Stop Listening" : "Start Listening"}
    </button>
  );
}
