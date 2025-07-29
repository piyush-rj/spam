"use client"
import { useDashboardRendererStore } from "@/src/store/useDashboardRendererStore"
import { DashboardRendererEnum } from "@/src/types/DashboardRendererEnum";
import DashboardHome from "./DashboardHome";
import DashboardCreateRoom from "./DashboardCreateRoom";
import DashboardProfile from "./DashboardProfile";
import DashboardSettings from "./DashboardSettings";
import DashboardMyRooms from "./DashboardMyRooms";

export default function DashboardRight() {

    function handleRightSection() {
        const { value } = useDashboardRendererStore();

        switch (value) {
            case DashboardRendererEnum.HOME:
                return <DashboardHome/>;
            case DashboardRendererEnum.CREATE_ROOM:
                return <DashboardCreateRoom/>;
            case DashboardRendererEnum.MY_ROOMS:
                return <DashboardMyRooms/>;
            case DashboardRendererEnum.PROFILE:
                return <DashboardProfile/>;
            case DashboardRendererEnum.SETTINGS:
                return <DashboardSettings/>;
        }
    }

    return (
        <div className="max-h-[90%] w-[80%]">
            {handleRightSection()}
        </div>

    )
}