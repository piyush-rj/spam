"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { ChatGroupType, JoinRoomProps } from '../../../../types/ChatTypes';
import { CHAT_GROUP_URL } from '../../../../lib/api-endpoint';
import { fetchGroups } from '../../../../fetch/fetchGroup';
import { useSession } from 'next-auth/react';

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom, isConnected }) => {
  const [roomInput, setRoomInput] = useState<string>("");
  const [passInput, setPassInput] = useState<string>("");
  const { data: session } = useSession()

  const handleJoinRoom = async () => {
    if (!roomInput.trim() || !passInput.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        CHAT_GROUP_URL,
        {
          title: roomInput.trim(),
          passcode: passInput.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Group created:', response.data);
      onJoinRoom(roomInput.trim());
    } catch (error: any) {
      console.log("create room failed", error)
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  async function getGroups(){
    try {
      const groups = await fetchGroups(
        session.user.token
      )
      console.log("the groups are: ", groups)
    } catch (error) {
      console.log("fetch faileddd")
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-0 h-auto">
        <button onClick={getGroups} className='bg-white text-black px-4 py-1.5 rounded-md'>show groups</button>
      <div className="relative w-screen max-w-md p-8 rounded-xl shadow-xl bg-[#0f0f0f] border border-purple-700/30">
        <h2 className="text-center text-3xl font-extrabold text-white mb-8 tracking-tight">
          Create a Chat Group
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-purple-400 mb-2 tracking-wide">
              Name
            </label>
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. orbit room"
              className="w-full px-4 py-3 rounded-md bg-[#1a1a1a] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-400 mb-2 tracking-wide">
              Passcode
            </label>
            <input
              type="text"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. abc123"
              className="w-full px-4 py-3 rounded-md bg-[#1a1a1a] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={!isConnected}
            className={`w-full py-3 px-6 rounded-md text-white font-semibold bg-gradient-to-br from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-md ${
              !isConnected ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {isConnected ? 'Create' : 'Connecting...'}
          </button>
        </div>

        <div className="mt-6 text-sm text-center text-gray-500">
          <span className="text-purple-400 tracking-wide font-semibold">Orbit</span>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
