// ───────────────────────────────────────────────────────────
// app/youtube‐playlist/page.js
// ───────────────────────────────────────────────────────────
"use client";

import React, { useState } from "react";

/**
 * Example playlists object. 
 * Replace these with your own video IDs + titles.
 */
const playlists = {
  "My Favorites": [
    { id: "dQw4w9WgXcQ", title: "Rick Astley ‒ Never Gonna Give You Up" },
    { id: "9bZkp7q19f0", title: "PSY ‒ Gangnam Style" },
    { id: "3JZ_D3ELwOQ", title: "Mark Ronson ‒ Uptown Funk" },
    { id: "kJQP7kiw5Fk", title: "Luis Fonsi ‒ Despacito ft. Daddy Yankee" },
  ],
  "React Tutorials": [
    { id: "Ke90Tje7VS0", title: "React JS Crash Course 2021" },
    { id: "w7ejDZ8SWv8", title: "React Tutorial for Beginners" },
    { id: "dGcsHMXbSOA", title: "React Hooks Full Course" },
    { id: "F2JCjVSZlG0", title: "React Router Tutorial" },
  ],
};

export default function LearnPage() {
  // 1) Track which playlist is selected
  const playlistNames = Object.keys(playlists);
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlistNames[0]);

  // 2) Track the search term
  const [searchTerm, setSearchTerm] = useState("");

  // 3) Grab the videos for the currently selected playlist
  const videos = playlists[selectedPlaylist] || [];

  // 4) Filter videos by title (case‐insensitive)
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* ─────────────────────────────────────────────────
          Playlist Selector + Search Bar Container
         ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* 1A) Playlist Dropdown */}
        <div className="flex-shrink-0">
          <label htmlFor="playlist-select" className="sr-only">
            Choose Playlist
          </label>
          <select
            id="playlist-select"
            value={selectedPlaylist}
            onChange={(e) => {
              setSelectedPlaylist(e.target.value);
              setSearchTerm(""); // Clear search whenever playlist changes
            }}
            className="
              px-4 py-2 
              border border-gray-300 
              bg-white 
              rounded-lg 
              shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            "
          >
            {playlistNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* 1B) Search Input */}
        <div className="flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search Videos
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full 
              px-4 py-2 
              border border-gray-300 
              rounded-lg 
              shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            "
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────
          Grid of Video Cards (with embedded YouTube players)
         ───────────────────────────────────────────────── */}
      {filteredVideos.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          No videos found in “{selectedPlaylist}” matching “{searchTerm}.”
        </p>
      ) : (
        <div
          className="
            grid gap-6 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5
          "
        >
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="
                bg-white 
                rounded-lg 
                shadow-lg 
                overflow-hidden 
                flex flex-col 
                hover:scale-[1.02] 
                transition-transform 
                duration-200
              "
            >
              {/* 2A) Embedded YouTube Player 
                  We wrap in a 16:9 container using `pb-[56.25%]` trick */}
              <div className="relative pb-[56.25%] w-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* 2B) Video Title / Card Footer */}
              <div className="p-4">
                <h3 className="text-gray-800 font-semibold text-lg">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
