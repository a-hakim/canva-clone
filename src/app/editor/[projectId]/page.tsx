"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader, TriangleAlert } from "lucide-react";

import { Editor } from "@/features/editor/components/editor";
import { Button } from "@/components/ui/button";

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const EditorProjectIdPage = ({
  params,
}: EditorProjectIdPageProps) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const project = projects.find((p: any) => p.id === params.projectId);
      
      if (!project) {
        setError(true);
      } else {
        setProject(project);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.projectId]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col gap-y-5 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Failed to fetch project
        </p>
        <Button asChild variant="secondary">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return <Editor initialData={project} />;
};

export default EditorProjectIdPage;