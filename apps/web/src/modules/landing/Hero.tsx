import { useTranslations } from "next-intl";
import Link from "next/link";

export const Hero = () => {
  const t = useTranslations("Landing.Hero");

  return (
    <section className="flex flex-col items-center py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white mx-3 text-center">
        {t("title")}
      </h1>
      <h2 className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl text-center">
        {t("subtitle")}
      </h2>
      <Link
        href={"/near-events"}
        className="text-white px-6 py-3 rounded-lg text-lg bg-blue-400 hover:bg-blue-500 transition-colors cursor-pointer"
      >
        {t("button.start")}
      </Link>
    </section>
  );
};
