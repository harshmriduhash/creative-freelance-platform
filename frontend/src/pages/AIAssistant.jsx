import { useState } from "react";
import { toast } from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { aiAPI } from "../utils/api";

function AIAssistant() {
  const [activeTab, setActiveTab] = useState("ideas");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [ideasForm, setIdeasForm] = useState({
    topic: "",
    category: "design",
    count: 3,
  });
  const [contentForm, setContentForm] = useState({
    type: "tagline",
    prompt: "",
    context: "",
  });

  const generateIdeas = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await aiAPI.generateGigIdeas(ideasForm);
      setResult(response.data.ideas);
      toast.success("Ideas generated!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await aiAPI.generateContent(contentForm);
      setResult(response.data.content);
      toast.success("Content generated!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-3xl font-bold">AI Assistant</h1>
        </div>
        <p>
          Use AI to generate ideas, content, and proposals for your projects
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "ideas"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("ideas")}
            >
              Generate Ideas
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "content"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("content")}
            >
              Generate Content
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "ideas" && (
            <form onSubmit={generateIdeas} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., logo design for tech startups"
                  value={ideasForm.topic}
                  onChange={(e) =>
                    setIdeasForm({ ...ideasForm, topic: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={ideasForm.category}
                  onChange={(e) =>
                    setIdeasForm({ ...ideasForm, category: e.target.value })
                  }
                >
                  <option value="design">Design</option>
                  <option value="writing">Writing</option>
                  <option value="music">Music</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Ideas"}
              </button>
            </form>
          )}

          {activeTab === "content" && (
            <form onSubmit={generateContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Type
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={contentForm.type}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, type: e.target.value })
                  }
                >
                  <option value="tagline">Tagline</option>
                  <option value="description">Description</option>
                  <option value="brainstorm">Brainstorm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prompt</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="What do you want to create?"
                  value={contentForm.prompt}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, prompt: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Content"}
              </button>
            </form>
          )}

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Result:</h3>
              <div className="whitespace-pre-wrap">{result}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
