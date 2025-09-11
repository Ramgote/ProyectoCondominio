import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Condominio Santa Cruz
        </Link>
        <nav>
          <Link to="/" className="hover:underline">
            Inicio
          </Link>
        </nav>
      </div>
    </header>
  );
}
