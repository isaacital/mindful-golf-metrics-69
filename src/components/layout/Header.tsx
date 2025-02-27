import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
export function Header() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  return <header className="border-b mb-6">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">GreenKeeper Match Tracker (beta)</h1>
          <Button variant="outline" size="sm" onClick={() => navigate("/courses/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>;
}