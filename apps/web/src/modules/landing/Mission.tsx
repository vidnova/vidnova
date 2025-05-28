import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const Mission = () => {
  const t = useTranslations('Landing.Mission');

  return (
    <section className="py-16 px-8 w-full max-w-[1200px] mx-auto" id="mission">
      <p className="text-4xl text-white font-bold text-center">{t('title')}</p>
      <div className="flex justify-center gap-6 mt-12 max-lg:flex-col max-lg:items-center">
        <div className="w-full max-w-2xl text-white flex flex-col gap-4">
          <p>{t('paragraph.first')}</p>
          <p>{t('paragraph.second')}</p>
          <p>{t('paragraph.third')}</p>
        </div>
        <Image
          src={'/test.jpg'}
          alt="Ukraine nature"
          width={500}
          height={100}
          className="rounded-3xl w-full"
        />
      </div>
    </section>
  );
};
