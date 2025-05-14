"use client";

import { Home, PlusCircle, Users, User, Settings as SettingsIcon } from "lucide-react";
import CreateGroup from "@/app/src/components/Chat/CreateGroup";
import { useState } from "react";
import { useSessionStore } from "../../zustand/atoms/zustand";
import UserGroups from "../users/[userId]/groups";

export default function Chat() {
  const [activeTab, setActiveTab] = useState("home");

  const session = useSessionStore((state) => state.session);
  const userId = session?.user?.id;

  return (
    <div className="h-screen w-full pt-[80px] flex">
      {/* Sidebar */}
      <div className="h-full w-64 bg-[#0f0f0f] border-r border-[#1f1f1f] text-white p-6 flex flex-col justify-between">
        <div>
          <button
            onClick={() => setActiveTab("home")}
            className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium mb-2 ${
              activeTab === "home" ? "bg-[#1a1a1a]" : ""
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium mb-2 ${
              activeTab === "create" ? "bg-[#1a1a1a]" : ""
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            Create Group
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium mb-2 ${
              activeTab === "groups" ? "bg-[#1a1a1a]" : ""
            }`}
          >
            <Users className="w-5 h-5" />
            My Groups
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium mb-2 ${
              activeTab === "profile" ? "bg-[#1a1a1a]" : ""
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full gap-3 p-3 hover:bg-[#1a1a1a] transition rounded-xl text-md font-medium ${
              activeTab === "settings" ? "bg-[#1a1a1a]" : ""
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
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
            <CreateGroup />
          </div>
        )}
        {activeTab === "groups" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Groups</h2>
            {userId ? (
              <UserGroups />
            ) : (
              <p className="text-gray-400">Loading session...</p>
            )}
          </div>
        )}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p>Profile details and settings will appear here.</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p>Change your account and app preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
}
