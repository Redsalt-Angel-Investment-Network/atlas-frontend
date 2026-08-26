"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { signupSchema, type SignupFormValues } from "../schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerApi } from "@/app/(auth)/index";

export default function SignupForm() {
  const t = useTranslations("Register");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const schema = useMemo(() => signupSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleSignup = async (values: SignupFormValues) => {
    try {
      const data = await registerApi({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      });

      if (!data) return;

      toast.success(t("success"));

      router.push("/login");
    } catch (error) {
      const apiError = error as {
        statusCode?: number;
        responseBody?: {
          email?: string[];
          first_name?: string[];
          last_name?: string[];
          password?: string[];
          password_confirmation?: string[];
          non_field_errors?: string[];
        };
      };

      const responseBody = apiError.responseBody;

      if (responseBody?.email?.length) {
        setError("email", {
          type: "server",
          message: t("emailExists"),
        });

        return;
      }

      if (responseBody?.non_field_errors?.length) {
        const message = responseBody.non_field_errors[0];

        if (message.toLowerCase().includes("password")) {
          setError("password", {
            type: "server",
            message: t("passwordWeak"),
          });

          return;
        }
      }

      toast.error(t("unable"));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-md bg-white p-8 border border-gray-300 shadow-sm">
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-400">{t("subtitle")}</p>
      </div>

      <form
        onSubmit={handleSubmit(handleSignup)}
        className="space-y-4"
      >
        {/* first Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            {t("firstName")}
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            {...register("firstName")}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.firstName?.message && (
            <p id="firstName-error" className="mt-1 text-xs text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>
        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            {t("lastName")}
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            {...register("lastName")}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.lastName?.message && (
            <p id="lastName-error" className="mt-1 text-xs text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@mail.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.email?.message && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {t("password")}
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password?.message && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            {t("confirmPassword")}
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              aria-invalid={!!errors.passwordConfirmation}
              aria-describedby={
                errors.passwordConfirmation ? "passwordConfirmation-error" : undefined
              }
              {...register("passwordConfirmation")}
              className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.passwordConfirmation ? "border-red-400" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.passwordConfirmation?.message && (
            <p id="passwordConfirmation-error" className="mt-1 text-xs text-red-600">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-blue-500 hover:underline"
        >
          {t("signIn")}
        </Link>
      </div>
    </div>
  );
}
