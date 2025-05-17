"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { 
  AlertTriangle, 
  CopyIcon, 
  FileIcon, 
  Loader, 
  MoreHorizontal, 
  Search,
  Trash
} from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Banner } from "./banner";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this project.",
  );

  useEffect(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      setProjects(storedProjects);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onCopy = (id: string) => {
    const projectToCopy = projects.find(p => p.id === id);
    if (!projectToCopy) return;

    const newProject = {
      ...projectToCopy,
      id: crypto.randomUUID(),
      name: `Copy of ${projectToCopy.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;

    const updatedProjects = projects.filter(p => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Banner />
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="space-y-4">
        <Banner />
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No projects found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Banner />
      <ConfirmDialog />
      <h3 className="font-semibold text-lg">
        Recent projects
      </h3>
      <Table>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell
                onClick={() => router.push(`/editor/${project.id}`)}
                className="font-medium flex items-center gap-x-2 cursor-pointer"
              >
                <FileIcon className="size-6" />
                {project.name}
              </TableCell>
              <TableCell
                onClick={() => router.push(`/editor/${project.id}`)}
                className="hidden md:table-cell cursor-pointer"
              >
                {project.width} x {project.height} px
              </TableCell>
              <TableCell
                onClick={() => router.push(`/editor/${project.id}`)}
                className="hidden md:table-cell cursor-pointer"
              >
                {formatDistanceToNow(new Date(project.updatedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="flex items-center justify-end">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuItem
                      className="h-10 cursor-pointer"
                      onClick={() => onCopy(project.id)}
                    >
                      <CopyIcon className="size-4 mr-2" />
                      Make a copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10 cursor-pointer"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash className="size-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}