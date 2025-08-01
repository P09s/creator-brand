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
    }, 3000);

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
    <div className="bg-black flex justify-center min-h-screen py-6 sm:py-10 md:py-16">
      <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-screen-xl px-4 sm:px-6 md:px-8 w-full">
        {/* Button */}
        <div className="relative glow-wrapper">
          <button className="relative z-10 text-black bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ">
            Search Collaborate Earn
          </button>
          <div className="absolute inset-0 rounded-2xl border-glow z-0" />
        </div>

        {/* Headings */}
        <span className="text-white font-bold font-satoshi text-3xl sm:text-4xl md:text-5xl leading-tight max-w-4xl w-full">
          Welcome to LinkFluence, the platform that connects brands with influencers for seamless collaborations.
        </span>
        <span className="text-gray-400 font-satoshi text-base sm:text-lg md:text-xl max-w-2xl">
          Discover, engage, and grow your brand with the power of influencer marketing.
        </span>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8">
          {/* Left Button - Secondary */}
          <button
            onClick={() => navigate('/explore')}
            className="bg-neutral-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base border border-neutral-700 transition-all duration-500 ease-out hover:bg-neutral-800 hover:border-neutral-600 hover:px-12 hover:shadow-2xl hover:shadow-white/20 relative z-10 w-full sm:w-auto"
          >
            Explore the Platform
          </button>

          {/* Right Button - Primary Focus */}
          <button
            onClick={() => navigate('/influencer')}
            className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-md transition-all duration-500 ease-out hover:px-12 hover:shadow-2xl hover:shadow-black/30 relative z-10 w-full sm:w-auto"
          >
            Become an Influencer
          </button>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-gray-400 font-satoshi text-sm sm:text-base">
            Already have an account?
          </span>
          <button
            className="text-white hover:underline ml-1 text-sm sm:text-base"
          >
            Login
          </button>
        </div>

        {/* Mac-style window with image slider */}
        <div className="w-full max-w-full sm:max-w-3xl md:max-w-4xl mt-10 sm:mt-16 md:mt-20">
          <div className="bg-neutral-800 rounded-xl overflow-hidden border border-white/20 shadow-lg">
            <div className="flex items-center px-4 py-2 bg-neutral-800 space-x-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
            </div>
            <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full flex-shrink-0 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Membership Plans Section */}
        <div className="max-w-full px-4 py-10 sm:py-12 md:py-16 w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 font-satoshi">Choose Your Plan</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 font-satoshi">Select the perfect plan for your influencer marketing journey</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch justify-center space-y-8 sm:space-y-0 sm:space-x-4 md:space-x-8 flex-wrap gap-y-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="w-full sm:w-80 relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-white text-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium font-satoshi">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`bg-neutral-900 rounded-2xl shadow-lg p-6 sm:p-8 h-full flex flex-col min-h-[500px] sm:min-h-[600px] ${
                  plan.popular ? 'border-2 border-white' : 'border border-gray-700'
                } transition-all duration-300 hover:shadow-xl hover:shadow-white/10`}>
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-satoshi">{plan.name}</h3>
                    <p className="text-gray-400 text-sm sm:text-base font-satoshi">{plan.description}</p>
                    <div className="flex items-baseline justify-center mt-2 sm:mt-4">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-satoshi">{plan.price}</span>
                      <span className="text-gray-400 ml-1 text-sm sm:text-base font-satoshi">/{plan.period}</span>
                    </div>
                  </div>
                  <div className="flex-1 mb-6 sm:mb-8">
                    <ul className="space-y-2 sm:space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-gray-300 text-sm sm:text-base font-satoshi">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base font-satoshi ${
                    plan.popular 
                      ? 'bg-white text-black hover:bg-gray-200 shadow-lg' 
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                  } transition-all duration-300 hover:scale-105`}>
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-gray-400 text-sm sm:text-base font-satoshi">
              All plans include a 30-day free trial. No credit card required.
            </p>
          </div>
        </div>

        {/* Tweet Section */}
        <div className="max-w-full px-4 pt-0 pb-10 sm:pb-16 w-full">
          <div className="flex flex-col md:flex-row items-stretch justify-center space-y-6 md:space-y-0 md:space-x-6 lg:space-x-8">
            {/* Tweet 1 */}
            <div className="flex-1 w-full max-w-full md:max-w-[420px] bg-neutral-900 rounded-2xl shadow-sm p-4 sm:p-5 border border-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <div className="flex items-start">
                <img
                  src="https://avatars.githubusercontent.com/u/000000?v=4"
                  alt="Parag Sharma"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover mr-3 sm:mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center flex-wrap space-x-1">
                    <span className="text-white font-semibold font-satoshi text-sm sm:text-base">Parag Sharma</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12a10 10 0 11-20 0 10 10 0 0120 0zm-5.53-2.53a.75.75 0 00-1.06 0l-4.22 4.22-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.75-4.75a.75.75 0 000-1.06z" />
                    </svg>
                    <span className="text-neutral-500 font-satoshi text-xs sm:text-sm">@parag_bored</span>
                  </div>
                  <p className="text-white mt-1 sm:mt-2 font-satoshi text-start text-sm sm:text-base">
                    We got nothing to do! <br />
                    Just staring at the screen, hoping a bug fixes itself.
                  </p>
                </div>
              </div>
            </div>

            {/* Tweet 2 */}
            <div className="flex-1 w-full max-w-full md:max-w-[420px] bg-neutral-900 rounded-2xl shadow-sm p-4 sm:p-5 border border-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <div className="flex items-start">
                <img
                  src="https://avatars.githubusercontent.com/u/000000?v=4"
                  alt="Paramveer Singh"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover mr-3 sm:mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center flex-wrap space-x-1">
                    <span className="text-white font-semibold font-satoshi text-sm sm:text-base">Paramveer Singh</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12a10 10 0 11-20 0 10 10 0 0120 0zm-5.53-2.53a.75.75 0 00-1.06 0l-4.22 4.22-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.75-4.75a.75.75 0 000-1.06z" />
                    </svg>
                    <span className="text-neutral-500 font-satoshi text-xs sm:text-sm">@param_bored</span>
                  </div>
                  <p className="text-white mt-1 sm:mt-2 font-satoshi text-start text-sm sm:text-base">
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