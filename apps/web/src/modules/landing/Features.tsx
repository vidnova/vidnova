import { useTranslations } from "next-intl";
import { Card } from "./common";

export const Features = () => {
  const t = useTranslations("Landing.Features");

  return (
    <section className="px-8 py-16" id="features">
      <h3 className="text-3xl font-bold text-center mb-12 text-white">
        {t("title")}
      </h3>
      <div className="flex flex-wrap justify-center gap-8">
        <Card
          className="max-w-96 w-full"
          title={t("featureTitle.first")}
          description={t("featureDescription.first")}
        />
        <Card
          className="max-w-96 w-full"
          title={t("featureTitle.second")}
          description={t("featureDescription.second")}
        />
        <Card
          className="max-w-96 w-full"
          title={t("featureTitle.third")}
          description={t("featureDescription.third")}
        />
        <Card
          className="max-w-96 w-full"
          title={t("featureTitle.fourth")}
          description={t("featureDescription.fourth")}
        />
      </div>
    </section>
  );
};
