"use client";

import HeadingCard from "@/src/Components/dashboard/HeadingCard";
import DashboardAccessComponent from "./DashboardAccessComponent";
import { BiHome } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdGroups } from "react-icons/md";
import { TbSettings2 } from "react-icons/tb";
import { useDashboardRendererStore } from "@/src/store/useDashboardRendererStore";
import { DashboardRendererEnum } from "@/src/types/DashboardRendererEnum";

export default function DashboardLeft() {
    const { setValue } = useDashboardRendererStore();

    return (
        <div className="h-full w-[20%] border pt-20">
            <HeadingCard />

            <div className="space-y-3 pt-6">
                <DashboardAccessComponent
                    title="Home"
                    logo={<BiHome />}
                    setState={() => setValue(DashboardRendererEnum.HOME)}
                />

                <DashboardAccessComponent
                    title="Create Room"
                    logo={<FiPlus />}
                    setState={() => setValue(DashboardRendererEnum.CREATE_ROOM)}
                />

                <DashboardAccessComponent
                    title="My Rooms"
                    logo={<MdGroups />}
                    setState={() => setValue(DashboardRendererEnum.MY_ROOMS)}
                />

                <DashboardAccessComponent
                    title="Profile"
                    logo={<CgProfile />}
                    setState={() => setValue(DashboardRendererEnum.PROFILE)}
                />

                <DashboardAccessComponent
                    title="Settings"
                    logo={<TbSettings2 />}
                    setState={() => setValue(DashboardRendererEnum.SETTINGS)}
                />
            </div>

        </div>
    );
}
