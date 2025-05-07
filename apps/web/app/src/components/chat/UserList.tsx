"use client";
import React from 'react';
import { User as UserIcon, X } from 'lucide-react';
import { User } from '../../../../types/WebSocketTypes';

interface UsersListProps {
  users: User[];
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}


export const UsersList: React.FC<UsersListProps> = ({
  users,
  currentUserId,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  console.log("UsersList users:", users);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 md:items-end md:justify-end">
      <div className="bg-gray-800 w-full max-w-sm md:mr-4 md:mb-4 md:h-2/3 md:rounded-lg overflow-hidden shadow-lg flex flex-col">
        <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-200">Online Users ({users.length})</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-sm">No users online</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {users.map((user) => (
                <li 
                  key={user.userId} 
                  className={`px-4 py-2 rounded ${user.userId === currentUserId ? 'bg-indigo-900/30' : 'hover:bg-gray-700'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-700 p-2 rounded-full mr-3">
                      <UserIcon size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-200">
                        {user.userName} {user.userId === currentUserId && <span className="text-xs text-gray-400">(you)</span>}
                      </div>
                      <div className="text-xs text-gray-400">ID: {user.userId.substring(0, 8)}...</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
