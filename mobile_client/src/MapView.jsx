import React from 'react';

const MapView = ({ users, myId }) => {
  return (
    <svg 
      width="100vw" 
      height="100vh" 
      style={{ backgroundColor: '#000000' }}
    >
      {/* Draw all the circuit lines between users */}
      {users.flatMap((user1, i) =>
        users.slice(i + 1).map(user2 => (
          <line
            key={`${user1.id}-${user2.id}`}
            x1={user1.x}
            y1={user1.y}
            x2={user2.x}
            y2={user2.y}
            stroke="#00ff00"
            strokeWidth="1"
          />
        ))
      )}

      {/* Draw all the users (nodes) and their labels */}
      {users.map(user => (
        <g key={user.id}>
          <circle
            cx={user.x}
            cy={user.y}
            r="8"
            fill={user.id === myId ? '#ff4d4d' : '#4d4dff'}
          />
          <text
            x={user.x + 12}
            y={user.y + 4}
            fill="#ffffff"
            fontSize="12px"
            fontFamily="Arial"
          >
            {user.id}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default MapView;
