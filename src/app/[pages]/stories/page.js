// app/stories/page.js
import Link from "next/link";
import Image from "next/image";
import { getStoriesIndex } from "../../../lib/stories";
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card";

export default function StoriesIndex() {
  const stories = getStoriesIndex();

  return (
    <main className="min-h-screen bg-gray-100">
      {/* -------------------------------------------------
          Hero Section (still full-width by default)
         ------------------------------------------------- */}
      <section
        className="relative bg-cover bg-center h-64 w-full"
        style={{ backgroundImage: "url('/images/stories-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold mb-4">Stories</h1>
          <p className="text-lg">
            Dive into my bite-sized tales—each one a window into another world.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------
          Stories Grid: 4 cards per row, extra wrap to next row
         ------------------------------------------------- */}
      <section
        className="
          w-full
          px-1              /* small horizontal padding so cards don’t touch the very edge */
          py-6
          grid
          gap-8             /* increased gap between cards */
          grid-cols-1       /* 1 column on very small screens */
          sm:grid-cols-2    /* 2 columns on small screens */
          md:grid-cols-4    /* 4 columns on md+ screens; extra cards wrap to next row */
        "
      >
        {stories.map(
          ({ id, title, date, tags, thumbnail, description }) => (
            <Link href={`/stories/${id}`} key={id} className="group">
              <CardContainer className="inter-var">
                <CardBody
                  className="
                    bg-white 
                    relative 
                    group/card  
                    dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] 
                    dark:bg-black dark:border-white/[0.2] 
                    border-black/[0.1] 
                    w-full sm:w-auto 
                    h-auto 
                    rounded-xl 
                    p-6 
                    border
                    transition-transform hover:-translate-y-1 hover:shadow-xl
                  "
                >
                  {/* Thumbnail (3D transform) */}
                  <CardItem translateZ="50" className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={thumbnail || "/images/default-thumb.jpg"}
                      alt={`${title} thumbnail`}
                      fill
                      className="object-cover transition-transform group-hover/card:scale-105"
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                  </CardItem>

                  {/* Title */}
                  <CardItem
                    translateZ="40"
                    as="h2"
                    className="text-xl font-semibold text-gray-800 group-hover/text-indigo-600 mb-1 dark:text-white"
                  >
                    {title}
                  </CardItem>

                  {/* Date */}
                  <CardItem
                    translateZ="30"
                    as="p"
                    className="text-sm text-gray-500 mb-2 dark:text-neutral-300"
                  >
                    {new Date(date).toLocaleDateString()}
                  </CardItem>

                  {/* Description (clamped) */}
                  {description && (
                    <CardItem
                      translateZ="20"
                      as="p"
                      className="text-gray-600 line-clamp-3 mb-4 dark:text-neutral-300"
                    >
                      {description}
                    </CardItem>
                  )}

                  {/* Tags */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                      <CardItem
                        key={tag}
                        translateZ="20"
                        as="span"
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs rounded dark:bg-indigo-800/20 dark:text-indigo-200"
                      >
                        #{tag}
                      </CardItem>
                    ))}
                  </div>
                </CardBody>
              </CardContainer>
            </Link>
          )
        )}
      </section>
    </main>
  );
}
