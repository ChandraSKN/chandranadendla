"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import { CardStack } from "./components/ui/card-stack";
import { cn } from "../../lib/utils";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <section
        id="hero"
        className="
          relative flex flex-col md:flex-row 
          items-center justify-center 
          bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 
          text-white px-4 py-20
          h-screen
        "
      >
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
      </section>

      <Footer />
    </>
  );
}

const CARDS = [
  {
    id: 0,
    name: "Portfolio",
    designation: "Work Experience",
    content: (
      <p>
        Please go to my <strong>portfolio</strong> to check my work experience.
      </p>
    ),
  },
  {
    id: 1,
    name: "Blog",
    designation: "Experiences & Facts",
    content: (
      <p>
        Check my <strong>blogs</strong> to learn about my experiences and
        interesting facts.
      </p>
    ),
  },
  {
    id: 2,
    name: "Stories",
    designation: "Fiction Lover",
    content: (
      <p>
        Are you a fiction lover? <strong>Checkout my stories</strong>!
      </p>
    ),
  },
];
