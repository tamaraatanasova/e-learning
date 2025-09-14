"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      <section className="relative overflow-hidden h-[91%] bg-gradient-to-b from-[#f0f4ff] to-[#ffffff]">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#3f78e0] opacity-20 animate-blob mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-32 -right-24 w-72 h-72 rounded-full bg-[#16a34a] opacity-20 animate-blob animation-delay-2000 mix-blend-multiply filter blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-[#f59e0b] opacity-10 animate-blob animation-delay-4000 mix-blend-multiply filter blur-3xl"></div>

        <div className="container relative pt-20 pb-20 xl:pt-[4.5rem] lg:pt-[4.5rem] md:pt-[4.5rem] xl:pb-40 lg:pb-40 md:pb-40 text-center">
          <motion.div
            className="md:w-10/12 lg:w-8/12 xl:w-8/12 xxl:w-6/12 w-full mx-auto mb-16 px-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-[calc(1.365rem_+_1.38vw)] font-bold leading-[1.2] xl:text-[2.4rem] mb-4 text-[#111827]">
              Skills That Take You Further
            </h1>
            <p className="text-[1.05rem] leading-[1.6] xl:px-14 xxl:px-6 mb-7 text-[#4b5563]">
              From beginner to expert, get the tools you need to level up your career.
            </p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link
                href="/signup"
                className="inline-block text-white bg-[#3f78e0] border-[#3f78e0] rounded px-6 py-3 font-medium hover:bg-[#3b6fd0] hover:border-[#3b6fd0] transition-colors duration-300"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
