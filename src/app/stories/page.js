// app/stories/page.js
import Link from 'next/link';
import { getStoriesIndex } from '../../../lib/stories';
import Image from 'next/image';

export default function StoriesIndex() {
  const stories = getStoriesIndex();

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-64"
        style={{ backgroundImage: "url('/images/stories-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold mb-4">Stories</h1>
          <p className="text-lg">Dive into my bite-sized tales—each one a window into another world.</p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto p-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
        {stories.map(({ id, title, date, tags, thumbnail, description }) => (
          <Link href={`/stories/${id}`} key={id}>
            <h2 className="group block bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <Image
                  src={thumbnail || '/images/default-thumb.jpg'}
                  alt={`${title} thumbnail`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 mb-2">
                  {title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(date).toLocaleDateString()}
                </p>
                {description && (
                  <p className="text-gray-600 line-clamp-3 mb-4">{description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {tags?.map(tag => (
                    <span key={tag} className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </h2>
          </Link>
        ))}
      </section>
    </main>
  );
}   
