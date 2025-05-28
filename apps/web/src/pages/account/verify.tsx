import { VerifyAccountForm } from "@/modules/account/verify";

export default function VerifyAccount() {
  return (
    <main className="w-full h-screen flex justify-center items-center bg-[url('/auth-bg.jpg')] ">
      <VerifyAccountForm />
    </main>
  );
}
