import React from 'react';


export function Header() {
  return (
    <header style={{ padding: '1rem', backgroundColor: '#222', color: '#fff' }}>
      <h1>PowerElectroProject</h1>
    </header>
  );
}

function Home() {
  return (
    <div className="home-container">
      <Header />
      
    </div>
  );
}

export default Home;
