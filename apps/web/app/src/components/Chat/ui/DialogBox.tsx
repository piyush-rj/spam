"use client";
import { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { CreateGroupSchema } from "@/app/validation/CreateGroupValidation"; 
import axios from "axios"
import { useSessionStore } from "@/app/zustand/atoms/zustand";
import { CHAT_GROUP_URL } from "@/lib/api-endpoint";

const DialogBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const { session } = useSessionStore()

  const handleSubmit = () => {
    const token = session.user.token;

    const result = CreateGroupSchema.safeParse({ title: groupName, passcode: password });

    if (!result.success) {
      console.log("Validation failed:", result.error.format());
      return;
    }

    try {
      const response = axios.post(CHAT_GROUP_URL, {
        title: groupName,
        passcode: password,
      }, {
        headers: { 
          "Content-type" : "application/json" ,         
          "Authorization" : `Bearer ${token}`,
        }
      })

      console.log("group created: ", response);
      setIsOpen(false)
    } catch (error) {
      console.error("error in creating groups, error: ", error)
    }
  };


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-[#141414] border-t border-l border-[#141414] p-8 rounded-lg shadow-lg w-max">

            {/* close button */}
            <div className="flex w-full justify-end -mt-2">
              <div className="relative group h-4 w-4 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer">
                <span
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 flex items-center justify-center text-[#000] text-md pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </span>
              </div>
            </div>

            {/* heading */}
            <h3 className="text-2xl flex justify-center items-center text-white font-semibold mb-6 mt-3">
              Create a Group
            </h3>
            <InputField label="Group Name" value={groupName} setValue={setGroupName} />
            <InputField label="Password" value={password} setValue={setPassword} />
            <SubmitButton onClick={handleSubmit} />
          </div>
        </div>
      )}

      {/* create group button (on page) */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-md font-medium hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-950 transition-all tranform duration-200"
        >
          Create Group
        </button>
      </div>
    </>
  );
};

export default DialogBox;
