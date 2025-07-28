"use client";

import React from "react";
import ToolTipComponent from "./ToolTipComponent";

interface RoomCardProps {
    name: string;
    description: string;
    isOwner: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ name, description, isOwner }) => {
    return (
        <div className="flex justify-between items-center w-full border border-neutral-500 dark:border-muted rounded-xl px-4 py-2 shadow-sm bg-neutral-300 dark:bg-background mb-4">
            <div>
                <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-neutral-300">{name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>

            <div className="min-w-[100px] text-right">
                {isOwner ? (
                    <ToolTipComponent content="YOU ARE THE ADMIN">
                        <span className="text-[10px] font-sans px-3 py-1 bg-[#B9E741]/10 border border-[#B9E741]/60 text-[#b8e741dc] rounded-full">
                            ADMIN
                        </span>
                    </ToolTipComponent>
                ) : (
                    <ToolTipComponent content="YOU ARE A MEMBER">
                        <span className="text-[10px] font-sans tracking-wider px-2 py-1 bg-[#098fb1]/10 border border-[#098fb1]/60 text-[#098fb1] rounded-full">
                            MEMBER
                        </span>
                    </ToolTipComponent>
                )}
            </div>
        </div>

    );
};

export default RoomCard;
