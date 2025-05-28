import { Button, Input } from '@ecorally/ui';

export const CreateCommentReplyForm = ({ onClickClose }: { onClickClose: () => void }) => {
  return (
    <form className="flex justify-between gap-3">
      <Input placeholder="Введіть відповідь..." />
      <Button type="button" variant={'secondary'} onClick={onClickClose}>
        Скасувати
      </Button>
      <Button>Відповісти</Button>
    </form>
  );
};
