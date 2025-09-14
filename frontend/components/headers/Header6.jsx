"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/data/socials";
export default function Header6() {
  return (
    <header className="relative wrapper !bg-transparent !opacity-100 p-3">
      <nav className="navbar navbar-expand-lg center-nav transparent navbar-light">
        <div className="container xl:!flex-row lg:!flex-row !flex-nowrap items-center">
          <div className="navbar-brand w-full">
            <h2 className="text-3xl font-serif"><a href='/' className="!text-black">E-learning</a></h2>
          </div>
          <div className="navbar-collapse offcanvas offcanvas-nav offcanvas-start">
            <div className="offcanvas-header xl:!hidden lg:!hidden flex items-center justify-between flex-row p-6">
              <h3 className="!text-white xl:!text-[1.5rem] !text-[calc(1.275rem_+_0.3vw)] !mb-0">
                <a href='/'>E-learning</a>
              </h3>
              <button
                type="button"
                className="btn-close btn-close-white !mr-[-0.75rem] m-0 p-0 leading-none !text-[#343f52] transition-all duration-[0.2s] ease-in-out border-0 motion-reduce:transition-none before:text-[1.05rem] before:text-white before:content-['\ed3b'] before:w-[1.8rem] before:h-[1.8rem] before:leading-[1.8rem] before:shadow-none before:transition-[background] before:duration-[0.2s] before:ease-in-out before:!flex before:justify-center before:items-center before:m-0 before:p-0 before:rounded-[100%] hover:no-underline bg-inherit before:bg-[rgba(255,255,255,.08)] before:font-Unicons hover:before:bg-[rgba(0,0,0,.11)]"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body xl:!ml-auto lg:!ml-auto flex flex-col !h-full">
            </div>
          </div>
          <div className="navbar-other w-full !flex !ml-auto">
            <ul className="navbar-nav !flex-row !items-center !ml-auto">
              <li className="nav-item">
                <a
                  href="/signin"
                  className="nav-link"
                  aria-current="page"
                >
                  Sign In
                </a>
              </li>
              <li className="nav-item hidden xl:block lg:block md:block">
                <a
                  href="/signup"
                  className="btn btn-sm btn-primary !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]"
                  aria-current="page"

                >
                  Sign Up
                </a>
              </li>
              <li className="nav-item xl:!hidden lg:!hidden">
                <button className="hamburger offcanvas-nav-btn">
                  <span />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </header>
  );
}
