"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CHAT_GROUP_URL } from "@/src/lib/api-endpoint";
import { useSessionStore } from "@/app/zustand/atoms/zustand";
import { ChatGroupType } from "@/src/types/ChatTypes";

type Group = {
  id: string;
  title: string;
  createdAt: string;
};

export default function GroupListPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const { session } = useSessionStore();
  const token = session.user.token;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get<ChatGroupType[]>(CHAT_GROUP_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }); 
        setGroups(res.data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-6 mt-[80px]">
      <h1 className="text-2xl text-white mb-4 font-semibold">All Chat Groups</h1>
      <div className="grid grid-cols-1 gap-4">
        {groups.map((group) => (
          <Link href={`/groups/${group.id}`} key={group.id}>
            <div className="bg-[#1f1f1f] p-4 rounded shadow text-white cursor-pointer hover:bg-[#2a2a2a] transition">
              <h2 className="text-xl font-medium">{group.title}</h2>
              <p className="text-sm text-gray-400">Created: {new Date(group.createdAt).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
