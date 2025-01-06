"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading-spinner";
import { useAuth } from "../../lib/providers/auth-context";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authResponse = await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Login failed`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 space-y-3"
    >
      <div className="w-full flex-1 rounded-lg border px-6 pb-4 pt-8 shadow-md md:w-96">
        <h1 className="mb-3 text-2xl font-bold">Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border px-2 py-[9px] text-sm outline-none"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              Contrase&ntilde;a
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border px-2 py-[9px] text-sm outline-none"
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <LoginButton />
      </div>

      <Link href="/signup" className="flex flex-row gap-1 text-sm">
        No account yet? <div className="font-semibold underline">Sign up</div>
      </Link>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-disabled={pending}
    >
      {pending ? <LoadingSpinner /> : "Ingresar"}
    </button>
  );
}
