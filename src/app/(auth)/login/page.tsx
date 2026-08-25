"use client";

import { useRouter } from "next/navigation";
import { loginApi } from "@/app/(auth)/index";
import { toast } from "sonner";
import LoginForm from "./components/LoginForm";
import { LoginFormValues } from "./schema";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    try {

      const data = await loginApi({
        email: values.email,
        password: values.password,
      });

      if (!data) {
        return;
      }

      login(data);

      toast.success("Login successful.");

      router.push("/");
    } catch (error) {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-slate-100
      px-6
    "
    >
      <LoginForm onSubmit={handleLogin} />
    </main>
  );
}