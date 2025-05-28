import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Landing.Footer");

  return (
    <footer className="px-8 py-12 text-center">
      <p className="text-lg mb-4 text-white">{t("title")}</p>
      <p className="text-gray-400">{t("contact")}</p>
    </footer>
  );
};
