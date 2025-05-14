"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export type GroupDetail = {
  id: string;
  title: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function GroupDetailPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<GroupDetail | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get<GroupDetail>(`http://localhost:8080/api/group/${id}`);
        setGroup(res.data);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  if (!group) {
    return <div className="p-6 mt-[80px] text-white">Loading group...</div>;
  }

  return (
    <div className="p-6 mt-[80px] text-white">
      <h1 className="text-2xl font-semibold">{group.title}</h1>
      <p className="text-sm text-gray-400">Created At: {new Date(group.createdAt).toLocaleString()}</p>
      <p className="mt-2">Created by: {group.user?.name} ({group.user?.email})</p>
    </div>
  );
}
