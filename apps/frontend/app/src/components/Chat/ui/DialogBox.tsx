"use client";
import { useState } from "react";
import MultiStepGroupForm from "./MultiStepGroupForm";
import JoinGroupDialog from "./JoinGroupDialog";

const DialogBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [joinPanelOpen, setJoinPanelOpen] = useState(false);

  return (
    <>
      <MultiStepGroupForm isOpen={isOpen} setIsOpen={setIsOpen} />

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
