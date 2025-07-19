// explore/index.jsx
import { NavLink, Outlet } from 'react-router-dom';

function Explore() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold font-satoshi mb-8">Explore</h1>

      <div className="flex gap-4 mb-6 border-b border-neutral-700 pb-2">
        <NavLink to="trending" className={({ isActive }) =>
          `px-4 py-2 rounded font-satoshi ${
            isActive ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:text-white'
          }`
        }>
          🔥 Trending
        </NavLink>
        <NavLink to="categories" className={({ isActive }) =>
          `px-4 py-2 rounded font-satoshi ${
            isActive ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:text-white'
          }`
        }>
          🗂️ Categories
        </NavLink>
        <NavLink to="top-influencers" className={({ isActive }) =>
          `px-4 py-2 rounded font-satoshi ${
            isActive ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:text-white'
          }`
        }>
          🌟 Top Influencers
        </NavLink>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Explore;
