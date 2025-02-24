
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";

interface TeeInput {
  color: string;
  rating: number;
  slope: number;
}

interface HoleInput {
  number: number;
  par: number;
  handicap: number;
}

export default function CourseManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [holes, setHoles] = useState<HoleInput[]>(
    Array.from({ length: 18 }, (_, i) => ({
      number: i + 1,
      par: 4,
      handicap: i + 1,
    }))
  );
  const [tees, setTees] = useState<TeeInput[]>([
    { color: "", rating: 72.0, slope: 113 }
  ]);

  const handleAddTee = () => {
    setTees([...tees, { color: "", rating: 72.0, slope: 113 }]);
  };

  const handleTeeChange = (index: number, field: keyof TeeInput, value: string | number) => {
    const newTees = [...tees];
    newTees[index] = { ...newTees[index], [field]: value };
    setTees(newTees);
  };

  const handleHoleChange = (index: number, field: keyof HoleInput, value: number) => {
    const newHoles = [...holes];
    newHoles[index] = { ...newHoles[index], [field]: value };
    setHoles(newHoles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      // Insert course with created_by field
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([{ 
          name: courseName,
          created_by: user.id
        }])
        .select()
        .single();

      if (courseError) throw courseError;

      // Insert holes
      const { error: holesError } = await supabase
        .from('course_holes')
        .insert(
          holes.map(hole => ({
            course_id: courseData.id,
            ...hole
          }))
        );

      if (holesError) throw holesError;

      // Insert tees
      const { error: teesError } = await supabase
        .from('course_tees')
        .insert(
          tees.map(tee => ({
            course_id: courseData.id,
            ...tee
          }))
        );

      if (teesError) throw teesError;

      toast({
        title: "Success!",
        description: "Course created successfully.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tees</h3>
                {tees.map((tee, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Color</Label>
                      <Input
                        placeholder="Color"
                        value={tee.color}
                        onChange={(e) => handleTeeChange(index, "color", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Rating"
                        value={tee.rating}
                        onChange={(e) => handleTeeChange(index, "rating", parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label>Slope</Label>
                      <Input
                        type="number"
                        placeholder="Slope"
                        value={tee.slope}
                        onChange={(e) => handleTeeChange(index, "slope", parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddTee}>
                  Add Tee
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Holes</h3>
                <div className="space-y-3">
                  {holes.map((hole, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded-lg">
                      <h4 className="font-medium">Hole {hole.number}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`hole-${index}-par`}>Par</Label>
                          <Input
                            id={`hole-${index}-par`}
                            type="number"
                            value={hole.par}
                            onChange={(e) => handleHoleChange(index, "par", parseInt(e.target.value))}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`hole-${index}-handicap`}>Hole HCP</Label>
                          <Input
                            id={`hole-${index}-handicap`}
                            type="number"
                            value={hole.handicap}
                            onChange={(e) => handleHoleChange(index, "handicap", parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Course..." : "Create Course"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
