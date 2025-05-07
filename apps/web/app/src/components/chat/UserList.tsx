"use client"
import React from 'react';
import { UserListProps } from '../../../../types/ChatTypes';
import UserItem from './UserItem';

const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-medium">Users in Room</h3>
        <p className="text-xs text-gray-400">{users.length} {users.length === 1 ? 'user' : 'users'}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {users.map(user => (
            <UserItem 
              key={user.userId} 
              user={user} 
              isCurrentUser={user.userId === currentUserId} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;