"use client"
interface InputFieldProps {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
};
  
const InputField = ({ label, value, setValue }: InputFieldProps) => {
    return (
        <div className="mb-4">
        <label className="block text-md text-gray-300">{label}</label>
        <input
            type="text"
            className="mt-2 block w-full p-2 px-3 rounded-md bg-[#232323] text-white placeholder-gray-400"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`${label.toLowerCase()}`}
        />
        </div>
    );
};
  
export default InputField;
  