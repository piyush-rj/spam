"use client";

import HeadingCard from "@/src/Components/dashboard/HeadingCard";
import DashboardAccessComponent from "./DashboardAccessComponent";
import { BiHome } from "react-icons/bi";
import { FiPlus, FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdGroups } from "react-icons/md";
import { TbSettings2 } from "react-icons/tb";
import { useDashboardRendererStore } from "@/src/store/useDashboardRendererStore";
import { DashboardRendererEnum } from "@/src/types/DashboardRendererEnum";
import { Button } from "@/components/ui/button";

export default function DashboardLeft() {
    const { value, setValue } = useDashboardRendererStore();

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
    };

    return (
        <div className="h-[90%] w-[16%] border rounded-3xl flex flex-col justify-between p-4">

            <div className="space-y-3">
                <DashboardAccessComponent
                    title="Home"
                    logo={<BiHome />}
                    setState={() => setValue(DashboardRendererEnum.HOME)}
                    isActive={value === DashboardRendererEnum.HOME}
                />

                <DashboardAccessComponent
                    title="Create Room"
                    logo={<FiPlus />}
                    setState={() => setValue(DashboardRendererEnum.CREATE_ROOM)}
                    isActive={value === DashboardRendererEnum.CREATE_ROOM}
                />

                <DashboardAccessComponent
                    title="My Rooms"
                    logo={<MdGroups />}
                    setState={() => setValue(DashboardRendererEnum.MY_ROOMS)}
                    isActive={value === DashboardRendererEnum.MY_ROOMS}
                />

                <DashboardAccessComponent
                    title="Profile"
                    logo={<CgProfile />}
                    setState={() => setValue(DashboardRendererEnum.PROFILE)}
                    isActive={value === DashboardRendererEnum.PROFILE}
                />

                <DashboardAccessComponent
                    title="Settings"
                    logo={<TbSettings2 />}
                    setState={() => setValue(DashboardRendererEnum.SETTINGS)}
                    isActive={value === DashboardRendererEnum.SETTINGS}
                />
            </div>
        </div>
    );
}
