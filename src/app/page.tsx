// Types
// External
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { BookTemplate, ChevronRight } from "lucide-react";
import Link from "next/link";
// Internal
import { getLessons } from "@/lib/actions";
import BktButton from "@/components/BKT/BktButton";

export default async function Home() {
  const lessons = await getLessons();
  if (!lessons) notFound();

  return (
    <main className="grid grid-cols-3 gap-4 w-5/6 m-auto pt-10">
      <BktButton>Test Bkt</BktButton>
      {lessons.map((it) => {
        return (
          <Link key={it.id} href={`lesson/${it.id}`} draggable={false}>
            <Card className="flex group items-center justify-between text-opacity-80 hover:text-opacity-100 hover:bg-blue-50 hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{it.title}</CardTitle>
                <span className="text-sm">Lesson {it.lessonNumber}</span>
              </CardHeader>
              <div className="px-4">
                <ChevronRight className="group-hover:animate-bounceRight" />
              </div>
            </Card>
          </Link>
        );
      })}
    </main>
  );
}
