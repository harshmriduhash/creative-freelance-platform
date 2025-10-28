import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { gigsAPI } from "../utils/api";

function CreateGig() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "design",
    budget: { type: "fixed", min: "", max: "", currency: "USD" },
    duration: "1-2-weeks",
    skills: "",
    status: "open",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };
      const response = await gigsAPI.create(data);
      toast.success("Gig created successfully!");
      navigate(`/gigs/${response.data.gig._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create gig");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Post a New Gig</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              required
              maxLength={100}
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              required
              rows={6}
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="music">Music</option>
              <option value="video">Video</option>
              <option value="photography">Photography</option>
              <option value="marketing">Marketing</option>
              <option value="development">Development</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Min Budget ($)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.budget.min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: { ...formData.budget, min: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Budget ($)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.budget.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: { ...formData.budget, max: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            >
              <option value="less-than-week">Less than a week</option>
              <option value="1-2-weeks">1-2 weeks</option>
              <option value="2-4-weeks">2-4 weeks</option>
              <option value="1-3-months">1-3 months</option>
              <option value="3-6-months">3-6 months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., Photoshop, Illustrator, UI Design"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            Post Gig
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGig;
