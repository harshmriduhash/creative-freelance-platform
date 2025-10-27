import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { gigsAPI } from '../utils/api';

function GigList() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchGigs();
  }, [filters]);

  const fetchGigs = async () => {
    try {
      const response = await gigsAPI.getAll(filters);
      setGigs(response.data.gigs);
    } catch (error) {
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['design', 'writing', 'music', 'video', 'photography', 'marketing', 'development'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Browse Gigs</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md flex gap-4">
        <input
          type="text"
          placeholder="Search gigs..."
          className="flex-1 px-4 py-2 border rounded-lg"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Gigs List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : gigs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gigs/${gig._id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-sm text-primary-600 font-medium mb-2">{gig.category}</div>
              <h3 className="text-xl font-bold mb-2">{gig.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{gig.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-green-600">
                  ${gig.budget?.min} - ${gig.budget?.max}
                </div>
                <div className="text-sm text-gray-500">{gig.bids?.length || 0} bids</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">No gigs found</div>
      )}
    </div>
  );
}

export default GigList;
