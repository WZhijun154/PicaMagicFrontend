import { Spacer } from "@nextui-org/spacer";

import { Hero } from "@/components/marketing/hero";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { UpscalerIntro } from "@/components/marketing/intros/upscaler-intro";
import { BgRemoverIntro } from "@/components/marketing/intros/bgremover-intro";
import { ColorizerIntro } from "@/components/marketing/intros/colorizer-intro";
import { DenoiserIntro } from "@/components/marketing/intros/denoiser-intro";
import { DeblurerIntro } from "@/components/marketing/intros/deblurer-intro";
import { InstallBanner } from "@/components/marketing/install-banner";
import { Community } from "@/components/marketing/community";
import { Support } from "@/components/marketing/support";
import { getAllSponsors } from "@/utils/get-all-sponsors";

import { Sponsors } from "@/components/marketing/sponsors";
import { getDictionary } from "@/get-dictionary";
import { getFeatures } from "@/content/landing";
import { Locale } from "@/i18n-config";
import { Image } from "@nextui-org/image";
// import { Video } from "@/background/webm-bg";
// async function getData() {
//   try {
//     const sponsors = await getAllSponsors();

//     return {
//       sponsors,
//     };
//   } catch (error) {
//     throw new Error("Failed to fetch data");
//   }
// }

export default async function Home({ params }: { params: { lang: Locale } }) {
  // const data = await getData();
  const dictionary = await getDictionary(params.lang);
  const features = await getFeatures(dictionary);

  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow">
      <section className="flex flex-col items-center justify-center">
        {/* <Video /> */}
        {/* <Image
          src="/color4bg_2024-08-18_10_27_38.png"
          alt="background image"
          className="-z-1 fixed w-[100%] h-[100%] -left-[0%] top-0"
        /> */}
        <div className="animate-[slideInFromLeft_1s_ease-out] w-full">
          <Hero />
        </div>
        <div className="animate-[fadeIn_1s_ease-out,slideUp_1s_ease-out] w-full">
          <FeaturesGrid features={features.topFeatures} />
        </div>
        {/* <Sponsors /> */}
        <UpscalerIntro size="lg" />
        <BgRemoverIntro size="lg" isExampleFront dictionary={dictionary} />
        <ColorizerIntro size="lg" />
        <DenoiserIntro size="lg" isExampleFront />
        <DeblurerIntro size="lg" />
        {/* <A11yOtb /> */}
        {/* <DarkMode /> */}
        {/* <Customization /> */}
        {/* <LastButNotLeast /> */}
        {/* <Support sponsors={data.sponsors} /> */}
        <Spacer y={24} />
        {/* <InstallBanner /> */}
        {/* <Community /> */}
        <Spacer y={24} />
      </section>
    </main>
  );
}
