import Pricing from "@/components/common/Pricing";
import Footer5 from "@/components/footers/Footer5";
import About from "@/components/homes/home-13/About";
import Cta from "@/components/homes/home-4/Cta";
import PageLoader from "@/components/utility/PageLoader";
import React from "react";

export default function PageLoaderPage() {
  return (
    <>
      <PageLoader />
      <section className="wrapper !bg-[#edf2fc]">
        <div className="container pt-10 pb-36 xl:pt-[4.5rem] lg:pt-[4.5rem] md:pt-[4.5rem] xl:pb-40 lg:pb-40 md:pb-40 !text-center">
          <div className="flex flex-wrap mx-[-15px]">
            <div className="md:w-8/12 lg:w-7/12 xl:w-6/12 xxl:w-4/12 w-full flex-[0_0_auto] !px-[15px] max-w-full !mx-auto !mb-14">
              <h1 className="!text-[calc(1.365rem_+_1.38vw)] font-bold !leading-[1.2] xl:!text-[2.4rem] !mb-3">
                Page Loader
              </h1>
              <p className="lead text-[0.9rem] font-medium !mb-3">
                To enable page loader, after body tag, add:
              </p>
              <mark className="doc">
                &lt;div className="page-loader"&gt;&lt;/div&gt;
              </mark>
            </div>
          </div>
        </div>
      </section>
      <About />
      <Cta font="!text-[calc(1.305rem_+_0.66vw)] font-bold xl:!text-[1.8rem] !leading-[1.3] lg:!px-10 xl:!px-16 xxl:!px-10 !mb-10 !text-white !relative z-[2]" />
      <Pricing />
      <Footer5 />
    </>
  );
}
