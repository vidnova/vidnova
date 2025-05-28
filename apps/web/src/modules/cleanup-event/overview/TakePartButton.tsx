import { Button } from '@ecorally/ui';
import { UserMinus, UserPlus } from 'lucide-react';

export const TakePartButton = ({ isTaken }: { isTaken: boolean }) => {
  return (
    <Button variant={isTaken ? 'destructive' : 'default'}>
      {!isTaken ? (
        <>
          <UserPlus />
          <span>Взяти участь</span>
        </>
      ) : (
        <>
          <UserMinus />
          <span>Не брати участь</span>
        </>
      )}
    </Button>
  );
};
