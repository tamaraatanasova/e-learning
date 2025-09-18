"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center h-screen bg-gradient-to-br from-[#f0f4ff] via-[#ffffff] to-[#eef2ff] overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#3f78e0] opacity-20 animate-blob mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-[#16a34a] opacity-20 animate-blob animation-delay-2000 mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute top-1/3 left-2/3 w-96 h-96 rounded-full bg-[#f59e0b] opacity-10 animate-blob animation-delay-4000 mix-blend-multiply filter blur-3xl"></div>

      <motion.div
        className="relative text-center max-w-3xl px-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#111827] leading-tight drop-shadow-sm">
          Learn. Build. <span className="text-[#3f78e0]">Grow.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[#4b5563] leading-relaxed">
          Unlock your potential with hands-on learning. Master skills that take you from{" "}
          <span className="font-semibold text-[#16a34a]">beginner</span> to{" "}
          <span className="font-semibold text-[#f59e0b]">expert</span>.
        </p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link
            href="/signup"
            className="px-8 py-3 rounded-2xl bg-[#3f78e0] text-white font-medium shadow-md hover:shadow-lg hover:bg-[#3b6fd0] transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            href="/signin"
            className="px-8 py-3 rounded-2xl border border-[#3f78e0] text-[#3f78e0] font-medium hover:bg-[#3f78e0] hover:!text-white transition-all duration-300"
          >
            Login 
          </Link>
        </motion.div>
      </motion.div>

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
    </section>
  );
}
