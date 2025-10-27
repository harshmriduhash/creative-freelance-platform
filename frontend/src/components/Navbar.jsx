import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../store/authStore";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CreativeHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/gigs" className="text-gray-700 hover:text-primary-600">
              Browse Gigs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/ai-assistant"
                  className="text-gray-700 hover:text-primary-600"
                >
                  AI Assistant
                </Link>
                {user?.role === "client" && (
                  <Link
                    to="/create-gig"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Post a Gig
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/gigs"
              className="block text-gray-700 hover:text-primary-600"
            >
              Browse Gigs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/ai-assistant"
                  className="block text-gray-700 hover:text-primary-600"
                >
                  AI Assistant
                </Link>
                {user?.role === "client" && (
                  <Link
                    to="/create-gig"
                    className="block text-gray-700 hover:text-primary-600"
                  >
                    Post a Gig
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
