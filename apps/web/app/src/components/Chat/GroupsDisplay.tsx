'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSessionStore } from '@/app/zustand/atoms/zustand';

type Group = {
  id: string;
  title: string;
  passcode: string;
  image?: string;
  createdAt: string;
  user: {
    name?: string;
    email: string;
    isAdmin: boolean;
  };
};

export default function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const { session } = useSessionStore()

  const paramsId = session.user.id 

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get<Group>(`http://localhost:8080/api/group/${paramsId}`);
        setGroup(res.data);
      } catch (err) {
        console.error('Error fetching group:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <div className="p-4 bg-zinc-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{group.title}</h1>
      <p className="mb-1">Passcode: {group.passcode}</p>
      <p className="mb-1">Created At: {new Date(group.createdAt).toLocaleString()}</p>
      <p className="mb-1">Created By: {group.user.name || group.user.email}</p>
      <p className="mb-1">
        Is Admin: <strong>{group.user.isAdmin ? '✅ Yes' : '❌ No'}</strong>
      </p>
      {group.image && <img src={group.image} alt="Group" className="mt-4 w-48 rounded" />}
    </div>
  );
}
