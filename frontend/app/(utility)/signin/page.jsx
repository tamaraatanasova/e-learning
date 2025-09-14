import Header6 from "@/components/headers/Header6";
import Signin from "@/components/utility/Signin";
import React from "react";

export const metadata = {
  title:
    "Signin",
};
export default function SigninPage1() {
  return (
    <>
      <div className="grow shrink-0 h-[100vh] ">
        <Header6 />
        <Signin />
      </div>
    </>
  );
}
