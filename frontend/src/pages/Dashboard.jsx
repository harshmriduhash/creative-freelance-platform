import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { gigsAPI, projectsAPI } from '../utils/api';

function Dashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, gigsRes] = await Promise.all([
        projectsAPI.getAll(),
        gigsAPI.getAll({ client: user?.id })
      ]);

      setProjects(projectsRes.data.projects || []);
      if (user?.role === 'client') {
        setMyGigs(gigsRes.data.gigs || []);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.profile?.firstName || user?.email}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'freelancer' ? 'Find your next project' : 'Manage your gigs and projects'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-primary-600">{projects.length}</div>
          <div className="text-gray-600">Active Projects</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-green-600">${user?.balance?.toFixed(2) || '0.00'}</div>
          <div className="text-gray-600">Available Balance</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-orange-600">{user?.completedProjects || 0}</div>
          <div className="text-gray-600">Completed Projects</div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Active Projects</h2>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="block p-4 border rounded-lg hover:border-primary-500 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <div className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Status:</span> {project.status}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Budget:</span> ${project.budget?.amount}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No active projects yet.</p>
        )}
      </div>

      {/* My Gigs (for clients) */}
      {user?.role === 'client' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Gigs</h2>
            <Link
              to="/create-gig"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Post New Gig
            </Link>
          </div>

          {myGigs.length > 0 ? (
            <div className="space-y-4">
              {myGigs.map((gig) => (
                <Link
                  key={gig._id}
                  to={`/gigs/${gig._id}`}
                  className="block p-4 border rounded-lg hover:border-primary-500 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg">{gig.title}</h3>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Status:</span> {gig.status}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Bids:</span> {gig.bids?.length || 0}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't posted any gigs yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
