import { getServerSession } from "next-auth";
import { fetchGroups } from "../../../../fetch/fetchGroup";
import { ChatGroupType } from "../../../../types/ChatTypes";
import { authOptions } from "../../../api/auth/[...nextauth]/options";
import { useState } from "react";
import { useSession } from "next-auth/react";

export async function ChatGroups() {
    const [allGroups, setAllGroups] = useState<ChatGroupType[]>([]);
    const { data: session } = useSession()
    const groups: Array<ChatGroupType> | [] = await fetchGroups(
        session?.user?.token!
    )
    console.log("all groups are: ", groups);
    setAllGroups(groups);


    return <div className="">
        
    </div>
}