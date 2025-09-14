import Footer5 from "@/components/footers/Footer5";
import Header6 from "@/components/headers/Header6";

import Signup from "@/components/utility/Signup";
import React from "react";

export const metadata = {
  title:
    "Signup",
};
export default function SignupPage() {
  return (
    <>
      <div className="grow shrink-0 h-full" >
        <Header6 />
        <Signup />
      </div>
    </>
  );
}
