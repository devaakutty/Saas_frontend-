import { Suspense } from "react";
import RegisterContent from "./RegisterContent";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

function RegisterLoading() {
  return (
    <div
      className={`${inter.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b1f3a] via-[#23265a] to-[#2b2e63] relative overflow-hidden text-white`}
    >
      {/* Glow Effects */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[140px] rounded-full" />

      <div className="relative z-10 text-center space-y-6">
        <h1
          className={`${playfair.className} text-4xl md:text-6xl font-light`}
        >
          Preparing your
          <span className="block font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Experience
          </span>
        </h1>

        {/* Animated shimmer bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-1/2 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse rounded-full" />
        </div>

        <p className="text-gray-300 text-sm tracking-wide">
          Please wait while we set things up...
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterContent />
    </Suspense>
  );
}
