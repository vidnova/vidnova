import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CreateCommentForm = () => {
  return (
    <form className="flex gap-3">
      <Input placeholder="Введіть коментар..." />
      <Button>Опублікувати</Button>
    </form>
  );
};
