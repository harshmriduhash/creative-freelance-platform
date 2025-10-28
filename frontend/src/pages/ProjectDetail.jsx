import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  MessageCircle,
  Upload,
  Download,
  Star,
} from "lucide-react";
import { projectsAPI } from "../utils/api";
import useAuthStore from "../store/authStore";

function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(id);
      setProject(response.data.project);
    } catch (error) {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProject = async () => {
    if (!window.confirm("Mark this project as complete?")) return;

    try {
      await projectsAPI.complete(id);
      toast.success("Project marked as complete!");
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to complete project");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.submitReview(id, reviewData);
      toast.success("Review submitted!");
      setShowReviewForm(false);
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit review");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  const isClient = user?.id === project.client?._id;
  const isFreelancer = user?.id === project.freelancer?._id;
  const canReview = project.status === "completed";
  const hasReviewed = isClient
    ? project.review?.clientReview
    : project.review?.freelancerReview;

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      disputed: "bg-yellow-100 text-yellow-800",
      "in-review": "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getMilestoneStatusColor = (status) => {
    const colors = {
      pending: "text-gray-500",
      "in-progress": "text-blue-500",
      submitted: "text-purple-500",
      approved: "text-green-500",
      rejected: "text-red-500",
    };
    return colors[status] || "text-gray-500";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-medium ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Client */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <div className="text-sm text-gray-600">Client</div>
              <Link
                to={`/profile/${project.client._id}`}
                className="font-medium text-primary-600 hover:underline"
              >
                {project.client.profile?.displayName || project.client.email}
              </Link>
            </div>
          </div>

          {/* Freelancer */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <div className="text-sm text-gray-600">Freelancer</div>
              <Link
                to={`/profile/${project.freelancer._id}`}
                className="font-medium text-primary-600 hover:underline"
              >
                {project.freelancer.profile?.displayName ||
                  project.freelancer.email}
              </Link>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <div className="text-sm text-gray-600">Budget</div>
              <div className="font-medium text-2xl text-green-600">
                ${project.budget?.amount}
              </div>
              <div className="text-xs text-gray-500">
                {project.budget?.type}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <div className="text-sm text-gray-600">Timeline</div>
              <div className="font-medium">
                {project.timeline?.estimatedHours
                  ? `${project.timeline.estimatedHours} hours estimated`
                  : "No timeline set"}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isClient && project.status === "active" && (
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleCompleteProject}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
            >
              Mark as Complete
            </button>
          </div>
        )}
      </div>

      {/* Milestones */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Milestones</h2>
          <div className="space-y-4">
            {project.milestones.map((milestone, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{milestone.title}</h3>
                  <span
                    className={`flex items-center gap-1 font-medium ${getMilestoneStatusColor(
                      milestone.status
                    )}`}
                  >
                    {milestone.status === "approved" && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {milestone.status === "in-progress" && (
                      <Clock className="w-4 h-4" />
                    )}
                    {milestone.status}
                  </span>
                </div>
                {milestone.description && (
                  <p className="text-gray-600 mb-3">{milestone.description}</p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">${milestone.amount}</span>
                    {milestone.dueDate && (
                      <span className="ml-4">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {milestone.deliverables &&
                    milestone.deliverables.length > 0 && (
                      <div className="text-primary-600">
                        {milestone.deliverables.length} file(s) attached
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Escrow Amount</div>
            <div className="text-2xl font-bold text-blue-600">
              ${project.payment?.escrowAmount?.toFixed(2) || "0.00"}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Paid Amount</div>
            <div className="text-2xl font-bold text-green-600">
              ${project.payment?.paidAmount?.toFixed(2) || "0.00"}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Freelancer Earnings</div>
            <div className="text-2xl font-bold text-purple-600">
              ${project.payment?.freelancerEarnings?.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {canReview && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          {/* Existing Reviews */}
          <div className="space-y-4 mb-6">
            {project.review?.clientReview && (
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium mb-1">Client Review</div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < project.review.clientReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {project.review.clientReview.rating}/5
                  </span>
                </div>
                <p className="text-gray-700">
                  {project.review.clientReview.comment}
                </p>
              </div>
            )}

            {project.review?.freelancerReview && (
              <div className="border-l-4 border-green-500 pl-4">
                <div className="font-medium mb-1">Freelancer Review</div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < project.review.freelancerReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {project.review.freelancerReview.rating}/5
                  </span>
                </div>
                <p className="text-gray-700">
                  {project.review.freelancerReview.comment}
                </p>
              </div>
            )}
          </div>

          {/* Submit Review */}
          {!hasReviewed && (
            <>
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  Leave a Review
                </button>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() =>
                            setReviewData({ ...reviewData, rating })
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= reviewData.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Comment
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg"
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}

      {/* Communication */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Messages
        </h2>
        <div className="border rounded-lg p-4 mb-4 min-h-[200px] bg-gray-50">
          <p className="text-gray-500 text-center py-8">
            Real-time chat will appear here. Coming soon!
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Send
          </button>
        </div>
      </div>

      {/* Files */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Shared Files</h2>
        {project.collaboration?.sharedFiles &&
        project.collaboration.sharedFiles.length > 0 ? (
          <div className="space-y-2">
            {project.collaboration.sharedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{file.filename}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button className="text-primary-600 hover:underline text-sm">
                  Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No files shared yet</p>
        )}

        <div className="mt-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
