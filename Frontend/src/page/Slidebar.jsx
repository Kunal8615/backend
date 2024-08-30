import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={{ width: '200px', background: '#000', color: '#fff', height: '100vh', padding: '20px',  top: 0, left: 0 }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          </li>
          <li>
            <Link to="/twitter" style={{ color: '#fff', textDecoration: 'none' }}>Twitter</Link>
          </li>
          <li>
            <Link to="/yourchannel" style={{ color: '#fff', textDecoration: 'none' }}>Your channel</Link>
          </li>
          <li>
            <Link to="/history" style={{ color: '#fff', textDecoration: 'none' }}>History</Link>
          </li>
          <li>
            <Link to="/playlist" style={{ color: '#fff', textDecoration: 'none' }}>Playlist</Link>
          </li>
          <li>
            <Link to="/liked-videos" style={{ color: '#fff', textDecoration: 'none' }}>Liked Videos</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
