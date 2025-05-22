"use client"
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSessionStore } from '@/app/zustand/atoms/zustand';

export default function YourExistingPage() {
  const router = useRouter();
  const { session } = useSessionStore();
  
  const navigateToMyGroups = () => {
    if (session?.user?.id) {
      router.push('/user/groups');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">

        <Link 
          href="/group/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Group
        </Link>
        
        {/* New My Groups button */}
        <button 
          onClick={navigateToMyGroups}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          My Groups
        </button>
      </div>
      
      {/* Rest of your existing page content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Your existing content */}
      </div>
    </div>
  );
}