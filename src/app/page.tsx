import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import { fetchLessons } from "@/lib/actions";
import Link from "next/link";

export default async function Home() {
  const lessons = await fetchLessons();
  return (
    <main className="grid grid-cols-3 gap-4 w-5/6 m-auto pt-10">
      {lessons.map((it) => {
        return (
          <Link key={it.id} href={`lesson/${it.id}`} draggable={false}>
            <Card className="flex group items-center justify-between text-opacity-80 hover:text-opacity-100 hover:bg-slate-50 hover:shadow-md hover:-translate-y-1">
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
