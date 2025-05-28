import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const CallToAction = () => {
  const t = useTranslations('Landing.CallToAction');

  return (
    <section className="px-8 py-16 text-center" id="call-to-action">
      <h3 className="text-3xl font-bold mb-4 text-white">{t('title')}</h3>
      <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">{t('subtitle')}</p>
      <Link
        href={'/near-events'}
        className="btn-primary text-white px-6 py-3 rounded-lg text-lg bg-blue-400 hover:bg-blue-500 transition-colors cursor-pointer"
      >
        {t('button.getApp')}
      </Link>
    </section>
  );
};
