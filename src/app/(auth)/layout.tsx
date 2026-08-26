import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute right-4 top-4 z-10">
        <LocaleSwitcher />
      </div>
      {children}
    </>
  );
}
