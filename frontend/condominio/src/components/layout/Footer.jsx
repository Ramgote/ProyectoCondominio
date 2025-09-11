import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center text-sm">
      <p> {new Date().getFullYear()} Condominio Santa Cruz. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;