"use client";

import { useEffect } from "react";

export default function PageLoader() {
  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById("pageLoader")) {
        document.getElementById("pageLoader").style.display = "none";
      }
    }, 1200);
  }, []);

  return (
    <>
      <div className="page-loader" id="pageLoader"></div>
    </>
  );
}
