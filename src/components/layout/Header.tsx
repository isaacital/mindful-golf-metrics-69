
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b mb-6">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Golf Score Tracker</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
