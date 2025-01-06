import { FormEvent, KeyboardEvent } from "react";

interface InputAreaProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const MAX_LENGTH = 1000;

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: InputAreaProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const charactersLeft = MAX_LENGTH - input.length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-center">
        <textarea
          className="textarea textarea-bordered flex-grow resize-none"
          rows={1}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ingresar mensaje..."
          maxLength={MAX_LENGTH}
        />
        <button
          type="submit"
          className="btn btn-primary ml-2"
          disabled={isLoading || input.length === 0}
        >
          Enviar
        </button>
      </div>
      <div className="mt-1 text-right text-xs">
        {charactersLeft} disponibles
      </div>
    </form>
  );
}
