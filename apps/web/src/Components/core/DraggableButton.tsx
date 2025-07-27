export interface DraggableButtonProps {
    text: string;
    logo: React.ReactElement;
    className?: string;
}

export default function DraggableButton({ text, logo, className }: DraggableButtonProps) {
    return (
        <div className="w-full h-[80px] border border-zinc-500 dark:border-zinc-800/50 rounded-3xl dark:bg-[#111111] bg-neutral-200">
            <div className="w-full h-full flex px-5 rounded-3xl">
                <div className="w-[20%] flex justify-center items-center text-black dark:text-[#d1d1d1]">
                    {logo}
                </div>
                <div className="w-[80%] text-[20px] text-black dark:text-neutral-300/80 tracking-wide flex justify-center items-center font-sans">
                    {text}
                </div>
            </div>
        </div>
    );
}
