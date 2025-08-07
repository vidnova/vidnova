import { Button, Input } from '@vidnova/ui';

export const CreateCommentForm = () => {
  return (
    <form className="flex gap-3">
      <Input placeholder="Введіть коментар..." />
      <Button>Опублікувати</Button>
    </form>
  );
};
