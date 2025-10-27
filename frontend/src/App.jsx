import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GigList from "./pages/GigList";
import GigDetail from "./pages/GigDetail";
import CreateGig from "./pages/CreateGig";
import ProjectDetail from "./pages/ProjectDetail";
import Profile from "./pages/Profile";
import AIAssistant from "./pages/AIAssistant";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder"
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gigs" element={<GigList />} />
                <Route path="/gigs/:id" element={<GigDetail />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-gig"
                  element={
                    <ProtectedRoute>
                      <CreateGig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile/:id" element={<Profile />} />
                <Route
                  path="/ai-assistant"
                  element={
                    <ProtectedRoute>
                      <AIAssistant />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </Elements>
    </QueryClientProvider>
  );
}

export default App;
