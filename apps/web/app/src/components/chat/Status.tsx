"use client";
import React from 'react';

interface StatusBadgeProps {
  connected: boolean;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  connected, 
  label, 
  className = "" 
}) => {
  return (
    <div className={`bg-gray-700 px-3 py-1 rounded-full flex items-center ${className}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-sm">{label || (connected ? 'Connected' : 'Disconnected')}</span>
    </div>
  );
};