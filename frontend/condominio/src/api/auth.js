// auth.js

// FUTURO: Requiere backend con endpoint POST /api/login/

export const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:8000/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Error en login');
  }

  return await response.json(); // Debería retornar el token u objeto del usuario
};
