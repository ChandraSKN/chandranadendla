// components/SkillsHover.tsx
"use client";
import React from "react";

const skillGroups = [
  {
    title: "Mechanical",
    items: [
      { name: "CAD & 3D Modelling", pct: 90 },
      { name: "FEA (ANSYS, Abaqus)", pct: 85 },
      { name: "Additive Manufacturing", pct: 80 },
      { name: "Product Design & Simulation", pct: 88 },
    ],
  },
  {
    title: "Software",
    items: [
      { name: "Angular & React", pct: 88 },
      { name: "Python & MATLAB", pct: 82 },
      { name: "AWS & Azure", pct: 80 },
      { name: "Next.js & Tailwind CSS", pct: 92 },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Product Management", pct: 90 },
      { name: "Team Supervision", pct: 88 },
      { name: "Client Engagement", pct: 85 },
      { name: "Business Development", pct: 82 },
    ],
  },
];

export default function SkillsHover() {
  return (
    <section id="skills" className="bg-gray-50 overflow-visible">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="relative bg-white rounded-lg shadow p-6 group cursor-pointer overflow-visible"
            >
              <h4 className="text-lg font-semibold mb-2">{group.title}</h4>

              {/* Hover dialog drops down */}
              <div
                className="
    absolute left-0 top-full mt-2 w-full 
    bg-white bg-opacity-90 backdrop-blur-sm 
    rounded-lg shadow-lg p-4 
    opacity-0 pointer-events-none 
    group-hover:opacity-100 group-hover:pointer-events-auto 
    transition-opacity duration-200 
    z-50
  "
              >
                {group.items.map(({ name, pct }) => (
                  <div key={name} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>{name}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
