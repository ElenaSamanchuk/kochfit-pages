import type { ProseDoc } from "@/content/tilda-dynamic";
import { blog1Lesson } from "./1";
import { blog2Lesson } from "./2";
import { blog3Lesson } from "./3";
import { blog5Lesson } from "./5";
import { blog7Lesson } from "./7";
import { blog8Lesson } from "./8";
import { blog10Lesson } from "./10";

/** Уроки блога, перенесённые с live kochfit.ru/blog/N */
export const blogLessons: Record<string, ProseDoc> = {
  "1": blog1Lesson,
  "2": blog2Lesson,
  "3": blog3Lesson,
  "5": blog5Lesson,
  "7": blog7Lesson,
  "8": blog8Lesson,
  "10": blog10Lesson,
};

export function getBlogLesson(id: string): ProseDoc | null {
  return blogLessons[id] ?? null;
}

export function getBlogLessonIds(): string[] {
  return Object.keys(blogLessons);
}
