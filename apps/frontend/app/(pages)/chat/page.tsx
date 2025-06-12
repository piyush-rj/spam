"use client";

import { Home, PlusCircle, Users, User, MessageCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import UserGroupsPage from "../groups/[id]/page";
import ChatPanel from "@/app/src/components/Chat/ChatPanel";
import DialogBox from "@/app/src/components/Chat/ui/DialogBox";
import { useActiveUsersStore, useChatStore, useSessionStore, useSocketStore } from "@/app/zustand/atoms/zustand";
import { useSocket } from "@/src/hooks/useSocket";

export default function Chat() {
  const [activeTab, setActiveTab] = useState("home");
  const { activeGroupId, activeGroupName } = useChatStore();
  const { session } = useSessionStore();
  const userId = session?.user?.id;
  const { sendMessage, useSubscribe, subscribeToRoom, unsubscribeFromRoom, isReady, connectionState } = useSocket();
  const { setUserActive, setUserInactive } = useActiveUsersStore();


  useEffect(() => {
    if (!activeGroupId || !session?.user?.id) return;

    subscribeToRoom(activeGroupId);
    setUserActive(activeGroupId, session.user.id);

    return () => {
      unsubscribeFromRoom(activeGroupId);
      setUserInactive(activeGroupId, session?.user?.id);
    }
  }, [activeGroupId, session?.user?.id])

  const activeUsers = useActiveUsersStore((state) => activeGroupId ? state.activeUsers[activeGroupId] || [] : []);


  return (
    <div className="h-screen w-full pt-[80px] flex">
      {/* Sidebar */}
      <div className="h-full w-64 bg-[#0f0f0f] border-r border-[#1f1f1f] text-white p-6 flex flex-col justify-between">
        <div>
          {[
            { key: "home", label: "Home", icon: Home },
            { key: "create", label: "Create Group", icon: PlusCircle },
            { key: "groups", label: "My Groups", icon: Users },
            { key: "chat", label: "Chat", icon: MessageCircleIcon },
            { key: "profile", label: "Profile", icon: User },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium mb-2 ${activeTab === key ? "bg-[#1a1a1a]" : ""
                }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="h-full w-full bg-[#121212] p-6 text-white overflow-auto">
        {activeTab === "home" && (
          <div className="text-xl font-semibold">Welcome to ORBIT</div>
        )}

        {activeTab === "create" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Group</h2>
            <DialogBox />
          </div>
        )}

        {activeTab === "groups" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Groups</h2>
            {userId ? (
              <UserGroupsPage
                onJoinGroup={(groupId: string, groupName: string) => {
                  useChatStore.getState().setGroup(groupId, groupName);
                  setActiveTab("chat");
                  console.log(`Joined group with room id: ${groupId}`);
                }}
              />
            ) : (
              <p className="text-gray-400">Please sign in to view your groups</p>
            )}
          </div>
        )}

        {activeTab === "chat" && activeGroupId && activeGroupName && (
        <ChatPanel
          groupId={activeGroupId}
          groupName={activeGroupName}
          sendMessage={sendMessage}
          useSubscribe={useSubscribe}
          subscribeToRoom={subscribeToRoom}
          unsubscribeFromRoom={unsubscribeFromRoom}
          isReady={isReady}
          connectionState={connectionState}
          activeUsers={activeUsers}
        />
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p>profile details/ theme changer</p>
          </div>
        )}
      </div>
    </div>
  );
}
