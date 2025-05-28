import { Button, Input } from '@ecorally/ui';

export const CreateCommentForm = () => {
  return (
    <form className="flex gap-3">
      <Input placeholder="Введіть коментар..." />
      <Button>Опублікувати</Button>
    </form>
  );
};
