"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, BookOpen } from "lucide-react";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";

interface Course {
  title: string;
  platform: string;
  url: string;
  level: string;
  duration: string;
  isFree: boolean;
  enrolled: boolean;
  completed: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [level, setLevel] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const loadCourses = useCallback(() => {
    const params = new URLSearchParams();
    if (level) params.set("level", level);
    if (freeOnly) params.set("free", "true");
    fetch(`/api/courses?${params}`).then((r) => r.json()).then(setCourses);
  }, [freeOnly, level]);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  async function enroll(course: Course) {
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    loadCourses();
  }

  return (
    <div>
      <DashboardHeader
        title="Course Recommendations"
        description="Curated courses from top platforms for your career path"
      />

      <div className="flex gap-4 mb-6">
        <Select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </Select>
        <Button
          variant={freeOnly ? "primary" : "secondary"}
          onClick={() => setFreeOnly(!freeOnly)}
        >
          {freeOnly ? "Free Only ✓" : "All Courses"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course.title} className="flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <Badge>{course.platform}</Badge>
              </div>
              <Badge variant={course.isFree ? "success" : "default"}>
                {course.isFree ? "Free" : "Paid"}
              </Badge>
            </div>
            <CardTitle className="text-base mb-2">{course.title}</CardTitle>
            <div className="flex gap-2 mb-4">
              <Badge variant="proficiency" proficiency={course.level}>{course.level}</Badge>
              <span className="text-xs text-slate-500">{course.duration}</span>
            </div>
            <div className="mt-auto flex gap-2">
              <a href={course.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="secondary" className="w-full" size="sm">
                  <ExternalLink size={14} /> View Course
                </Button>
              </a>
              {!course.enrolled && (
                <Button size="sm" onClick={() => enroll(course)}>Enroll</Button>
              )}
              {course.enrolled && !course.completed && (
                <Badge variant="success">Enrolled</Badge>
              )}
              {course.completed && (
                <Badge variant="success">Completed ✓</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
