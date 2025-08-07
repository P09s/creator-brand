import { Filter, Menu, Search } from 'lucide-react'
import React from 'react'

function Dasheader() {
  return (
    <div className=' backdrop-blur-xl border-b border-slate-700/50 px-6 py-4'>
        <div className='flex items-center justify-between'>
            {/* Left section */}
            <div className='flex items-center space-x-4'>
                <button className='p-2 rounded-lg text-slate-300 hover:bg-neutral-900 transition-colors'>
                      <Menu className='w-5 h-5' />
                </button>
                <div className='hidden md:block'>
                    <h1 className='text-2xl font-satoshi text-white'>Dashboard</h1>
                    <p className='font-satoshi text-white'>Welcome back, Tillu Badmaash</p>
                </div>
            </div>
           {/* Search */}
           <div className='flex-1 max-w-md mx-8'>
                   <div className='relative'>
                    <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'/>
                    <input type="text" placeholder='Search Anything' className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' />
                    <button className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 hover:text-neutral-900'>
                    <Filter/>
                    </button>
                   </div>
           </div>
        </div>

    </div>
  )
}

export default Dasheader