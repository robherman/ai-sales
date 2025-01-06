import { redirect } from "next/navigation";
import { Session } from "@/lib/types";
import { getSession } from "@/lib/auth";
import { initializateConversation } from "../../../lib/apis/conversation";
import Link from "next/link";
import { DEFAULT_CHATBOT_ID, DEFAULT_COMPANY_ID } from "../../../lib/constants";

export default async function ChatPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = (await getSession()) as Session;
  if (!session?.token) {
    redirect(`/login?next=/`);
  }
  const customerId: string | null = searchParams
    ? (searchParams["customerId"] as string)
    : null;

  if (customerId) {
    const { chat } = await initializateConversation({
      customerId,
      chatbotId: DEFAULT_CHATBOT_ID,
      companyId: DEFAULT_COMPANY_ID,
      channel: "web",
    });
    if (chat) {
      redirect(`/c/${chat.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-primary">Iniciar chat</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Cómo iniciar un chat</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StepCard
            icon={true}
            step="1"
            title="Choose a Client"
            description="Select the client you want to chat with"
          />
          <StepCard
            icon={true}
            step="2"
            title="Start Conversation"
            description="Initiate a conversation with the selected client"
          />
          <StepCard
            icon={<></>}
            step="3"
            title="Execute Chat Strategy"
            description="Let the AI chatbot handle the conversation"
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link className="btn btn-primary btn-lg" href={`/customers`}>
          Iniciar
        </Link>
      </div>
    </div>
  );
}

function StepCard({ icon, step, title, description }: any) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 text-center">
      <div className="mb-2 text-3xl text-primary">{icon}</div>
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        {step}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
