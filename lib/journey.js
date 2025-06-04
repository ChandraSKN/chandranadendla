// lib/journey.js
import fs   from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html   from "remark-html";
import remarkGfm from "remark-gfm";

const journeyDirectory = path.join(process.cwd(), "journey-posts");
export function getJourneyIndex() {
  const files = fs.readdirSync(journeyDirectory);
  const all = files.map(fileName => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(journeyDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return { id, ...data };
  });
  return all.sort((a,b) => (a.date < b.date ? 1 : -1));
}

export async function getJourneyData(id) {
  const fullPath = path.join(journeyDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processed = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);
  return { id, contentHtml: processed.toString(), ...data };
}
