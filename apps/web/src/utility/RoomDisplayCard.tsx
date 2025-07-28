"use client";

import { useEffect, useState } from "react";
import { useUserSessionStore } from "../store/useUserSessionStore";
import axios from "axios";
import { GET_ROOM_URL, JOIN_ROOM_URL } from "@/routes/api-routes";
import RoomCard from "./RoomCard";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Room {
    id: string;
    name: string;
    description: string;
    owner: {
        id: string;
        name: string;
    };
}

export default function RoomDisplayCard() {
    const { session } = useUserSessionStore();
    const [ownedRooms, setOwnedRooms] = useState<Room[]>([]);
    const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [showJoinPanel, setShowJoinPanel] = useState(false);
    const [joinRoomId, setJoinRoomId] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            if (!session?.user.id) return;

            try {
                const response = await axios.get(`${GET_ROOM_URL}`, {
                    params: {
                        userId: session.user.id
                    },
                    headers: {
                        Authorization: `Bearer ${session.user.token}`
                    }
                });

                const { ownedRooms, joinedRooms } = response.data;

                const filteredJoinedRooms = joinedRooms.filter(
                    (joinedRoom: Room) =>
                        !ownedRooms.some((owned: Room) => owned.id === joinedRoom.id)
                );

                setOwnedRooms(ownedRooms);
                setJoinedRooms(filteredJoinedRooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [session?.user.id]);

    const handleJoinRoom = async () => {
        if (!joinRoomId) return;
        try {
            const response = await axios.post(`${JOIN_ROOM_URL}`, {
                userId: session?.user.id,
                roomId: joinRoomId,
            },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.token}`,
                    },
                }
            );
            console.log("Joined room:", response.data);
            setJoinRoomId("");
            setShowJoinPanel(false);
        } catch (error) {
            console.error("Failed to join room:", error);
        }
    };

    if (loading) {
        return <p className="text-center text-muted-foreground">Loading rooms...</p>;
    }

    const allRooms = [...ownedRooms, ...joinedRooms];

    return (
        <div className="w-full mx-auto flex flex-col h-[600px]">

            <div className="flex-1 overflow-y-auto space-y-4 pr-1  scrollbar-hide ">
                {allRooms.length > 0 ? (
                    allRooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            name={room.name}
                            description={room.description}
                            isOwner={room.owner.id === session?.user.id}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                        You are not in any rooms yet.
                    </p>
                )}
            </div>

            <div className="mt-4">
                <div
                    onClick={() => setShowJoinPanel(!showJoinPanel)}
                    className="cursor-pointer flex items-center justify-between border-2 border-[#70810fd5] border-dashed rounded-xl p-4 bg-muted/30 hover:bg-neutral-900/80 transition"
                >
                    <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        <span className="font-medium text-primary">Join a Room</span>
                    </div>
                </div>

                {showJoinPanel && (
                    <div className="mt-4 border border-muted rounded-xl p-4 bg-background space-y-4">
                        <Input
                            placeholder="Enter Room ID"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            className="w-full"
                        />
                        <Button className="w-full" onClick={handleJoinRoom}>
                            Join Room
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
