// Types
// External
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
// Internal
import { getLessons } from "@/lib/actions";

export default async function Home() {
  const cookieStore = await cookies();
  const difficulty = cookieStore.get("difficulty")?.value;
  const lessons = await getLessons(difficulty);

  lessons.sort((a, b) => {
    return a.lessonNumber - b.lessonNumber;
  });
  return (
    <main className="grid grid-cols-3 gap-4 w-5/6 m-auto pt-10">
      {lessons.map((it, index) => {
        return (
          <Link key={it.id} href={`lesson/${it.id}`} draggable={false}>
            <Card className="flex relative group items-center justify-between text-opacity-80 hover:text-opacity-100 hover:bg-blue-50 hover:shadow-md hover:-translate-y-1">
              <Badge
                className={`-top-2 -right-1 absolute text-sm ${
                  it.difficulty === "easy" ? "bg-blue-400" : it.difficulty === "normal" ? "bg-yellow-400" : "bg-red-300"
                }`}
              >
                {it.difficulty}
              </Badge>
              <CardHeader className="w-full">
                <CardTitle>{it.title}</CardTitle>
                <span className="text-sm">Lesson {index + 1}</span>
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
