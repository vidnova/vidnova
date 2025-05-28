import { SignUpCompleteForm } from "@/modules/auth/sign-up-complete";

export default function SignUpComplete() {
  return (
    <main className="w-full h-screen flex items-center justify-center bg-[url('/auth-bg.jpg')]">
      <SignUpCompleteForm />
    </main>
  );
}
