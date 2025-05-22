"use client";

import { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import axios from "axios";
import { useSessionStore } from "@/app/zustand/atoms/zustand";
import { useSocket } from "@/src/hooks/useSocket";

interface JoinGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupResponseData {
  roomId: string;
}

const JoinGroupDialog = ({ isOpen, onClose }: JoinGroupDialogProps) => {
  const [inviteToken, setInviteToken] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const { session } = useSessionStore();
  const { subscribeToRoom } = useSocket();

  const token = session?.user?.token;

  const handleJoin = async () => {
    if (!inviteToken.trim()) {
      alert("Invite token is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<GroupResponseData>(
        "http://localhost:8080/api/group/join",
        { inviteToken, passcode },
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { roomId } = response.data;
      subscribeToRoom(roomId);

      console.log("joined group with roomid: ", roomId);
      onClose();
      setInviteToken("");
      setPasscode("");
    } catch (error: any) {
      console.log("Error joining group:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to join group.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
      <div className="bg-[#141414] border border-[#333] p-8 rounded-lg shadow-lg w-[90%] max-w-md">

        {/* Close Button */}
        <div className="flex w-full justify-end -mt-2">
          <div
            className="relative group h-4 w-4 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer"
            onClick={onClose}
          >
            <span className="absolute inset-0 flex items-center justify-center text-black text-md opacity-0 group-hover:opacity-100 transition-opacity">
              ×
            </span>
          </div>
        </div>

        <h3 className="text-2xl text-white font-semibold mb-6 mt-3 text-center">
          Join a Group
        </h3>

        <InputField
          label="Invite Token"
          value={inviteToken}
          setValue={setInviteToken}
        />
        <InputField
          label="Passcode (if any)"
          value={passcode}
          setValue={setPasscode}
        />

        <SubmitButton
          text={loading ? "Joining..." : "Join"}
          onClick={handleJoin}
        />
      </div>
    </div>
  );
};

export default JoinGroupDialog;
