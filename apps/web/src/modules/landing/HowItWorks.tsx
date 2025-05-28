import { useTranslations } from "next-intl";
import { Card } from "./common";

export const HowItWorks = () => {
  const t = useTranslations("Landing.HowItWorks");

  return (
    <section className="px-8 py-16 bg-[#131313]" id="how-it-works">
      <h3 className="text-3xl font-bold text-center mb-12 text-white">
        {t("title")}
      </h3>
      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
        <Card
          className="flex-1"
          title={t("stepTitle.first")}
          description={t("stepDescription.first")}
        />
        <Card
          className="flex-1"
          title={t("stepTitle.second")}
          description={t("stepDescription.second")}
        />
        <Card
          className="flex-1"
          title={t("stepTitle.third")}
          description={t("stepDescription.third")}
        />
      </div>
    </section>
  );
};
