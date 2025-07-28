import RoomDisplayCard from "@/src/utility/RoomDisplayCard";
import TitleDescription from "@/src/utility/TitleDescription";

export default function DashboardMyRooms() {
    return (
        <div className="w-full h-full flex justify-start items-start pt-2 px-6">

            <div className="flex flex-col">
                <TitleDescription className="pb-8" title="Join Room" description="Enter the credentials to join a room"></TitleDescription>

                <div className="max-w-2xl ">

                    <RoomDisplayCard />
                </div>
            </div>
        </div>
    )
}