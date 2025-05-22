"use client";

import { useState } from "react";
import InputField from "./InputField";
import { validateGroup } from "../../../../validation/CreateGroupValidation";
import axios from "axios";
import { useSessionStore } from "@/app/zustand/atoms/zustand"; 
import { useRouter } from "next/navigation";
import { CHAT_GROUP_URL } from "@/src/lib/api-endpoint";
import { useSocket } from "../../../../../src/hooks/useSocket";
import { toast } from "react-toastify";

interface MultiStepGroupFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface GroupResponseData {
  roomId: string;
  title: string;
  passcode: string | null;
  type: "PUBLIC" | "PRIVATE";
  user_id: string;
}

const MultiStepGroupForm = ({ isOpen, setIsOpen }: MultiStepGroupFormProps) => {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { session } = useSessionStore();
  const router = useRouter();
  const { subscribeToRoom } = useSocket();

  const resetForm = () => {
    setStep(1);
    setGroupName("");
    setIsPrivate(false);
    setPassword("");
    setError("");
  };

  const handleNext = () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if(!session || !session.user) return;

      const token = session.user.token;
      const type = isPrivate ? "PRIVATE" : "PUBLIC";

      const validationResult = validateGroup({ 
        title: groupName,
        type,
        passcode: isPrivate ? password : undefined
      });

      const result = validationResult.validation;

      if (!result.success) {
        const formatted = result.error.format();
        const titleError = formatted.title?._errors?.[0];
        const passcodeError = (formatted as any).passcode?._errors?.[0];
        setError(titleError || passcodeError || "Validation failed");
        return;
      }

      const requestData: {
        title: string;
        type: string;
        passcode?: string;
      } = {
        title: groupName,
        type,
      };

      if (isPrivate) {
        requestData.passcode = password;
      }

      const response = await axios.post<GroupResponseData>(
        CHAT_GROUP_URL,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      toast.success("Group Created");
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch (error: any) {
      console.error("Error creating group:", error);
      setError(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
      <div className="bg-[#141414] border-t border-l border-[#141414] p-8 rounded-lg shadow-lg w-96">
        {/* Close Button */}
        <div className="flex w-full justify-end -mt-2">
          <div 
            className="relative group h-4 w-4 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setTimeout(resetForm, 300)
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[#000] text-md pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              ×
            </span>
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-2xl flex justify-center items-center text-white font-semibold mb-6 mt-3">
          {step === 1 ? "Create a Group" : "Group Details"}
        </h3>

        {/* Step indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full ${step === 1 ? "bg-blue-600" : "bg-gray-600"}`}></div>
            <div className="w-12 h-1 bg-gray-600"></div>
            <div className={`w-6 h-6 rounded-full ${step === 2 ? "bg-blue-600" : "bg-gray-600"}`}></div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-400 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <>
            <InputField label="Group Name" value={groupName} setValue={setGroupName} />

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Group Privacy</label>
              <div className="flex items-center gap-3 bg-[#1c1c1c] p-1.5 rounded-md">
                <button
                  type="button"
                  className={`flex-1 py-1.5 rounded-md text-center ${
                    !isPrivate ? "bg-black text-white" : "bg-transparent text-gray-400 hover:bg-blue-900/20"
                  }`}
                  onClick={() => setIsPrivate(false)}
                >
                  Public
                </button>
                <button
                  type="button"
                  className={`flex-1 py-1.5 rounded-md text-center ${
                    isPrivate ? "bg-black text-white" : "bg-transparent text-gray-400 hover:bg-blue-900/20"
                  }`}
                  onClick={() => setIsPrivate(true)}
                >
                  Private
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-1.5 bg-black border border-black text-white rounded-md font-medium hover:border hover:text-yellow-600 transition-all"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            {isPrivate ? (
              <InputField label="Password" value={password} setValue={setPassword} />
            ) : (
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Password</label>
                <div className="bg-[#1c1c1c] p-3 rounded-md text-gray-500 italic">
                  Not required for public groups
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-1.5 bg-blue-800 text-white rounded-md hover:bg-blue-950 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (isPrivate && !password)}
                className={`px-4 py-2 bg-black text-white rounded-md border border-black font-medium shadow-sm hover:shadow-lg hover:text-yellow-700 transition-all ${
                  loading || (isPrivate && !password) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;
};

export default MultiStepGroupForm;
