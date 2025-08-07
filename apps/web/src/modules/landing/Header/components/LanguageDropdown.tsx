
import { Check, Earth } from 'lucide-react';
import { useRouter } from 'next/router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@vidnova/ui';

export const LanguageDropdown = () => {
  const router = useRouter();
  const { locale, asPath } = router;

  const changeLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/`;
    router.push(asPath, asPath, { locale: lang });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Change language" className="cursor-pointer">
          <Earth className="w-5 h-5 text-accent" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage('uk')}>
          <div className="flex w-full items-center justify-between gap-2">
            <span>Українська</span>
            {locale === 'uk-UK' ? <Check /> : null}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          <div className="flex w-full items-center justify-between gap-2">
            <span>English</span>
            {locale === 'en-US' ? <Check /> : null}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
