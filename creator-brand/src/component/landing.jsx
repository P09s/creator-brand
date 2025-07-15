function Landing() {
  return (
    <div className="bg-black flex justify-center mt-30">
      <div className="flex flex-col items-center text-center space-y-4 max-w-screen-xl px-4 w-full">
        <div className="relative glow-wrapper">
          <button className="relative z-10 text-black bg-white px-4 py-2 rounded-2xl font-semibold">
            Search Collaborate Earn
          </button>
          <div className="absolute inset-0 rounded-2xl border-glow z-0" />
        </div>
        <span className="text-white font-bold font-satoshi text-5xl leading-tight max-w-5xl w-full">
          Welcome to LinkFluence, the platform that connects brands with influencers for seamless collaborations.
        </span>
        <span className="text-gray-400 font-satoshi text-lg">
          Discover, engage, and grow your brand with the power of influencer marketing.
        </span>
      </div>
    </div>
  );
}

export default Landing;
