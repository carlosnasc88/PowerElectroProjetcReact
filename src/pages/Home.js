import React from 'react';
import Menu from '../components/Menu';

function Home() {
  return (
    <div
      className="home-container"
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Menu />
    </div>
  );
}

export default Home;
