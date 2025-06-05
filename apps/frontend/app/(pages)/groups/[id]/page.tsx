"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useChatStore, useSessionStore } from '@/app/zustand/atoms/zustand';
import { Eye, EyeOff, MoreVertical } from "lucide-react";
import { toast } from 'react-toastify';
import { useSocket } from '@/src/hooks/useSocket';

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
  type: "PUBLIC" | "PRIVATE";
  user?: User;
  invite_token: string;
  GroupUsers?: GroupUser[];
}

interface UserGroupsPageProps {
  onJoinGroup?: (groupId: string, groupName: string) => void;
}

const UserGroupsPage: React.FC<UserGroupsPageProps> = ({ onJoinGroup }) => {
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [editPanelGroupId, setEditPanelGroupId] = useState<string | null>(null);
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<string | null>(null);
  const [updatePanelGroupId, setUpdatePanelGroupId] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState<{ title: string; passcode?: string }>({ title: '', passcode: '' });

  const { session } = useSessionStore();
  const token = session?.user?.token;
  const userIdNum = session?.user?.id;
  const avatar = session?.user?.image;

  const { subscribeToRoom, unsubscribeFromRoom } = useSocket();

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!token || !userIdNum) return;

      try {
        setLoading(true);
        const response = await axios.get<ChatGroup[]>(
          `http://localhost:8080/api/my-groups/${userIdNum}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroups(response.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load your groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, [userIdNum, token]);

  const handleJoin = (groupId: string, groupName: string) => {
    subscribeToRoom(groupId);
    useChatStore.getState().setGroup(groupId, groupName);
    toast.success(`Joined group ${groupName}`);

    if (onJoinGroup) {
      onJoinGroup(groupId, groupName);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8080/api/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      unsubscribeFromRoom(groupId);
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      setConfirmDeleteGroupId(null);
      toast.success("Group deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete group.");
    }
  };

  const handleUpdateGroup = async (groupId: string) => {
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:8080/api/group/${groupId}`,
        { title: updateForm.title, passcode: updateForm.passcode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, title: updateForm.title, passcode: updateForm.passcode || '' } : group
        )
      );
      toast.success("Group updated!");
      setUpdatePanelGroupId(null);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update group.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  return (
    <div className="container mx-auto px-[80px] py-8">
      {groups.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You haven't created any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {groups.map((group) => {
            const isPrivate = group.type === "PRIVATE";
            const passwordVisible = visiblePasswords[group.id];

            return (
              <div
                key={group.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("button") || target.closest(".no-join")) return;
                  handleJoin(group.id, group.title);
                }}
                className="relative bg-[#101010] hover:shadow-md hover:shadow-[#1f1f1f] transition-shadow duration-200 p-6 rounded-lg"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg mb-1">{group.title}</h2>
                    <span className={`text-xs px-2 py-1 rounded ${isPrivate ? "bg-red-600/20 text-red-400" : "bg-blue-600/20 text-blue-300"}`}>
                      {group.type}
                    </span>
                    <p className="text-gray-400 text-sm mt-1">
                      Created on {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                    {isPrivate && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-200">{passwordVisible ? group.passcode : '••••••'}</span>
                        <button
                          title="Toggle password visibility"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisiblePasswords((prev) => ({
                              ...prev,
                              [group.id]: !prev[group.id],
                            }));
                          }}
                        >
                          {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    title="Edit group"
                    className="text-white absolute top-8 right-5 z-30 hover:text-neutral-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditPanelGroupId(editPanelGroupId === group.id ? null : group.id);
                    }}
                  >
                    <MoreVertical />
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-green-400">{group.GroupUsers?.length || 0} members</span>
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={group.image || avatar || '/default-avatar.png'}
                      alt="Group avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Dropdown */}
                {editPanelGroupId === group.id && (
                  <div className="absolute top-16 right-6 bg-[#1f1f1f] p-3 rounded shadow-lg z-20">
                    <button
                      className="text-white text-md hover:text-[#c5c5c5] block mb-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpdatePanelGroupId(group.id);
                        setUpdateForm({ title: group.title, passcode: group.passcode });
                        setEditPanelGroupId(null);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="text-white text-md hover:text-[#c5c5c5] block mb-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${window.location.origin}/invite/${group.invite_token}`);
                        toast.success("Invite link copied!");
                        setEditPanelGroupId(null);
                      }}
                    >
                      Copy
                    </button>
                    <button
                      className="text-md text-red-500 hover:text-red-600 block"
                      onClick={() => {
                        setConfirmDeleteGroupId(group.id);
                        setEditPanelGroupId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Confirm Delete */}
                {confirmDeleteGroupId === group.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
                    <div className="bg-[#1a1a1a] text-white p-7 rounded-lg shadow-lg">
                      <p className="mb-4 text-md">Are you sure you want to delete <strong>{group.title}</strong>?</p>
                      <div className="flex justify-center gap-4">
                        <button onClick={() => setConfirmDeleteGroupId(null)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                          Cancel
                        </button>
                        <button onClick={() => handleDeleteGroup(group.id)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-500">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Update Modal */}
                {updatePanelGroupId === group.id && (
                  <div 
                  className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]"
                  onClick={(e) => {setUpdatePanelGroupId(null)}}
                  >
                    <div 
                    className="bg-[#1a1a1a] text-white p-7 rounded-lg shadow-lg min-w-[300px]"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    >
                      <p className="mb-4 text-lg font-semibold">Update {group.title}</p>
                      <input
                        type="text"
                        className="w-full px-3 py-2 mb-4 rounded bg-[#2a2a2a] text-white"
                        placeholder="Group Title"
                        value={updateForm.title}
                        onChange={(e) => {
                          // e.preventDefault();
                          setUpdateForm({ ...updateForm, title: e.target.value })}
                        }
                      />
                      {isPrivate && (
                        <input
                          type="text"
                          className="w-full px-3 py-2 mb-4 rounded bg-[#2a2a2a] text-white"
                          placeholder="Passcode"
                          value={updateForm.passcode}
                          onChange={(e) => {
                            e.preventDefault();
                            setUpdateForm({ ...updateForm, passcode: e.target.value })}
                        }
                        />
                      )}
                      <div className="flex justify-between gap-4 mt-6">
                        <button onClick={() => setUpdatePanelGroupId(null)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                          Cancel
                        </button>
                        <button onClick={() => handleUpdateGroup(group.id)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserGroupsPage;
