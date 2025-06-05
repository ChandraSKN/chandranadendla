"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import { CardStack } from "./components/ui/card-stack";
import { Boxes } from "./components/ui/background-boxes";
import { cn } from "../../lib/utils";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Background container with Boxes */}
      <div className="relative w-full h-screen overflow-hidden bg-slate-900">
        {/* Overlay mask to fade boxes toward the center */}
        <div
          className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"
        />

        {/* Render the animated boxes behind */}
        <Boxes />

        {/* Content (image + card stack) */}
        {/* ↓ pointer-events-none so Boxes can detect hover, but links override below */}
        <div className="relative z-30 flex flex-col md:flex-row items-center justify-center text-white px-4 py-20 h-full pointer-events-none">
          {/* Left: Profile Image (hidden on small screens) */}
          <div className="hidden md:flex md:w-1/2 justify-center mb-8 md:mb-0">
            <Image
              src="/chandranadendla/Hero_image.png"
              alt="Chandra SK Nadendla"
              width={500}
              height={400}
              className="rounded-full"
            />
          </div>

          {/* Right: Card Stack (full width on small, half on md+) */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="h-[40rem] flex items-center justify-center w-full">
              <CardStack items={CARDS} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

import Link from "next/link";

const CARDS = [
  {
    id: 0,
    name: "Portfolio",
    designation: "Work Experience",
    content: (
      <p>
        Please go to my{" "}
        <Link href="/professional" className="pointer-events-auto">
            portfolio
        </Link>{" "}
        to check my work experience.
      </p>
    ),
  },
  {
    id: 1,
    name: "Blog",
    designation: "Experiences & Facts",
    content: (
      <p>
        Check my{" "}
        <Link href="/blogs" className="pointer-events-auto">
          
            Blogs
        </Link>{" "}
        to learn about my experiences and interesting facts.
      </p>
    ),
  },
  {
    id: 2,
    name: "Stories",
    designation: "Fiction Lover",
    content: (
      <p>
        Are you a fiction lover?{" "}
        <Link href="/stories" className="pointer-events-auto">
            Checkout my stories
        </Link>
        !
      </p>
    ),
  },
];
