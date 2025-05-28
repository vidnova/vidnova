import { useTranslations } from "next-intl";

export const WhyItMatters = () => {
  const t = useTranslations("Landing.WhyItMatters");

  return (
    <section className="px-8 py-16 bg-[#131313]">
      <h3 className="text-3xl font-bold text-center mb-12 text-white">
        {t("title")}
      </h3>
      <div className="max-w-3xl mx-auto text-gray-300 text-center">
        <p className="mb-4">{t("paragraph.first")}</p>
        <p className="mb-4">{t("paragraph.second")}</p>
        <p>{t("paragraph.third")}</p>
      </div>
    </section>
  );
};
