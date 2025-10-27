import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Where Creativity Meets AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The freelance marketplace that supercharges your creative work with AI assistance.
          Connect with clients, collaborate in real-time, and deliver amazing results.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700"
          >
            Get Started Free
          </Link>
          <Link
            to="/gigs"
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50"
          >
            Browse Gigs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI-Powered Creation</h3>
          <p className="text-gray-600">
            Generate ideas, proposals, and content with cutting-edge AI assistance
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Real-Time Collaboration</h3>
          <p className="text-gray-600">
            Chat, share files, and work together seamlessly with clients
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
          <p className="text-gray-600">
            Escrow protection and automated payments via Stripe
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-8">Join Our Growing Community</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-primary-100">Active Freelancers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5K+</div>
            <div className="text-primary-100">Projects Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">$2M+</div>
            <div className="text-primary-100">Earnings Paid Out</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Freelance Journey?</h2>
        <p className="text-gray-600 mb-8">Join thousands of creatives already using CreativeHub</p>
        <Link
          to="/register"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 inline-block"
        >
          Start For Free
        </Link>
      </section>
    </div>
  );
}

export default Home;
