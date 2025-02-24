
import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CourseManagement from "@/pages/CourseManagement";
import NotFound from "@/pages/NotFound";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Index />} />
      <Route path="/courses/new" element={<CourseManagement />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
