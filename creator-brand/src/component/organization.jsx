import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const features = [
  "Smart Influencer Discovery",
  "Campaign Management Dashboard",
  "Analytics & ROI Tracking",
  "Direct Messaging & Contracts",
  "Verified Influencer Profiles"
];

export default function OrganizationLanding() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen pt-32 px-6 md:px-20">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold font-satoshi leading-tight">
            Connect with the Right Influencers.
          </h1>
          <p className="text-gray-400 text-lg font-satoshi">
            Launch effective influencer campaigns with ease. Our AI-powered matching system helps your brand find creators that align with your goals.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition"
            >
              Start Collaborating
            </button>
            <button
              onClick={() => navigate('/influencer')}
              className="border border-gray-500 text-white py-3 px-6 rounded-xl hover:bg-white hover:text-black transition"
            >
              I’m an Influencer
            </button>
          </div>
        </div>

        {/* Right Side Image or Illustration */}
        <div className="flex-1">
          <img
            src="src/assets/img/org-dashboard-mock.png"
            alt="Organization Dashboard"
            className="rounded-xl shadow-2xl border border-white/10"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-28 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold font-satoshi mb-8">
          Why Brands Choose LinkFluence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left px-4 md:px-0">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-4">
              <CheckCircle className="text-green-500 mt-1" />
              <p className="text-gray-300 font-satoshi">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-28 bg-neutral-900 border border-neutral-800 rounded-2xl p-10 max-w-6xl mx-auto text-center shadow-xl">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 font-satoshi">
          Ready to Launch Your First Campaign?
        </h3>
        <p className="text-gray-400 mb-6 font-satoshi">
          Get started in minutes. No setup fees, no contracts.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-white text-black font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition"
        >
          Create Organization Account
        </button>
      </section>
    </div>
  );
}
