// app/page.tsx
import Image from "next/image";
import SkillsHover from "../Skills";
import Link from "next/link";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";

export default function HomePage() {
  const startYear = 2020;
  const experienceYears = new Date().getFullYear() - startYear - 1;
  const words ='Product Manager, Full‐Stack Engineer and Product Designer with ' + experienceYears + ' years of experience in Mechanical Engineering, Robotics, and Web Technologies. I build end‐to‐end solutions—from CAD models to cloud‐based dashboards'

  return (
    <>
      {/* ─────────────────────────────────────────────────
          1) Hero Section
         ───────────────────────────────────────────────── */}
      <section
        id="hero"
        className="
    bg-gradient-to-b from-blue-600 to-indigo-700 
    text-white 
    py-15 
    px-4
  "
      >
        <div className="container mx-auto flex flex-col items-center justify-center text-center gap-8 min-h-[60vh]">
          {/* Centered Text Block */}
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold">
              Hi, I’m Chandra SK Nadendla
            </h1>
            <TextGenerateEffect words={words} />;
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#portfolio"
                className="
            inline-block px-6 py-3 
            bg-white text-blue-600 
            rounded-md font-medium 
            hover:bg-gray-100 transition
          "
              >
                View Projects
              </Link>
              <Link
                href="/resume.pdf"
                className="
            inline-block px-6 py-3 
            border-2 border-white 
            text-white 
            rounded-md font-medium 
            hover:bg-white hover:text-blue-600 transition
          "
              >
                Download Resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          2) About Me
         ───────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-white px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About Me</h2>
            <p className="text-gray-700 leading-relaxed">
              Innovative and results-driven Product Manager with a strong
              foundation in Mechanical Engineering, Robotics, and Product
              Design. After earning my MSc from the University of Glasgow, I’ve
              led R&D at ARC and shaped product strategy at Trinnovate. Over the
              past <strong>{experienceYears} years</strong>, I’ve combined CAD,
              3D modelling, and advanced simulation tools (ANSYS, Abaqus) with
              full-stack development (Angular, React, AWS, Azure) to deliver
              cost-effective, manufacturable solutions.
            </p>
            <ul className="space-y-3 text-gray-800 list-disc list-inside">
              <li>
                <strong>{experienceYears} years</strong> of diverse domain
                experience: large firms (Cognizant) → startups → R&D labs.
              </li>
              <li>
                <strong>Leadership Roles:</strong> Product Manager at
                Trinnovate; Business Dev Exec at Geo Lands Doctor; Supervisor at
                Morrisons.
              </li>
              <li>
                <strong>Technical Expertise:</strong> CAD & FEA (ANSYS, Abaqus);
                Additive Manufacturing; Angular, React, Python, MATLAB; AWS &
                Azure; Lean Manufacturing.
              </li>
            </ul>
            <Link
              href="/resume.pdf"
              className="
                inline-block 
                mt-4 
                px-6 py-3 
                bg-blue-600 text-white 
                rounded-md font-medium 
                hover:bg-blue-700 transition
              "
            >
              Download Resume
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl">
              <Image
                src="/chandranadendla/Chandra.jpg"
                alt="Chandra SK Nadendla"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          3) Skills
         ───────────────────────────────────────────────── */}
      <section id="skills" className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Skills &amp; Technologies
          </h2>
         <SkillsHover/>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          4) What I Offer
         ───────────────────────────────────────────────── */}
      <section id="services" className="py-20 bg-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What I Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Product Designing",
                items: [
                  "Concept Sketches",
                  "CAD & 3D Modelling",
                  "Rapid Prototyping",
                ],
              },
              {
                title: "Startup Strategy",
                items: [
                  "Business Model Ideation",
                  "Market Research",
                  "Strategic Planning",
                ],
              },
              {
                title: "Product Management",
                items: [
                  "Roadmapping & Specs",
                  "Stakeholder Coordination",
                  "Launch & Metrics",
                ],
              },
              {
                title: "Content Creation",
                items: [
                  "Screenwriting & Storyboarding",
                  "Script Editing",
                  "Content Strategy",
                ],
              },
            ].map((svc) => (
              <div
                key={svc.title}
                className="
                  bg-gray-50 
                  rounded-lg 
                  shadow-md 
                  p-6 
                  flex flex-col 
                  hover:shadow-lg 
                  transition-shadow
                "
              >
                <h3 className="text-xl font-semibold mb-4">{svc.title}</h3>
                <ul className="text-gray-700 space-y-2 flex-grow list-disc list-inside">
                  {svc.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          5) Portfolio / Projects
         ───────────────────────────────────────────────── */}
      <section id="portfolio" className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recent Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Robotics Simulator",
                image: "/chandranadendla/Spinodoid.png",
                href: "/projects/robotics-simulator",
              },
              {
                title: "Spinodoid Performance",
                image: "/chandranadendla/Spinodoid.png",
                href: "/projects/spinodoid",
              },
              {
                title: "Web App Dashboard",
                image: "/chandranadendla/Spinodoid.png",
                href: "/projects/dashboard",
              },
            ].map((proj) => (
              <Link
                key={proj.title}
                href={proj.href}
                className="
                  block 
                  overflow-hidden 
                  rounded-lg 
                  shadow-lg 
                  hover:shadow-2xl 
                  transition-shadow
                "
              >
                <div className="relative w-full h-56">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold">{proj.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          6) Contact
         ───────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-white px-4">
        <div className="container mx-auto md:w-2/3">
          <h2 className="text-3xl font-bold text-center mb-8">Get In Touch</h2>
          <form className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition resize-none h-40"
            />
            <button
              type="submit"
              className="
                mt-4 
                w-full 
                px-6 py-4 
                bg-blue-600 text-white 
                rounded-md font-semibold 
                hover:bg-blue-700 transition
              "
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
