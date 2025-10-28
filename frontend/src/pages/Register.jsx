import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "freelancer",
    profile: {
      firstName: "",
      lastName: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.profile.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, firstName: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.profile.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, lastName: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">I want to:</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="freelancer">Work as a Freelancer</option>
              <option value="client">Hire Freelancers</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
