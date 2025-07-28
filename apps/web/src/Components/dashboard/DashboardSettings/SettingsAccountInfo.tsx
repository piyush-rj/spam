"use client";

import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import { useEffect, useState } from "react";
import { GET_USERNAME_URL, UPDATE_USERNAME_URL } from "@/routes/api-routes";
import axios from "axios";
import UserInfoDisplay from "@/src/utility/UserInfoDisplay";

export default function SettingsAccountInfo() {
    const { session } = useUserSessionStore();

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsername = async () => {
            if (!session?.user?.id) return;

            try {
                const response = await axios.get(GET_USERNAME_URL, {
                    params: { userId: session.user.id },
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                });

                const fetchedUsername = response.data.username;
                setUsername(fetchedUsername);
                setNewUsername(fetchedUsername);
            } catch (error) {
                console.error("Failed to fetch username:", error);
            }
        };

        fetchUsername();
    }, [session]);

    const handleUpdateUsername = async () => {
        if (!session || !newUsername || newUsername === username) return;
        setLoading(true);

        try {
            const response = await axios.post(
                UPDATE_USERNAME_URL,
                {
                    userId: session.user.id,
                    username: newUsername,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }
            );

            const resUsername = response.data.updatedUsername;
            setUsername(resUsername);
            setNewUsername(resUsername);
            setEditing(false);
        } catch (error) {
            console.error("Username update failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setNewUsername(username);
        setEditing(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-14">
            <UserInfoDisplay
                session={session}
                username={username}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                editing={editing}
                setEditing={setEditing}
                loading={loading}
                handleUpdateUsername={handleUpdateUsername}
                handleCancelEdit={handleCancelEdit}
            />
        </div>
    );
}
