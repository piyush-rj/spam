"use client";

import { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import axios from "axios";
import { useSessionStore } from "@/app/zustand/atoms/zustand";

interface JoinGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinGroupDialog = ({ isOpen, onClose }: JoinGroupDialogProps) => {
  const [inviteToken, setInviteToken] = useState("");
  const [passcode, setPasscode] = useState("");
  const { session } = useSessionStore();

  async function handleJoin() {
    if (!inviteToken) {
      alert("Invite link is required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/group/join", {
        inviteToken,
        passcode,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user.token}`,
        },
      });

      console.log("Joined group:", res.data);
      alert("Successfully joined the group!");
      onClose();
    } catch (error: any) {
      console.error("Error joining group:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to join group");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
      <div className="bg-[#141414] border border-[#333] p-8 rounded-lg shadow-lg w-max">

        {/* close button */}
        <div className="flex w-full justify-end -mt-2">
          <div className="relative group h-4 w-4 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer">
            <span
              onClick={onClose}
              className="absolute inset-0 flex items-center justify-center text-black text-md pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </span>
          </div>
        </div>

        <h3 className="text-2xl text-white font-semibold mb-6 mt-3 text-center">
          Join a Group
        </h3>

        <InputField label="Invite Token" value={inviteToken} setValue={setInviteToken} />
        <InputField label="Passcode (if any)" value={passcode} setValue={setPasscode} />
        <SubmitButton text="Join" onClick={handleJoin} />
      </div>
    </div>
  );
};

export default JoinGroupDialog;
