// // src/components/MenuHamburguer.jsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';


// const MenuHamburguer = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
//         <span className="bar"></span>
//         <span className="bar"></span>
//         <span className="bar"></span>
//       </div>

//       <nav className={`menu ${isOpen ? 'open' : ''}`}>
//         <ul>
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/sobre">Sobre</Link></li>
//           <li><Link to="/inquilino">Cadastro Inquilino</Link></li>
//           <li><Link to="/casa">Cadastro Casa</Link></li>
//           <li><Link to="/ativos">Consulta Apartamentos</Link></li>
//         </ul>
//       </nav>
//     </>
//   );
// };

// export default MenuHamburguer;
