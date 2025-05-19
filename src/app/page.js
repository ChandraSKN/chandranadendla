// app/page.tsx
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import SkillsHover from "./Skills";

export default function HomePage() {
  const startYear = 2020;
  const experienceYears = new Date().getFullYear() - startYear -1 ;

  return (
    <>
      {/* Hero / Intro */}
      {/* Hero / Intro */}
      <section
        id="hero"
        className="relative flex flex-col md:flex-row items-center justify-center bg-cover bg-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-4 py-20"
      >
        {/* Left: Profile Image */}
        <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
          <Image
            src="/Hero_image.png"
            alt="Chandra SK Nadendla"
            width={400}
            height={400}
            className=" border-radient-to-r from-purple-600"
          />
        </div>

        {/* Right: Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Product Manager
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6">
            Experienced in Product Design · Full Stack Development · Team
            Supervision · Product Management
          </h2>
          {/* Tagline */}
          <p className="text-lg italic mb-8">
            Learning, adapting, and bringing transferable skill sets to every
            project.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-12">
            <a
              href="/contact"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Me
            </a>
            <a
              href="/blog"
              className="px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Read My Blog
            </a>
          </div>

          {/* Down Chevron */}
          <a
            href="#about"
            className="block md:absolute bottom-8 mx-auto animate-bounce"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>
      </section>
      {/* About Me */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">About Me</h3>
            <p className="text-gray-700 mb-6">
              Innovative and results-driven Product Manager with a strong
              foundation in Mechanical Engineering, Robotics, and Product
              Design. After earning my MSc from the University of Glasgow, I’ve
              led R&D at ARC and shaped product strategy at Trinnovate. Over the
              past <strong>{experienceYears}+ years</strong>, I’ve combined CAD,
              3D modelling, and advanced simulation tools (ANSYS, Abaqus) with
              full-stack development (Angular, React, AWS, Azure) to deliver
              cost-effective, manufacturable solutions.
            </p>
            <ul className="space-y-3 text-gray-800">
              <li>
                <strong>{experienceYears}+ Years</strong> experience in working
                across different domains: served in large firms like Cognizant,
                various startups in diverse roles, and contributed to content
                creation for companies.
              </li>
              <li>
                <strong>Leadership Roles:</strong> Product Manager at
                Trinnovate; Business Development Executive at Geo Lands Doctor;
                Supervisor at Morrisons
              </li>
              <li>
                <strong>Technical Expertise:</strong> CAD & FEA (ANSYS, Abaqus);
                Additive Manufacturing; Angular, React, Python, MATLAB; AWS &
                Azure, Lean Manufacturing
              </li>
            </ul>
            <a
              href="/resume.pdf"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download Resume
            </a>
          </div>
          <div className="flex justify-center">
            <Image
              src="/Chandra.jpg"
              alt="Chandra SK Nadendla"
              width={300}
              height={300}
              className="rounded-full border-4 border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Skills */}

      <SkillsHover />

      {/* Services */}
      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">What I Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Designing */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">Product Designing</h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Concept Sketches & Ideation</li>
                <li>• CAD & 3D Modelling</li>
                <li>• Rapid Prototyping</li>
              </ul>
            </div>

            {/* Startup Ideas & Management */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">
                Startup Ideas & Management
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Business Model Ideation</li>
                <li>• Market Research & Validation</li>
                <li>• Strategic Planning</li>
              </ul>
            </div>

            {/* Product Handling & Operations */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">
                Product Handling & Management
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Supply Chain Coordination</li>
                <li>• Inventory & Logistics</li>
                <li>• Quality Control Processes</li>
              </ul>
            </div>

            {/* Film Stories & Content Creation */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-4">
                Film Stories & Content Creation
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Screenwriting & Storyboarding</li>
                <li>• Script Editing & Development</li>
                <li>• Content Strategy & Production</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio / Projects */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Recent Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Repeat for each project */}
            <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <Image
                src="/Spinodoid.png"
                alt="Project 1"
                width={300}
                height={300}
                className="object-cover"
              />
              <div className="p-4">
                <h5 className="font-semibold mb-2">Performance_Analysis_on_Spinodoid</h5>
                <p className="text-gray-600 mb-4">
                  
                </p>
                <a
                  href="/projects/robotics-simulator"
                  className="text-blue-600 hover:underline"
                >
                  View Details →
                </a>
              </div>
            </div>
            {/* …other project cards */}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto md:w-2/3">
          <h3 className="text-3xl font-bold text-center mb-8">Get In Touch</h3>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border rounded h-32"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
