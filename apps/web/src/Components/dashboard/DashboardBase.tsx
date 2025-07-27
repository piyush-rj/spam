import AppLogo from "@/src/utility/AppLogo";
import DashboardLeft from "./DashboardLeft";
import DashboardRight from "./DashboardRight";
import DashboardNavbar from "../navbars/DashboardNavbar";

export default function DashboardBase() {
    return (
        <div className="w-full h-full">
            <div className="h-full w-full">
                <DashboardNavbar />
            </div>
            <div className="mx-auto max-w-[1800px] px-4 flex flex-col gap-12">
                <div className="w-full h-screen flex">
                    
                    <DashboardLeft />
                    <DashboardRight />
                </div>

            </div>
        </div>
    )
}