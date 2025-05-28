import { Button } from "@ecorally/ui";
import { SelectRegionCombobox, SelectSettlementCombobox } from "./components";
import Link from "next/link";

export const SignUpCompleteForm = () => {
  return (
    <form className="w-full max-w-[360px] bg-primary-foreground p-6 rounded-2xl flex flex-col gap-3">
      <h1 className="text-accent font-bold text-2xl">
        Завершіть налаштування аккаунту
      </h1>
      <p className="text-muted-foreground text-sm">
        Оберіть вашу область та наленений пункт, щоб отримувати події, які
        знаходяться біля вас
      </p>
      <SelectRegionCombobox />
      <SelectSettlementCombobox />
      <div className="flex flex-col gap-3">
        <Button>Зберегти</Button>
        <Link href={"/near-events"} className="w-full">
          <Button variant={"outline"} className="w-full">
            Пропустити
          </Button>
        </Link>
      </div>
    </form>
  );
};
