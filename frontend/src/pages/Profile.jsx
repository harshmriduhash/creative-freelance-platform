import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Star, MapPin, Briefcase, Edit, Mail } from "lucide-react";
import { usersAPI } from "../utils/api";
import useAuthStore from "../store/authStore";

function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile(id);
      setUser(response.data.user);
      setPortfolio(response.data.user.portfolio || []);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-12">User not found</div>;
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-primary-600">
                {user.profile?.avatar ? (
                  <img
                    src={user.profile.avatar}
                    alt={user.profile.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.profile?.firstName?.[0] || user.email[0].toUpperCase()
                )}
              </div>

              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.profile?.displayName ||
                    `${user.profile?.firstName} ${user.profile?.lastName}` ||
                    user.email}
                </h1>
                {user.profile?.title && (
                  <p className="text-lg text-gray-600">{user.profile.title}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  {user.profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {user.completedProjects || 0} projects completed
                  </div>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {user.rating?.average?.toFixed(1) || "0.0"}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
              <div className="flex gap-1 mt-1">
                {renderStars(user.rating?.average || 0)}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${user.totalEarnings?.toFixed(2) || "0.00"}
              </div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {user.completedProjects || 0}
              </div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {user.rating?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        {user.profile?.bio ? (
          <p className="text-gray-700 whitespace-pre-wrap">
            {user.profile.bio}
          </p>
        ) : (
          <p className="text-gray-500 italic">No bio provided yet.</p>
        )}
      </div>

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
        {portfolio.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {item.images && item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  {item.aiAssisted && (
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                      AI-Assisted
                    </span>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline text-sm mt-2 block"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No portfolio items yet.</p>
        )}
      </div>

      {/* Hourly Rate (if freelancer) */}
      {user.role === "freelancer" && user.hourlyRate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Hourly Rate</h2>
          <p className="text-3xl font-bold text-green-600">
            ${user.hourlyRate}/hr
          </p>
        </div>
      )}

      {/* Contact Button (if not own profile) */}
      {!isOwnProfile && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Contact {user.profile?.firstName || "User"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
