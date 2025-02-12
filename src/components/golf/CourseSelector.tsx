
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: number;
  name: string;
  holes: Array<{ number: number; par: number; handicap: number }>;
  tees: Array<{ color: string; rating: number; slope: number }>;
}

interface CourseSelectorProps {
  courses: Course[];
  selectedCourse: Course;
  onCourseChange: (course: Course) => void;
}

export const CourseSelector = ({ courses, selectedCourse, onCourseChange }: CourseSelectorProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Select Course</CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          defaultValue={selectedCourse.id.toString()} 
          onValueChange={(value) => 
            onCourseChange(courses.find(course => course.id.toString() === value)!)
          }
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
