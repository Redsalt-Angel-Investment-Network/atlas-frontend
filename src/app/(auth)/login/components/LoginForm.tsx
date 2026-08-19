"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginFormValues } from "../schema";

type LoginFormProps = {
  onSubmit(values: LoginFormValues): Promise<void>;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-full max-w-md mx-auto rounded-md bg-white p-8 border border-gray-300 shadow-sm">
      <div className="mb-10 flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-xl font-bold text-gray-900">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Enter your credentials to access your account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
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
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          {errors.password?.message && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-500 hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}