"use client"
type Props = {
    status: string;
    rooms: string[];
  };
  
  export default function UserStatus({ status, rooms }: Props) {
    const statusColor = {
      connected: 'text-green-400',
      connecting: 'text-yellow-400',
      error: 'text-red-500',
      disconnected: 'text-gray-400',
    }[status] || 'text-gray-400';
  
    return (
      <div className="text-sm mb-4">
        <span>Status: <span className={statusColor}>{status}</span></span>
        {rooms.length > 0 && (
          <span className="ml-4">Subscribed Rooms: {rooms.join(', ')}</span>
        )}
      </div>
    );
  }
  