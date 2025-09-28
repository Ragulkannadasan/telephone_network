import React, { useState, useEffect, useRef } from 'react';
import { socket } from './socket';
import MapView from './MapView.jsx';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [myId, setMyId] = useState(null);
  const [users, setUsers] = useState([]);
  const myIdRef = useRef(myId);

  // Update ref whenever myId changes
  useEffect(() => {
    myIdRef.current = myId;
  }, [myId]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Connected to server!');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Disconnected from server.');
    }

    function onAssignedID(id) {
      setMyId(id);
      console.log('Assigned ID:', id);
    }

    function onMapState(userList) {
      setUsers(userList);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('assignedID', onAssignedID);
    socket.on('mapState', onMapState);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('assignedID', onAssignedID);
      socket.off('mapState', onMapState);
    };
  }, []);

  const handleInteraction = (event) => {
    const currentId = myIdRef.current;
    if (!currentId) return;

    const touch = event.touches ? event.touches[0] : event;
    const newLocation = { x: touch.clientX, y: touch.clientY };

    // Send location update to the server
    socket.emit('locationUpdate', { id: currentId, ...newLocation });
  };

  return (
    <div 
      className="App" 
      onTouchMove={handleInteraction}
      onMouseMove={handleInteraction} // for testing in a desktop browser
    >
      <MapView users={users} myId={myId} />
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        <p>My ID: {myId || 'N/A'}</p>
        <p>Users Online: {users.length}</p>
      </div>
    </div>
  );
}

export default App;
