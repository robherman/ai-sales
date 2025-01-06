export const ChatContext = ({ context }: { context: any }) => {
  if (!context) return <div>No context information available.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chat Context</h3>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <InfoItem label="Chatbot" value={context.chatbotName} />
        <InfoItem label="LLM" value={context.model} />
        <InfoItem label="Temperatura" value={context.temperature} />
        <InfoItem label="Max. Tokens" value={context.maxTokens} />
        <InfoItem label="Tono" value={context.tone} />
        <InfoItem label="Idiomas" value={context.allowedLanguages.join(", ")} />
        <InfoItem label="Empresa" value={context.companyName} />
        <InfoItem label="Canal" value={context.channel} />
        <InfoItem label="Hora día" value={context.timeOfDay} />
        <InfoItem label="Estrategia" value={context.customerStrategy} />
      </div>
    </div>
  );
};

function InfoItem({ label, value }: any) {
  return (
    <div>
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </div>
  );
}
