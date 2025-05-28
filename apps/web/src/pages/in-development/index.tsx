import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

export default function InDevelopment() {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <p className="text-white text-2xl">Ця частина знаходиться у розробці</p>
      <Button onClick={() => history.back()}>
        <Undo2 />
        <span>Повернутись назад</span>
      </Button>
    </main>
  );
}
