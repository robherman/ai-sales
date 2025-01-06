import { useEffect, useRef, useState } from "react";
import { AutocompleteInput } from "./autocomplete-input";
import dynamic from "next/dynamic";

const VoiceInput = dynamic(
  () => import("./voice-input").then((mod) => mod.VoiceInput),
  {
    ssr: false,
  },
);

interface ChatInputProps {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFileUpload: (file: File) => void;
  isLoading: boolean;
  suggestions: string[];
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  handleFileUpload,
  isLoading,
  suggestions,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSpeechResult = (transcript: string) => {
    const syntheticEvent = {
      target: { value: transcript },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2">
      <div className="flex-grow">
        <AutocompleteInput
          input={input}
          handleInputChange={(value: string) => {
            const syntheticEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(syntheticEvent);
          }}
          handleSubmit={() =>
            onSubmit({
              preventDefault: () => {},
            } as React.FormEvent<HTMLFormElement>)
          }
          suggestions={suggestions}
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
      />
      <button
        type="button"
        className="btn btn-circle btn-outline"
        onClick={() => fileInputRef.current?.click()}
      >
        📎
      </button>
      {isClient && <VoiceInput onSpeechResult={handleSpeechResult} />}
      <button className="btn btn-primary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
