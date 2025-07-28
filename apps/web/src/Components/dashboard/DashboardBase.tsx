import DashboardLeft from "./DashboardLeft";
import DashboardRight from "./DashboardRight";
import DashboardNavbar from "../navbars/DashboardNavbar";

export default function DashboardBase() {
    return (
        <div className="w-full h-full max-h-[90%] bg-neutral-200 dark:bg-black">
            <div className="fixed w-full z-[990]">
                <DashboardNavbar />
            </div>
            <div className="mx-auto max-w-[1700px] px-4 flex flex-col gap-12">
                <div className="w-full h-screen flex pt-25">
                    
                    <DashboardLeft />
                    <DashboardRight />
                </div>

            </div>
        </div>
    )
}