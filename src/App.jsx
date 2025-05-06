import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/login"
              element={<div>Login Page (Coming Soon)</div>}
            />
            <Route
              path="/dashboard"
              element={<div>Dashboard Page (Coming Soon)</div>}
            />
          </Routes>
        </MainLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
