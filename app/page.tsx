import { Spacer } from "@nextui-org/spacer";

import { Hero } from "@/components/marketing/hero";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { UpscalerIntro } from "@/components/marketing/intros/upscaler-intro";
import { BgRemoverIntro } from "@/components/marketing/intros/bgremover-intro";
import { ColorizerIntro } from "@/components/marketing/intros/colorizer-intro";
import { DenoiserIntro } from "@/components/marketing/intros/denoiser-intro";
import { DeblurerIntro } from "@/components/marketing/intros/deblurer-intro";
import { A11yOtb } from "@/components/marketing/a11y-otb";
import { DarkMode } from "@/components/marketing/dark-mode";
import { Customization } from "@/components/marketing/customization";
import { LastButNotLeast } from "@/components/marketing/last-but-not-least";
import { InstallBanner } from "@/components/marketing/install-banner";
import { Community } from "@/components/marketing/community";
import { Support } from "@/components/marketing/support";
import landingContent from "@/content/landing";
import { getAllSponsors } from "@/utils/get-all-sponsors";

import { Sponsors } from "@/components/marketing/sponsors";

async function getData() {
  try {
    const sponsors = await getAllSponsors();

    return {
      sponsors,
    };
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

export default async function Home() {
  // const data = await getData();

  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow">
      <section className="flex flex-col items-center justify-center">
        <Hero />
        <FeaturesGrid features={landingContent.topFeatures} />
        {/* <Sponsors /> */}
        <UpscalerIntro size="lg" />
        <BgRemoverIntro size="lg" isExampleFront />
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
