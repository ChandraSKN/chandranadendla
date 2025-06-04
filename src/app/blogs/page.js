// app/blog/page.js
import Link from 'next/link';
import { getSortedPostsData } from '../../../lib/posts';

export default function BlogIndex() {
  const posts = getSortedPostsData();
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <ul className="space-y-4">
        {posts.map(({ id, title, date }) => (
          <li key={id}>
            <Link href={`/blogs/${id}`} className="text-blue-600 hover:underline">
              {title}
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
