"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { loginApi } from "@/app/(auth)/index";
import { toast } from "sonner";
import LoginForm from "./components/LoginForm";
import { LoginFormValues } from "./schema";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function LoginPage() {
  const t = useTranslations("Login");
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
      toast.error(t("invalidCredentials"));
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
