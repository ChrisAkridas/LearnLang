"use client";
import { ComponentProps } from "react";
import { Button } from "../ui/Button";
import { BKTRouteBody } from "@/types/types";

interface Props extends ComponentProps<typeof Button> {}
export default function BktButton(props: Props) {
  return (
    <Button
      onClick={async () => {
        const response2 = await fetch("/api/update_dataset", {
          method: "POST",
          body: JSON.stringify({
            data: [
              {
                user_id: 1,
                skill_name: "vocabulary",
                correct: 1,
                problem_id: "02ef263b-b093-4af2-ae2f-28e070b5ed32_mult",
                duration: 10.5,
                response_text: "Εγώ",
                resource: "I",
              },
            ],
            // filename: "chrisData.csv",
          } as BKTRouteBody),
        });
        const response = await fetch("/api/bkt", {
          method: "POST",
          body: JSON.stringify({
            // skills: ["vocabulary"],
            data: [
              {
                user_id: 1,
                skill_name: "vocabulary",
                correct: 1,
                problem_id: "02ef263b-b093-4af2-ae2f-28e070b5ed32_mult",
                duration: 10.5,
                response_text: "Εγώ",
                resource: "I",
              },
            ],
            filename: "chrisData.csv",
          } as BKTRouteBody),
        });
      }}
      {...props}
    />
  );
}
