
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  name: string;
  holes: Array<{ number: number; par: number; handicap: number }>;
  tees: Array<{ color: string; rating: number; slope: number }>;
}

interface CourseSelectorProps {
  courses: Course[];
  selectedCourse: Course;
  onCourseChange: (course: Course) => void;
}

export const CourseSelector = ({ selectedCourse, onCourseChange }: CourseSelectorProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, name');
        
        if (coursesError) throw coursesError;

        // For each course, fetch its holes and tees
        const fullCourses = await Promise.all(coursesData.map(async (course) => {
          const [holesResult, teesResult] = await Promise.all([
            supabase
              .from('course_holes')
              .select('number, par, handicap')
              .eq('course_id', course.id)
              .order('number'),
            supabase
              .from('course_tees')
              .select('color, rating, slope')
              .eq('course_id', course.id)
          ]);

          if (holesResult.error) throw holesResult.error;
          if (teesResult.error) throw teesResult.error;

          return {
            ...course,
            holes: holesResult.data,
            tees: teesResult.data
          };
        }));

        setCourses(fullCourses);
        
        // If there are courses and no course is selected yet, select the first one
        if (fullCourses.length > 0 && !selectedCourse) {
          onCourseChange(fullCourses[0]);
        }
      } catch (error: any) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading || courses.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{loading ? "Loading Courses..." : "No Courses Available"}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Select Course</CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedCourse?.id} 
          onValueChange={(value) => {
            const course = courses.find(c => c.id === value);
            if (course) onCourseChange(course);
          }}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
