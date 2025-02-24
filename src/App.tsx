
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthGuard } from "@/components/layout/AuthGuard";
import Routes from "./Routes";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthGuard>
          <Routes />
          <Toaster position="top-right" />
        </AuthGuard>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
