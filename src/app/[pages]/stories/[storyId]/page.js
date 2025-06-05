// app/stories/[storyId]/page.js
import { notFound } from "next/navigation";
import { getStoriesIndex,getStoryData } from "../../../../lib/stories";

export async function generateStaticParams() {
  return getStoriesIndex().map(s => ({ storyId: s.id }));
}

export default async function StoryPage({ params }) {
  const all = getStoriesIndex();
  if (!all.find(s => s.id === params.storyId)) return notFound();

  const { title, date, contentHtml } = await getStoryData(params.storyId);

  return (
    <article className="prose prose-lg mx-auto py-16 px-4 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(date).toLocaleDateString()}
      </p>
      <section dangerouslySetInnerHTML={{ __html: contentHtml }} />
      
      {/* Optional: Navigation */}
      <div className="mt-12 flex justify-between text-indigo-600">
        {/* you could compute prev/next here */}
      </div>
    </article>
  );
}
