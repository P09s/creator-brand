import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Store,
  Clock3,
  BadgeDollarSign,
  Handshake,
  Settings,
  Users,
  Sun,
  Moon,
  Search,
  ClipboardList,
  UserPlus
} from 'lucide-react';

function Explore() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Handle scrolling to section when URL has a hash
  useEffect(() => {
    if (location.hash && location.pathname === '/explore') {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const promoCategories = [
    { label: 'Anime Merch', icon: 'https://img.icons8.com/color/96/000000/anime.png', description: 'Promote anime-themed merchandise and collectibles.' },
    { label: 'Beauty Products', icon: 'https://img.icons8.com/color/96/000000/lipstick.png', description: 'Share skincare or cosmetic product promotions.' },
    { label: 'New Music Releases', icon: 'https://img.icons8.com/color/96/000000/musical-notes.png', description: 'Support upcoming tracks or albums with engaging content.' },
    { label: 'Short Films & Edits', icon: 'https://img.icons8.com/color/96/000000/video-editing.png', description: 'Promote indie films, video edits, and trailers.' },
    { label: 'Gaming Channels', icon: 'https://img.icons8.com/color/96/000000/controller.png', description: 'Boost game-related streams, launches, or gear.' },
    { label: 'Motivational Content', icon: 'https://img.icons8.com/color/96/000000/inspiration.png', description: 'Promote coaches, reels, or community campaigns.' },
    { label: 'Fashion Brands', icon: 'https://img.icons8.com/color/96/000000/fashion.png', description: 'Style promotions, collabs, and lookbook drops.' },
    { label: 'Tech Unboxings', icon: 'https://img.icons8.com/color/96/000000/vr.png', description: 'Feature gadget launches or hardware reviews.' },
    { label: 'Food & Recipes', icon: 'https://img.icons8.com/color/96/000000/meal.png', description: 'Promote restaurants, food products or chef collabs.' },
    { label: 'Podcasts', icon: 'https://img.icons8.com/color/96/000000/podcast.png', description: 'Bring new episodes and series to light.' },
    { label: 'Shoutouts', icon: 'https://img.icons8.com/color/96/megaphone.png', description: 'Get featured via stories, reels, or tweets.' },
    { label: 'Giveaways', icon: 'https://img.icons8.com/color/96/gift.png', description: 'Collaborate on interactive contests & giveaways.' },
    { label: 'Fitness Influencers', icon: 'https://img.icons8.com/color/96/dumbbell.png', description: 'Promote workout plans or wellness gear.' },
    { label: 'Lifestyle Coaches', icon: 'https://img.icons8.com/color/96/meditation-guru.png', description: 'Push motivational content and 1:1 programs.' },
    { label: 'NFT Projects', icon: 'https://img.icons8.com/color/96/000000/nft.png', description: 'Promote collections or whitelist campaigns.' },
    { label: 'Startup Launches', icon: 'https://img.icons8.com/color/96/startup.png', description: 'Introduce new products or services innovatively.' }
  ];

  const promoPlatforms = [
    'Instagram', 'YouTube', 'TikTok', 'Twitter', 'Spotify', 'Pinterest', 'Snapchat', 'Twitch', 'LinkedIn', 'Facebook'
  ];

  const filteredCategories = promoCategories.filter(cat =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen transition-all duration-300 px-6 py-12`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <button onClick={toggleTheme} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isDarkMode 
              ? 'border border-gray-800 bg-gray-950 text-white hover:bg-gray-800' 
              : 'border border-gray-300 bg-white text-black hover:bg-gray-100'
          }`}>
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-satoshi mb-4 tracking-tight">
            Join the Future of Brand-Creator Collabs
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Discover top trends, explore creator niches, and connect with new brands through meaningful collaborations.
          </p>
        </div>

        {/* Onboarding Flow */}
        <div id="getting-started" className="mb-20 scroll-mt-[600px]">
          <h3 className="text-2xl font-bold mb-6 text-center">Getting Started</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[{
              icon: <UserPlus className="text-orange-400" />, title: 'Sign Up', text: 'Join as a creator or brand with just a few clicks.'
            }, {
              icon: <ClipboardList className="text-teal-400" />, title: 'Build Profile', text: 'Add your interests, goals, and preferred platforms.'
            }, {
              icon: <Handshake className="text-purple-400" />, title: 'Start Collaborating', text: 'Connect, communicate, and launch your first campaign.'
            }].map(({ icon, title, text }, i) => (
              <div key={i} className="bg-gray-950 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                <div className="w-6 h-6 mx-auto mb-3">{icon}</div>
                <h4 className="font-semibold text-lg mb-1 text-white">{title}</h4>
                <p className="text-sm text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-20 scroll-mt-[210px]">
          <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[{
              icon: <Store className="text-yellow-400" />, title: 'Discover by Interest', text: 'Filter creators or brands using keyword tags and niche categories.'
            }, {
              icon: <BadgeDollarSign className="text-green-400" />, title: 'Choose Payment Model', text: 'Select barter, fixed price, or auction-style promotion offers.'
            }, {
              icon: <Clock3 className="text-blue-400" />, title: 'Timeline Setup', text: 'Mention preferred launch dates, campaign length, and deadlines.'
            }, {
              icon: <Handshake className="text-purple-400" />, title: 'Finalize Scope', text: 'Clarify deliverables, post formats, and platforms in use.'
            }, {
              icon: <Settings className="text-pink-400" />, title: 'Track & Review', text: 'Check progress, request previews, and approve final drafts.'
            }, {
              icon: <Users className="text-cyan-400" />, title: 'Repeat & Grow', text: 'Establish long-term partnerships and grow mutual reach.'
            }].map(({ icon, title, text }, i) => (
              <div key={i} className="bg-gray-950 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                <div className="w-6 h-6 mx-auto mb-3">{icon}</div>
                <h4 className="font-semibold text-lg mb-1 text-white">{title}</h4>
                <p className="text-sm text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Categories */}
        <div id="what-can-be-promoted" className="mb-20 scroll-mt-[210px]">
          <h3 className="text-2xl font-bold mb-6 text-center">What Can Be Promoted?</h3>
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search promotions..."
                className="w-full bg-gray-950 text-white border border-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:border-gray-700 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 p-4">
                  <img src={cat.icon} alt={cat.label} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="text-md font-semibold text-white">{cat.label}</h4>
                    <p className="text-xs text-gray-400 leading-tight mt-1">{cat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Templates */}
        <div id="campaign-templates" className="mb-20 scroll-mt-[210px]">
          <h3 className="text-2xl font-bold mb-6 text-center">Campaign Templates</h3>
          <p className="text-center text-gray-400 mb-6">Use ready-made campaign blueprints and customize them to launch faster.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Fashion Drop Teaser", "Tech Giveaway", "Music Launch Hype", "Product Review Blitz", "Podcast Collab", "Reel Challenge"].map((name, idx) => (
              <div key={idx} className="bg-gray-950 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-all text-center">
                <h4 className="font-semibold text-lg mb-1 text-white">{name}</h4>
                <p className="text-sm text-gray-400">A quick-start template to duplicate and tweak as needed.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 border border-gray-800 rounded-2xl py-10 px-6 text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">More exciting features launching soon. Stay tuned.</h2>
          <p className="text-white/80 mb-4">We're building something exciting. Get ready for a new way to collaborate and create impact.</p>
        </div>

        <div className="mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Explore;