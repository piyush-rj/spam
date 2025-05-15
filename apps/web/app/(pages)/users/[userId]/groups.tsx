import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
}

interface GroupUser {
  id: number;
  user_id: number;
  group_id: string;
  user: {
    id: number;
    name: string | null;
    image: string | null;
  };
}

interface ChatGroup {
  id: string;
  user_id: number;
  title: string;
  passcode: string;
  createdAt: string;
  image: string | null;
  user: User;
  GroupUsers: GroupUser[];
}

export default function UserGroups() {
  const router = useRouter();
  const { userId } = router.query;
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserGroups();
    }
  }, [userId]);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/groups`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user groups');
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10">Loading groups...</div>;
  if (error) return <div className="text-red-500 p-5">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Groups</h1>
      
      {groups.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-4">You haven't joined any groups yet.</p>
          <Link href="/groups/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create a New Group
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gray-200 relative">
                {group.image ? (
                  <Image 
                    src={group.image} 
                    alt={group.title} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-300">
                    <span className="text-2xl font-bold text-gray-500">{group.title.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{group.title}</h2>
                <p className="text-sm text-gray-600 mb-3">
                  Created by: {group.user.name || group.user.email}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {group.GroupUsers.length} member{group.GroupUsers.length !== 1 ? 's' : ''}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex -space-x-2">
                    {group.GroupUsers.slice(0, 3).map((groupUser) => (
                      <div key={groupUser.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                        {groupUser.user.image ? (
                          <Image 
                            src={groupUser.user.image} 
                            alt={groupUser.user.name || 'User'} 
                            width={32} 
                            height={32} 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold">
                            {groupUser.user.name ? groupUser.user.name.substring(0, 1).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                    ))}
                    {group.GroupUsers.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">
                        +{group.GroupUsers.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <Link href={`/groups/${group.id}`} className="text-blue-500 hover:underline">
                    View Group
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}