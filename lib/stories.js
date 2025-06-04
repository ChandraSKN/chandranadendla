// lib/stories.js
import fs   from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html   from "remark-html";
import remarkGfm from "remark-gfm";

const storiesDir = path.join(process.cwd(), "stories-posts");

export function getStoriesIndex() {
  return fs.readdirSync(storiesDir)
    .map(file => {
      const id = file.replace(/\.md$/, "");
      const full = fs.readFileSync(path.join(storiesDir, file), "utf8");
      const { data } = matter(full);
      return { id, ...data };
    })
    .sort((a,b) => (a.date < b.date ? 1 : -1));
}

export async function getStoryData(id) {
  const fullPath = path.join(storiesDir, `${id}.md`);
  const file    = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const processed = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);
  return { id, contentHtml: processed.toString(), ...data };
}
