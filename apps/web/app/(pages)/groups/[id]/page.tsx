"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@/app/zustand/atoms/zustand';
import { Eye, EyeOff, MoreVertical } from "lucide-react";



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
  invite_token: string,
  GroupUsers?: GroupUser[];
}

interface UserGroupsPageProps {
  userId: string;
}

const UserGroupsPage: React.FC<UserGroupsPageProps> = ({ userId }) => {
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPasscode, setEditPasscode] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<{ [groupId: string]: boolean }>({});
  const [editGroupType, setEditGroupType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [copiedGroupId, setCopiedGroupId] = useState<string | null>(null);
  const { session } = useSessionStore();
  const router = useRouter();
  
  const token = session.user.token;
  const avatar = session?.user?.image;
  console.log(avatar)
  const id = session?.user?.id;


  const [editPanelGroupId, setEditPanelGroupId] = useState<string | null>(null);
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ChatGroup[]>(
          `http://localhost:8080/api/my-groups/${id}`,

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


  const togglePasswordVisibility = (groupId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
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
        <div className="text-center rounded-lg">
          <p className="text-gray-600 text-xl">You haven't created any groups yet.</p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {groups.map((group) => (
            <div
              key={group.id}
              className="relative rounded-lg overflow-hidden shadow-sm shadow-[#141414] hover:shadow-lg hover:shadow-[#2e2e2e] transition-shadow"
            >
              <div className=" bg-[#000000] px-6 py-6">
                <div className="flex justify-between p-1">
                  <div>
                    <h2 className="font-semibold text-lg truncate mb-1">{group.title}</h2>
                    <span className={`text-xs font-medium rounded px-2 py-0.5 
                      ${group.type === "PRIVATE" ? "bg-red-900/50 border border-red-600/60 text-red-200" : "bg-blue-800/50 border border-blue-600/60 text-[#ffffff]"} `}>
                      {group.type}
                    </span>


                    {group.type === 'PRIVATE' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4d4d4] text-md py-1">
                          {visiblePasswords[group.id] ? group.passcode : '••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(group.id)}
                          className="text-gray-400 hover:text-gray-100 transition"
                          aria-label="Toggle password visibility"
                        >
                          {visiblePasswords[group.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[#5e5e5e] text-sm pt-2 py-1 italic">No password</span>
                      </div>
                    )}



                    <p className="text-[#b3b3b3] text-[14px]">
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-center items-center">
                  <button
                      className="p-2  text-white rounded w-fit self-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPanelGroupId(editPanelGroupId === group.id ? null : group.id);
                        setCopiedGroupId(null);
                      }}
                      aria-label="Edit group options"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className=''>
                    <span className="text-xs bg-green-800 px-2 py-1 rounded">
                      {group.GroupUsers?.length || 0} members
                    </span>
                  </div>
                  

                  <div className="ml-8 flex flex-row gap-2">

                    
                    <div className="flex justify-center items-center ">
                    <div className="h-[50px] w-[50px] rounded-full bg-[#1d1d1d] flex items-center justify-center">
                      {group.image ? (
                        <img
                          src={group.image}
                          alt={group.title}
                          className="w-full object-cover"
                        />
                      ) : (
                        <div className="text-xl text-gray-400 rounded-full overflow-hidden">
                          <img src={avatar} alt={'0'} />
                        </div>
                      )}
                    </div>
                  </div>
                  </div>

                </div>

                {/* Edit Panel */}
                {editPanelGroupId === group.id && (
                  <div
                    className="absolute right-10 top-[63px] bg-[#1f1f1f] p-1.5 rounded shadow-md z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="block px-3 py-1.5 rounded-md text-md text-white hover:text-[#d1d1d1] mb-2"
                      onClick={() => {
                        setEditTitle(group.title);
                        setEditPasscode(group.passcode || "");
                        setEditGroupType(group.type)
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="block px-3 py-1.5 rounded-md text-md text-blue-400 hover:text-blue-600"
                      onClick={() => {
                        const inviteLink = group.invite_token;
                        navigator.clipboard.writeText(inviteLink)
                          .then(() => setCopiedGroupId(group.id))
                          .catch(() => alert("Failed to copy!"));
                      }}
                    >
                      Copy Link
                    </button>
                    <button
                      className="block px-3.5 pb-1 text-md text-red-500 hover:text-red-600"
                      onClick={() => {
                        setEditPanelGroupId(null);
                        setConfirmDeleteGroupId(group.id);
                      }}
                    >
                      Delete
                    </button>

                    {/* Show copied feedback */}
                    {copiedGroupId === group.id && (
                      <span className="text-green-500 text-xs mt-1">Copied!</span>
                    )}
                  </div>
                )}

                {editTitle !== '' && editPanelGroupId === group.id && (
                  <div
                    className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60"
                    onClick={() => {
                      setEditTitle('');
                      setEditPasscode('');
                      setEditPanelGroupId(null);
                    }}
                  >
                    <div
                      className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg w-full max-w-md shadow-[#111111]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-xl font-semibold mb-4 text-white">Edit Group</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Group Title"
                          className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white"
                        />

                        {editGroupType === 'PRIVATE' && (
                          <input
                            type="text"
                            value={editPasscode}
                            onChange={(e) => setEditPasscode(e.target.value)}
                            placeholder="Passcode"
                            className="w-full px-3 py-2 rounded bg-[#2a2a2a] text-white"
                          />
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                          <button
                            className="px-5 py-1.5 bg-red-600/40 text-white rounded hover:bg-red-600/30 hover:text-[#e4e4e4] transition-all tranform duration-150"
                            onClick={() => {
                              setEditTitle('');
                              setEditPasscode('');
                              setEditPanelGroupId(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-5 py-1. bg-blue-700/70 text-white rounded hover:bg-blue-700/40 hover:text-[#e4e4e4] transition-all transform duration-150"
                            onClick={async () => {
                              try {
                                const response = await axios.put(
                                  `http://localhost:8080/api/group/${group.id}`,
                                  {
                                    title: editTitle,
                                    passcode: editGroupType === 'PRIVATE' ? editPasscode : undefined,
                                    type: editGroupType,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                setGroups((prevGroups) =>
                                  prevGroups.map((g) =>
                                    g.id === group.id ? { ...g, title: editTitle, passcode: editPasscode } : g
                                  )
                                );
                                setEditTitle('');
                                setEditPasscode('');
                                setEditPanelGroupId(null);
                              } catch (err) {
                                console.error('Failed to update group:', err);
                              }
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
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
                      <div className="flex justify-center gap-10">
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
