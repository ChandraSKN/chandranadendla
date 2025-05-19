'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-gray-900">
          Chandra Sai Kamal Nadendla        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? (
            <span className="text-3xl">✕</span>
          ) : (
            <span className="text-3xl">☰</span>
          )}
        </button>

        {/* Menu Items */}
        <ul className={`md:flex md:items-center md:space-x-6 ${open ? 'block' : 'hidden'}`}>
          {[
            { href: '/blogs', label: 'Blog' },
            { href: '/stories', label: 'Stories' },
            { href: '/journey', label: 'My Journey' },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <li key={href} className="mt-4 md:mt-0">
              <Link
                href={href}
                className="relative text-gray-900 hover:text-blue-600 transition"
              >
                <span className="after:block after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )}