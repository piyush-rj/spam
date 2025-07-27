import MainNavbar from "@/src/Components/navbars/MainNavbar";
import { cn } from "@/lib/utils";
import DisplayApp from "@/src/Components/core/DisplayApp";

export default function Home() {
  return (
    <div className={cn("min-h-screen w-full bg-light-base dark:bg-dark-primary select-none ")}>
      <MainNavbar />
      <div className="mx-auto max-w-7xl px-4 pt-60 flex flex-col gap-12">

        {/* <HeroSection /> */}
        <DisplayApp/>

        {/* <section className="w-full">
          <AboutSection />
        </section> */}

      </div>
    </div>
  );
}
