"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/app/zustand/atoms/zustand';
import { Eye, EyeOff, MoreVertical } from "lucide-react";
import { toast } from 'react-toastify';
import { useWebSocket } from '@/hooks/useWebSocket';

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
  userId: string;
  socket: ReturnType<typeof useWebSocket>;
}

const UserGroupsPage: React.FC<UserGroupsPageProps> = ({ userId, socket }) => {
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [groupId: string]: boolean }>({});
  const [editPanelGroupId, setEditPanelGroupId] = useState<string | null>(null);
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<string | null>(null);

  const { session } = useSessionStore();
  const router = useRouter();
  const token = session.user.token;
  const userIdNum = session.user.id;
  const avatar = session.user.image;

  const { leaveRoom } = socket

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ChatGroup[]>(
          `http://localhost:8080/api/my-groups/${userIdNum}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroups(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load your groups.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserGroups();
  }, [userIdNum]);

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      leaveRoom(groupId);
      console.log("room deleted: ", groupId)

      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      setConfirmDeleteGroupId(null);
      toast.success("Group deleted successfully!");
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error("Failed to delete group. Try again.");
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
    <div className="container mx-auto px-[80px] py-8">
      {groups.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You haven't created any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {groups.map((group) => (
            <div key={group.id} className="relative bg-[#101010] p-6 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg mb-1">{group.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded ${
                    group.type === "PRIVATE"
                      ? "bg-red-600/20 text-red-400"
                      : "bg-blue-600/20 text-blue-300"
                  }`}>
                    {group.type}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">
                    Created on {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                  {group.type === "PRIVATE" && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-200">
                        {visiblePasswords[group.id] ? group.passcode : '••••••'}
                      </span>
                      <button onClick={() => {
                        setVisiblePasswords((prev) => ({
                          ...prev,
                          [group.id]: !prev[group.id],
                        }));
                      }}>
                        {visiblePasswords[group.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  className="text-white p-1"
                  onClick={() => setEditPanelGroupId(editPanelGroupId === group.id ? null : group.id)}
                >
                  <MoreVertical />
                </button>
              </div>

              {/* Group avatar */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-green-400">
                  {group.GroupUsers?.length || 0} members
                </span>
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                  {group.image ? (
                    <img src={group.image} alt="Group avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img src={avatar || ''} alt="Default" />
                  )}
                </div>
              </div>

              {/* Dropdown menu */}
              {editPanelGroupId === group.id && (
                <div className="absolute top-16 right-6 bg-[#1f1f1f] p-2 rounded shadow-lg z-20">
                  <button
                    className="text-white text-sm hover:text-blue-400 block mb-2"
                    onClick={() => {
                      navigator.clipboard.writeText(group.invite_token);
                      toast.success("Invite link copied!");
                      setEditPanelGroupId(null);
                    }}
                  >
                    Copy Invite Link
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-600 block"
                    onClick={() => {
                      setEditPanelGroupId(null);
                      setConfirmDeleteGroupId(group.id);
                    }}
                  >
                    Delete Group
                  </button>
                </div>
              )}

              {/* Confirm delete modal */}
              {confirmDeleteGroupId === group.id && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg">
                    <p className="mb-4">Are you sure you want to delete <strong>{group.title}</strong>?</p>
                    <div className="flex justify-end gap-4">
                      <button
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                        onClick={() => setConfirmDeleteGroupId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGroupsPage;
