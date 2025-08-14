export default function Settings() {
  return (
    <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
      <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-1">Username</label>
          <input 
            type="text" 
            className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
          <input 
            type="email" 
            className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}