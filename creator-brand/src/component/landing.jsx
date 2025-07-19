import { useState, useEffect } from "react";
import { Check } from 'lucide-react';

const images = [
  "src/assets/img/image.png",
  "src/assets/img/image.png",
];

function Landing() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "₹49",
      period: "month",
      description: "Perfect for individuals getting started",
      features: [
        "5 Projects",
        "10GB Storage",
        "Email Support",
        "Basic Templates",
        "Mobile App Access"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "₹99",
      period: "month",
      description: "Ideal for growing businesses",
      features: [
        "50 Projects",
        "100GB Storage",
        "Priority Support",
        "Premium Templates",
        "Advanced Analytics",
        "Team Collaboration",
        "Custom Branding"
      ],
      buttonText: "Choose Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹199",
      period: "month",
      description: "For large organizations",
      features: [
        "Unlimited Projects",
        "1TB Storage",
        "24/7 Phone Support",
        "Custom Templates",
        "Advanced Security",
        "API Access",
        "Dedicated Manager",
        "Custom Integrations"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className=" bg-black flex justify-center mt-20">
      <div className="flex flex-col items-center text-center space-y-4 max-w-screen-xl px-4 w-full">
        {/* Button */}
        <div className="relative glow-wrapper">
          <button className="relative z-10 text-black bg-white px-4 py-2 rounded-2xl font-semibold">
            Search Collaborate Earn
          </button>
          <div className="absolute inset-0 rounded-2xl border-glow z-0" />
        </div>

        {/* Headings */}
        <span className="text-white font-bold font-satoshi text-5xl leading-tight max-w-5xl w-full">
          Welcome to LinkFluence, the platform that connects brands with influencers for seamless collaborations.
        </span>
        <span className="text-gray-400 font-satoshi text-lg">
          Discover, engage, and grow your brand with the power of influencer marketing.
        </span>

        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-8 group relative">
          {/* Left Button - Secondary */}
          <button
            onClick={() => navigate('/explore')}
            className="bg-neutral-900 text-white px-6 py-3 rounded-full font-semibold border border-neutral-700 transition-all duration-500 ease-out hover:bg-neutral-800 hover:border-neutral-600
                     hover:scale-110 hover:px-12 hover:shadow-2xl hover:shadow-white/20
                     relative z-10"
          >
            Explore the Platform
          </button>

          {/* Right Button - Primary Focus */}
          <button
            onClick={() => navigate('/influencer')}
            className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-500 ease-out
                     hover:scale-110 hover:px-12 hover:shadow-2xl hover:shadow-black/30
                     relative z-10"
          >
            Become an Influencer
          </button>
        </div>

        {/* Mac-style window with image slider */}
        <div className="w-full max-w-4xl mt-20">
          <div className="bg-neutral-800 rounded-xl overflow-hidden border border-white/20 shadow-lg">
            {/* Top bar like macOS */}
            <div className="flex items-center px-4 py-2 bg- space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            {/* Sliding images */}
            <div className="relative w-full h-auto overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full flex-shrink-0 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Membership Plans Section */}
<div className="max-w-7xl mx-auto px-4 py-16 w-full">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-white mb-4 font-satoshi">Choose Your Plan</h2>
    <p className="text-lg text-gray-400 font-satoshi">Select the perfect plan for your influencer marketing journey</p>
  </div>
  
  <div className="flex items-stretch justify-center space-x-8 flex-wrap gap-y-8">
    {plans.map((plan) => (
      <div
        key={plan.name}
        className="w-80 relative"
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium font-satoshi">
              Most Popular
            </span>
          </div>
        )}

        <div className={`bg-neutral-900 rounded-2xl shadow-lg p-8 h-full flex flex-col min-h-[600px] ${
          plan.popular ? 'border-2 border-white' : 'border border-gray-700'
        }`}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2 font-satoshi">{plan.name}</h3>
            <p className="text-gray-400 mb-4 font-satoshi">{plan.description}</p>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-white font-satoshi">{plan.price}</span>
              <span className="text-gray-400 ml-1 font-satoshi">/{plan.period}</span>
            </div>
          </div>

          <div className="flex-1 mb-8">
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-gray-300 font-satoshi">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className={`w-full py-3 px-6 rounded-lg font-semibold font-satoshi ${
            plan.popular 
              ? 'bg-white text-black hover:bg-gray-200 shadow-lg' 
              : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
          }`}>
            {plan.buttonText}
          </button>
        </div>
      </div>
    ))}
  </div>

  <div className="text-center mt-12">
    <p className="text-gray-400 font-satoshi">
      All plans include a 30-day free trial. No credit card required.
    </p>
  </div>
</div>

        <div className="max-w-6xl mx-auto px-4 pt-0 pb-16 w-full">

  <div className="flex flex-col md:flex-row items-stretch justify-center space-y-8 md:space-y-0 md:space-x-8">

    {/* Tweet 1 */}
    <div className="flex-1 w-full md:w-[420px] bg-neutral-900 rounded-2xl shadow-sm p-5 border border-neutral-800">
      <div className="flex items-start">
        {/* Profile Image */}
        <img
          src="https://avatars.githubusercontent.com/u/000000?v=4"
          alt="Parag Sharma"
          className="w-11 h-11 rounded-full object-cover mr-4"
        />

        {/* Right Content */}
        <div className="flex-1">
          {/* Top row: name, checkmark, handle */}
          <div className="flex items-center flex-wrap space-x-1">
            <span className="text-white font-semibold font-satoshi">Parag Sharma</span>
            {/* White Circle Verified Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 11-20 0 10 10 0 0120 0zm-5.53-2.53a.75.75 0 00-1.06 0l-4.22 4.22-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.75-4.75a.75.75 0 000-1.06z" />
            </svg>
            <span className="text-neutral-500 font-satoshi">@parag_bored</span>
          </div>

          {/* Tweet Content */}
          <p className="text-white mt-2 font-satoshi text-start">
            We got nothing to do! <br />
            Just staring at the screen, hoping a bug fixes itself.
          </p>
        </div>
      </div>
    </div>

    {/* Tweet 2 */}
    <div className="flex-1 w-full md:w-[420px] bg-neutral-900 rounded-2xl shadow-sm p-5 border border-neutral-800">
      <div className="flex items-start">
        {/* Profile Image */}
        <img
          src="https://avatars.githubusercontent.com/u/000000?v=4"
          alt="Parag Sharma"
          className="w-11 h-11 rounded-full object-cover mr-4"
        />

        {/* Right Content */}
        <div className="flex-1">
          {/* Top row: name, checkmark, handle */}
          <div className="flex items-center flex-wrap space-x-1">
            <span className="text-white font-semibold font-satoshi">Paramveer Singh</span>
            {/* White Circle Verified Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 11-20 0 10 10 0 0120 0zm-5.53-2.53a.75.75 0 00-1.06 0l-4.22 4.22-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.75-4.75a.75.75 0 000-1.06z" />
            </svg>
            <span className="text-neutral-500 font-satoshi">@param_bored</span>
          </div>

          {/* Tweet Content */}
          <p className="text-white mt-2 font-satoshi text-start">
            I am unemployed and bored! <br />
            Thinking about building something cool but lacking the energy.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>

      </div>
    </div>
  );
}

export default Landing;