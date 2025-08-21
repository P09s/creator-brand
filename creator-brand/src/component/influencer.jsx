import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import SignInModal from '../auth/SignInModal';

const perks = [
  "Get discovered by top brands",
  "Earn through authentic partnerships",
  "Manage campaigns in one dashboard",
  "Track engagement & growth",
  "Build your creator portfolio"
];

export default function Influencer() {
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Manage body overflow when modal is open
  useEffect(() => {
    document.body.style.overflow = showSignInModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSignInModal]);

  return (
    <div className="bg-black text-white min-h-screen pt-32 px-6 md:px-20">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold font-satoshi leading-tight">
            Grow Your Influence. Get Paid to Collaborate.
          </h1>
          <p className="text-gray-400 text-lg font-satoshi">
            Connect with trusted brands and monetize your reach. LinkFluence helps you focus on what you love—creating.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setShowSignInModal(true)}
                className="bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Join as Influencer
              </button>
              <button
                onClick={() => navigate('/organization')}
                className="border border-gray-800 bg-gray-950 text-white py-3 px-6 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-colors"
              >
                I'm a Brand
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Image or Illustration */}
        <div className="flex-1">
          <img
            src="src/assets/img/influencer_dash.png"
            alt="Influencer Profile"
            className="rounded-xl shadow-2xl border border-gray-800"
          />
        </div>
      </section>

      {/* Perks Section */}
      <section className="mt-28 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold font-satoshi mb-8">
          Why Creators Love LinkFluence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left px-4 md:px-0">
          {perks.map((perk, i) => (
            <div key={i} className="flex items-start gap-4 bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <Sparkles className="text-yellow-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300 font-satoshi">{perk}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-28 bg-gray-950 border border-gray-800 rounded-2xl p-10 max-w-6xl mx-auto text-center shadow-xl hover:border-gray-700 transition-colors">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 font-satoshi">
          Ready to Get Sponsored?
        </h3>
        <p className="text-gray-400 mb-6 font-satoshi">
          Sign up and create your influencer profile in minutes.
        </p>
        <button
          onClick={() => setShowSignInModal(true)}
          className="bg-white text-black font-semibold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Become an Influencer
        </button>
      </section>

      {/* SignInModal */}
      <AnimatePresence>
        {showSignInModal && (
          <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}