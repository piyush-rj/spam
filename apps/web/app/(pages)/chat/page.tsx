"use client";

import {
  Home, PlusCircle, Users, User, MessageCircleIcon
} from "lucide-react";
import { useMemo, useState } from "react";
import UserGroupsPage from "../groups/[id]/page";
import ChatPanel from "@/app/src/components/Chat/ChatPanel";
import { useWebSocket } from "@/hooks/useWebSocket";
import DialogBox from "@/app/src/components/Chat/ui/DialogBox";

export default function Chat() {
  const [activeTab, setActiveTab] = useState("home");
  const socket = useWebSocket()

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
              className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium mb-2 ${
                activeTab === key ? "bg-[#1a1a1a]" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="h-full w-full bg-[#121212] p-6 text-white overflow-auto">
        {activeTab === "home" && (
          <div className="text-xl font-semibold">Welcome to ORBIT</div>
        )}
        {activeTab === "create" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Group</h2>
            <DialogBox socket={socket} />
          </div>
        )}
        {activeTab === "groups" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Groups</h2>
            {userId ? (
              <UserGroupsPage socket={socket} userId={userId} />
            ) : (
              <p className="text-gray-400">Please sign in to view your groups</p>
            )}
          </div>
        )}
        {activeTab === "chat" && (
          <ChatPanel 
            // socket={socket} 
            groupId="123" 
            groupName="test"
            users={[
              { id: "1", name: "piyush" },
              { id: "2", name: "anjan" },
            ]}
          />
        )}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p>Profile details and settings will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
