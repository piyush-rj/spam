"use client"
import React from 'react';
import { UserItemProps } from '../../../../types/ChatTypes';

const UserItem: React.FC<UserItemProps> = ({ user, isCurrentUser }) => {
  return (
    <li className={`p-2 rounded ${isCurrentUser ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-sm font-bold">{user.userName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium">
            {user.userName} {isCurrentUser && <span className="text-xs font-normal text-gray-400">(You)</span>}
          </p>
          {user.joinedAt && (
            <p className="text-xs text-gray-400">
              Joined {new Date(user.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </li>
  );
};

export default UserItem;