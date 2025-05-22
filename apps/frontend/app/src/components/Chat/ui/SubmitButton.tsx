"use client";

interface SubmitButtonProps {
  onClick: () => void; 
  text: string;
}

const SubmitButton = ({ onClick, text }: SubmitButtonProps) => {
  return (
    <div className="flex justify-center items-center w-full">
      <button
        onClick={onClick}
        className="w-[60%] bg-[#0f0f0f] shadow-sm shadow-[#3c476a] hover:bg-[#141414] text-[#e4e4e4] text-[20px] hover:text-white p-2 rounded-lg mt-4 transition-all transform duration-200"
      >
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
