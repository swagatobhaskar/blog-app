import BlogListComponent from "@/components/bloglist";

export default async function Home() {
  return (
    <main className="sm:w-full md:w-2/3 lg:w-1/3 mx-auto p-4">
      <BlogListComponent />
    </main>
  );
}
