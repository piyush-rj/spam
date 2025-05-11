import { CHAT_GROUP_URL } from "../lib/api-endpoint";

export async function fetchGroups(token: string) {
    const res = await fetch(CHAT_GROUP_URL, {
        headers: { Authorization: `Bearer ${token}` },
        next: {
            revalidate: 60 * 60,
            tags: ["chat"]
        }
    });

    if (!res.ok) {
        throw new Error("failed to fetch data");
    }

    const response = await res.json();

    return Array.isArray(response) ? response : [];
}
