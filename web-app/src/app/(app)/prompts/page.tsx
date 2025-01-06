import { getSession } from "../../../lib/auth";
import { redirect } from "next/navigation";
import PromptList from "../../../components/prompts/prompt-list";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Prompts({ searchParams }: Props) {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?next=/prompts`);
  }
  const prompts: any[] = [];
  return (
    <div className="p-4">
      <PromptList />
    </div>
  );
}
