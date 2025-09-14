import Header6 from "@/components/headers/Header6";
import Hero from "@/components/homes/Hero";
import React from "react";


export const metadata = {
  title:
    "E-learning",
};
export default function DemoPage5() {
  return (
    <>
      <div className="grow shrink-0 min-h-full">
        <Header6 />
        <>
          <Hero />
        </>
      </div>
    </>
  );
}
