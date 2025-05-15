"use client";
import { useState } from "react";
import InputField from "./InputField";
import { CreateGroupSchema } from "@/app/validation/CreateGroupValidation";
import axios from "axios";
import { useSessionStore } from "@/app/zustand/atoms/zustand"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CHAT_GROUP_URL } from "@/lib/api-endpoint";


interface MultiStepGroupFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const MultiStepGroupForm = ({ isOpen, setIsOpen}: MultiStepGroupFormProps) => {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { session } = useSessionStore();
  const router = useRouter();

  const resetForm = () => {
    setStep(1);
    setGroupName("");
    setIsPrivate(false);
    setPassword("");
    setImage(null);
    setImagePreview(null);
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!groupName.trim()) {
        setError("Group name is required");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = session.user.token;
      console.log("token inside form: ", token)
      const type = isPrivate ? "PRIVATE" : "PUBLIC";
      
      // Validate data
      const validationData = { 
        title: groupName, 
        passcode: type === "PRIVATE" ? password : undefined 
      };

          
      const result = CreateGroupSchema.safeParse(validationData);
      if (!result.success) {
        const formatted = result.error.format();
        const titleError = formatted.title?._errors?.[0];
        const passcodeError = formatted.passcode?._errors?.[0];

        setError(titleError || passcodeError || "Validation failed");

        setLoading(false);
        return;
      }
      
      
      const formData = new FormData();
      formData.append("title", groupName);
      formData.append("type", type);
      
      if (type === "PRIVATE" && password) {
        formData.append("passcode", password);
      }
      
      if (image) {
        formData.append("image", image);
      }
      
      const response = await axios.post(CHAT_GROUP_URL, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      
      console.log("Group created:", response.data);
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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-[#141414] border-t border-l border-[#141414] p-8 rounded-lg shadow-lg w-96">
            {/* close */}
            <div className="flex w-full justify-end -mt-2">
              <div 
                className="relative group h-4 w-4 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
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
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? "bg-blue-600" : "bg-gray-600"}`}>
                  
                </div>
                <div className="w-12 h-1 bg-gray-600"></div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? "bg-blue-600" : "bg-gray-600"}`}>
                  
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-400 p-2 mb-4 rounded text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Group Name and Privacy */}
            {step === 1 && (
              <>
                <InputField 
                  label="Group Name" 
                  value={groupName} 
                  setValue={setGroupName} 
                />
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Group Privacy</label>
                  <div className="flex items-center gap-3 bg-[#1c1c1c] p-1.5 rounded-md">
                    <button
                      type="button"
                      className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                        !isPrivate 
                          ? "bg-black text-white" 
                          : "bg-transparent text-gray-400 hover:bg-blue-900/20"
                      }`}
                      onClick={() => setIsPrivate(false)}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                        isPrivate 
                          ? "bg-black text-white" 
                          : "bg-transparent text-gray-400 hover:bg-blue-900/20"
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
                    className="px-5 py-1.5 bg-black border border-black text-white rounded-md font-medium hover:border hover:text-yellow-600 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Image Upload and Password (if private) */}
            {step === 2 && (
              <>
                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Group Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-md p-4 text-center hover:border-blue-500 transition-colors">
                    {imagePreview ? (
                      <div className="relative w-full h-48 mb-2">
                        <div className="w-full h-48 relative rounded-md overflow-hidden">
                          <Image 
                            src={imagePreview} 
                            alt="Preview" 
                            layout="fill" 
                            objectFit="cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="mt-2 text-sm text-gray-400">Click to upload or drag and drop</p>
                      </div>
                    )}
                    <label className="relative block cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                        />
                    </label>

                  </div>
                </div>

                {/* Password field (conditionally rendered) */}
                {isPrivate ? (
                  <InputField 
                    label="Password" 
                    value={password} 
                    setValue={setPassword}
                  />
                ) : (
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Password</label>
                    <div className="bg-[#1c1c1c] p-3 rounded-md text-gray-500 italic">
                      Not required for public groups
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-4 py-1.5 bg-blue-800 text- rounded-md hover:bg-blue-950 text-[#ffffff] transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || (isPrivate && !password)}
                    className={`px-4 py-2 bg-black text-white rounded-md border border-black hover:text-yellow-700 shadow-sm shadow-[#000] hover:shadow-lg hover:shadow-[#222222] font-medium transition-all duration-200 ${
                      loading || (isPrivate && !password)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-blue-800 hover:to-blue-950"
                    }`}
                  >
                    {loading ? "Creating..." : "Create Group"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


    </>
  );
};

export default MultiStepGroupForm;