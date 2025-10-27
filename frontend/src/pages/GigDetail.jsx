import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { gigsAPI } from '../utils/api';
import useAuthStore from '../store/authStore';

function GigDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    deliveryTime: { value: '', unit: 'days' },
    proposal: ''
  });

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const response = await gigsAPI.getById(id);
      setGig(response.data.gig);
    } catch (error) {
      toast.error('Failed to load gig');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await gigsAPI.placeBid(id, bidData);
      toast.success('Bid placed successfully!');
      setShowBidForm(false);
      fetchGig();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place bid');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!gig) return <div className="text-center py-12">Gig not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-sm text-primary-600 font-medium mb-2">{gig.category}</div>
        <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap mb-6">{gig.description}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-600">Budget</div>
            <div className="text-2xl font-bold text-green-600">
              ${gig.budget?.min} - ${gig.budget?.max}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Duration</div>
            <div className="text-lg font-medium">{gig.duration}</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Required Skills</div>
          <div className="flex flex-wrap gap-2">
            {gig.skills?.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {user?.role === 'freelancer' && gig.status === 'open' && (
          <button
            onClick={() => setShowBidForm(!showBidForm)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Place a Bid
          </button>
        )}
      </div>

      {/* Bid Form */}
      {showBidForm && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Submit Your Proposal</h2>
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bid Amount ($)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={bidData.amount}
                onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Delivery Time</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  className="flex-1 px-4 py-2 border rounded-lg"
                  value={bidData.deliveryTime.value}
                  onChange={(e) => setBidData({
                    ...bidData,
                    deliveryTime: { ...bidData.deliveryTime, value: e.target.value }
                  })}
                />
                <select
                  className="px-4 py-2 border rounded-lg"
                  value={bidData.deliveryTime.unit}
                  onChange={(e) => setBidData({
                    ...bidData,
                    deliveryTime: { ...bidData.deliveryTime, unit: e.target.value }
                  })}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Proposal</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-2 border rounded-lg"
                value={bidData.proposal}
                onChange={(e) => setBidData({ ...bidData, proposal: e.target.value })}
                placeholder="Explain why you're the best fit for this project..."
              />
            </div>

            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Submit Bid
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default GigDetail;
