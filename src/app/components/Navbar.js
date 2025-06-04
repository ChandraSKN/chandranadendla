// 'use client'
// import { useState } from 'react'
// import Link from 'next/link'

// export default function Navbar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <nav className="fixed top-0 w-full z-50 bg-white backdrop-blur-md shadow-md">
//       <div className="container mx-auto px-6 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-extrabold tracking-wide text-gray-900">
//           Chandra Sai Kamal Nadendla        </Link>

//         {/* Hamburger */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="md:hidden text-gray-900 focus:outline-none"
//           aria-label="Toggle menu"
//         >
//           {open ? (
//             <span className="text-3xl">✕</span>
//           ) : (
//             <span className="text-3xl">☰</span>
//           )}
//         </button>

//         {/* Menu Items */}
//         <ul className={`md:flex md:items-center md:space-x-6 ${open ? 'block' : 'hidden'}`}>
//           {[
//             { href: '/professional', label: "Portfolio"},
//             { href: '/blogs', label: 'Blogs' },
//             { href: '/stories', label: 'Stories' },
//             { href: '/journey', label: 'My Journey' },
//             { href: '/learn', label: "Let's learn "},

//           ].map(({ href, label }) => (
//             <li key={href} className="mt-4 md:mt-0">
//               <Link
//                 href={href}
//                 className="relative text-gray-900 hover:text-blue-600 transition"
//               >
//                 <span className="after:block after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
//                   {label}
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </nav>

//   )}

// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Replace these with the icon+label pairs you want in the “middle” of the bar.
  const menuItems = [
    {
      href: "/professional",
      label: "Portfolio",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Adjust path if needed */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      href: "/blogs",
      label: "Blogs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      href: "/stories",
      label: "Stories",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      href: "/learn",
      label: "Let's Learn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Circle outline */}
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          />
          {/* “Play” triangle */}
          <polygon points="10,8 16,12 10,16" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bg-gray-700 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        {/* 1) Site Title */}
        <Link href="/" className="text-2xl font-bold text-gray-50">
          Chandra Sai Kamal Nadendla
        </Link>

        {/* 2) Hamburger Button for Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-50 focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? (
            <span className="text-3xl">✕</span>
          ) : (
            <span className="text-3xl">☰</span>
          )}
        </button>

        {/* 3) Menu Item Containers */}
        {/* On md+ screens, show flex layout; on smaller, show if open */}
        <div
          className={`${
            open ? "block" : "hidden"
          } md:flex md:items-center md:space-x-10`}
        >
          {menuItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center space-x-2 mt-4 md:mt-0"
            >
              <span>{icon}</span>
              <span className="text-gray-50">{label}</span>
            </Link>
          ))}
        </div>

        {/* 4) Search Bar (visible on lg+) */}
        <div className="lg:flex hidden items-center space-x-2 bg-white py-1 px-2 rounded-full ml-6">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            className="outline-none text-gray-700"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
    </nav>
  );
}
