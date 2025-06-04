// app/journey/page.js
import Link from 'next/link';
import { getJourneyIndex } from '../../../lib/journey';
import Image from 'next/image';

export default function JourneyIndex() {
  const journeys = getJourneyIndex();

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      {/* Introduction with background */}
      <section className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-12 rounded-lg shadow-lg mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to My Journey Page</h1>
        <p className="text-lg">
          Explore my journey through a series of posts highlighting key milestones, experiences, and reflections.
        </p>
      </section>

      {/* Journey Cards */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map(({ id, title, date, tags, thumbnail }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Thumbnail image */}
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={`${title} thumbnail"`}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <Link href={`/journey/${id}`}>
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-indigo-600 mb-2 block">{title}</h2>
                </Link>

                <p className="text-sm text-gray-500 mb-4">
                  {new Date(date).toLocaleDateString()}
                </p>

                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
