// app/resume/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export default async function ResumePage() {
  // 1. Load the markdown file
  const filePath = path.join(process.cwd(), 'content', 'resume.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // 2. Parse the frontmatter and content
  const { content } = matter(fileContents);

  // 3. Convert markdown to HTML
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <main className="prose mx-auto p-4">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
