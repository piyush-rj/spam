"use client";
import { useState } from "react";
import { useSessionStore } from "@/app/zustand/atoms/zustand";
import { useWebSocket } from "@/hooks/useWebSocket";
import MultiStepGroupForm from "./CreateGroupForm";
import JoinGroupDialog from "./JoinGroupDialog";

interface useWebSocketOptions {
  socket: ReturnType<typeof useWebSocket>
}

const DialogBox = ({socket}: useWebSocketOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [joinPanelOpen, setJoinPanelOpen] = useState(false);

  return (
    <>
      <MultiStepGroupForm isOpen={isOpen} setIsOpen={setIsOpen} socket={socket} />

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-md font-medium hover:from-blue-800 hover:to-blue-950 transition-all duration-200"
        >
          Create Group
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setJoinPanelOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-md font-medium hover:from-blue-800 hover:to-blue-950 transition-all duration-200"
        >
          Join Group
        </button>
      </div>

      <JoinGroupDialog isOpen={joinPanelOpen} onClose={() => setJoinPanelOpen(false)} />
    </>
  );
};

export default DialogBox;
