import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({ username, password });
      localStorage.setItem('token', response.access);
      navigate('/');
    } catch (error) {
      setError('Credenciales inválidas');
    }

    console.log('Intentando login con:', { username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        {/* Título del sistema */}
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-2">
          Condominio Santa Cruz
        </h1>

        {/* Subtítulo */}
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Campo de usuario */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="usuario123"
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="********"
            required
          />
        </div>

        {/* Botón de login */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Iniciar Sesión
        </button>

        {/* Olvidó su contraseña */}
        <div className="text-center mt-4">
          <a
            href="#"
            className="text-sm text-sky-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              alert('Funcionalidad de recuperación aún no implementada.');
            }}
          >
            ¿Olvidó su contraseña?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
