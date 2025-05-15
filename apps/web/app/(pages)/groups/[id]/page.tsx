"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/app/zustand/atoms/zustand';

interface GroupUser {
  id: number;
  group_id: string;
  user_id: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
}

interface ChatGroup {
  id: string;
  user_id: number;
  title: string;
  passcode: string;
  createdAt: string;
  image: string | null;
  user?: User;
  GroupUsers?: GroupUser[];
}

interface UserGroupsPageProps {
  userId: string;
}

const UserGroupsPage: React.FC<UserGroupsPageProps> = ({ userId }) => {
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSessionStore();
  const router = useRouter();
  const token = session.user.token;

  const [editPanelGroupId, setEditPanelGroupId] = useState<string | null>(null);
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ChatGroup[]>(
          `http://localhost:8080/api/my-groups/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroups(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load your groups. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, [userId]);

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(groups.filter((group) => group.id !== groupId));
      setConfirmDeleteGroupId(null);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 px-[80px]">
      {groups.length === 0 ? (
        <div className="text-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">You haven't created any groups yet.</p>
          <button
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => router.push('/create-group')}
          >
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {groups.map((group) => (
            <div
              key={group.id}
              className="relative rounded-lg overflow-hidden shadow-sm shadow-[#383838] hover:shadow-lg hover:shadow-[#2e2e2e] transition-shadow"
              onClick={() => handleGroupClick(group.id)}
            >
              <div className="p-4 bg-[#000000]">
                <div className="flex justify-between p-1">
                  <div>
                    <h2 className="font-semibold text-lg truncate">{group.title}</h2>
                    <span className="text-[#e4e4e4] text-md">{group.passcode}</span>
                    <p className="text-[#b3b3b3] text-[14px]">
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="h-[50px] w-[50px] rounded-full bg-[#1d1d1d] flex items-center justify-center">
                      {group.image ? (
                        <img
                          src={group.image}
                          alt={group.title}
                          className="w-full object-cover"
                        />
                      ) : (
                        <div className="text-xl text-gray-400">0</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-green-800 px-2 py-1 rounded">
                    {group.GroupUsers?.length || 0} members
                  </span>

                  <div>
                    <button
                      className="text-xs px-3 py-1 bg-red-800 mr-2 text-white rounded hover:bg-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPanelGroupId(editPanelGroupId === group.id ? null : group.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupClick(group.id);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Edit Panel */}
                {editPanelGroupId === group.id && (
                  <div
                    className="absolute right-4 top-6 bg-[#1f1f1f] p-1.5 rounded shadow-md z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="block px-3 py-1.5 rounded-md text-sm text-white hover:text-[#d1d1d1] mb-2"
                      onClick={() => {
                        router.push(`/edit-group/${group.id}`);
                        setEditPanelGroupId(null);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="block px-3.5 pb-1 text-sm text-red-500 hover:text-red-600"
                      onClick={() => {
                        setEditPanelGroupId(null);
                        setConfirmDeleteGroupId(group.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* confirm delete panel */}
                {confirmDeleteGroupId === group.id && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20"
                    onClick={() => setConfirmDeleteGroupId(null)}
                  >
                    <div
                      className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="mb-4">Are you sure you want to delete this group?</p>
                      <div className="flex justify-center gap-4">
                        <button
                          className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                          onClick={() => setConfirmDeleteGroupId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-red-700/60 rounded hover:bg-red-800/50"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGroupsPage;
