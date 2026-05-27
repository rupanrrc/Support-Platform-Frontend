import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppRoutes } from "@/routes/AppRoutes";
import { ToastContainer } from "@/components/organisms/ToastContainer";
import { ThemeProvider } from "@/components/organisms/ThemeProvider";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
