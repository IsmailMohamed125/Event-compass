import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>Dashboard Page (Coming Soon)</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
