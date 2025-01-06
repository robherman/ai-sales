import LandingIntro from "../../../components/landing-intro";
import LoginForm from "../../../components/auth/login-form";
import { getSession } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(`/`);
  }

  return (
    <div className="flex min-h-screen items-center bg-base-200">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid grid-cols-1 rounded-xl bg-base-100 md:grid-cols-2">
          <div className="">
            <LandingIntro />
          </div>
          <div className="px-10 py-24">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
