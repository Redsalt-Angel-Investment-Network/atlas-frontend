import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type InputProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  error,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const passwordField = type === "password";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={
            passwordField
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          className={`w-full rounded-xl border px-4 py-3 outline-none transition
          ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-indigo-600"
          }`}
        />

        {passwordField && (
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}