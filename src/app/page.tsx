"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClick = () => {
    setLoading(true);
    const id = uuidv4();
    
    // Save empty project to localStorage
    const project = {
      id,
      name: "Untitled project",
      json: "",
      width: 900,
      height: 1200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));

    router.push(`/editor/${id}`);
  };

  return (
    <div className="bg-muted h-full">
      <div className="h-full flex-1 overflow-auto p-8">
        <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
          <div className="text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]">
            <div className="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex">
              <div className="rounded-full size-20 flex items-center justify-center bg-white">
                <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-xl md:text-3xl font-semibold">
                Visualize your ideas with The Canvas
              </h1>
              <p className="text-xs md:text-sm mb-2">
                Turn inspiration into design in no time. Simply upload an image and let AI do the rest.
              </p>
              <Button
                disabled={loading}
                onClick={onClick}
                variant="secondary"
                className="w-[160px]"
              >
                Start creating
                {loading ? (
                  <Loader2 className="size-4 ml-2 animate-spin" />
                ) : (
                  <ArrowRight className="size-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}