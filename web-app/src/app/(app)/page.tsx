import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "AI Chatbot",
};

export default async function AppHomePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?next=/`);
  }

  return (
    <div className="hero h-4/5 bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to AI Chatbot</h1>
          <p className="py-6">
            Start a conversation with our AI assistant or explore the features.
          </p>
          <Link href="/c" className="btn btn-primary">
            Start Chatting
          </Link>
        </div>
      </div>
    </div>
  );
}
