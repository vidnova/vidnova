import { VerifyAccountInputOTP } from './components';
import { Button } from '@vidnova/ui';

export const VerifyAccountForm = () => {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl text-accent font-bold">Верифікація</h1>
        <p className="text-sm text-muted-foreground">
          Введіть код, який вам було надіслано на пошту
        </p>
        <VerifyAccountInputOTP />
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm">Не отримали код?</span>
          <Button variant={'ghost'} size={'sm'} className="text-blue-200">
            Надіслати знову
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button>Перевірити</Button>
        <Button variant={'outline'} onClick={() => history.back()} type="button">
          <span>Повернутись</span>
        </Button>
      </div>
    </form>
  );
};
