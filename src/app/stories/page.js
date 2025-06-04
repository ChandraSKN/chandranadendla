// app/stories/page.js
import Link from 'next/link';
import { getStoriesIndex } from '../../../lib/stories';
import Image from 'next/image';

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
          Stories Grid: now full-width and responsive
         ------------------------------------------------- */}
      <section
        className="
          w-full
          px-4              /* small horizontal padding so cards don’t touch the very edge */
          py-6
          grid
          gap-6             /* space between cards */
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
        "
      >
        {stories.map(
          ({ id, title, date, tags, thumbnail, description }) => (
            <Link href={`/stories/${id}`} key={id} className="group">
              <div
                className="
                  bg-white
                  rounded-lg
                  shadow-lg
                  overflow-hidden
                  transform
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                  flex
                  flex-col
                "
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={thumbnail || '/images/default-thumb.jpg'}
                    alt={`${title} thumbnail`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 mb-1">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(date).toLocaleDateString()}
                  </p>
                  {description && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {description}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </section>
    </main>
  );
}
