// auth.js

const API_URL = "http://localhost:8000/api";

//
// 🔹 Iniciar sesión
//
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Error en login");
  }

  const data = await response.json();

  // Guardar token + usuario en localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("roles", JSON.stringify(data.roles || []));
  }

  return data;
};

//
// 🔹 Cerrar sesión
//
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("roles");
};

//
// 🔹 Obtener token
//
export const getToken = () => {
  return localStorage.getItem("token");
};

//
// 🔹 Obtener usuario actual
//
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

//
// 🔹 Obtener roles actuales
//
export const getUserRoles = () => {
  const roles = localStorage.getItem("roles");
  return roles ? JSON.parse(roles) : [];
};
