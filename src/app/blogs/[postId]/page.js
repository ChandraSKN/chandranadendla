// app/blog/[postId]/page.js
import { notFound } from 'next/navigation';
import { getSortedPostsData,getPostData } from '../../../../lib/posts';

export async function generateStaticParams() {
  return getSortedPostsData().map(post => ({ postId: post.id }));
}

export default async function Post({ params }) {
  const all = getSortedPostsData();
  if (!all.find(p => p.id === params.postId)) return notFound();

  const { title, date, contentHtml, tags } = await getPostData(params.postId);

  return (
    <main className="pt-16 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-extrabold mb-2">{title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(date).toLocaleDateString()}
      </p>
      <article className="prose prose-lg" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      {tags?.length > 0 && (
        <div className="mt-6">
          {tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 px-2 py-1 text-sm rounded mr-2">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
