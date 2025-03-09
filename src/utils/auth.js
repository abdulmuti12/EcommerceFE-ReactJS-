export const checkAuth = () => {
  const token = localStorage.getItem("token");
  return Boolean(token); // Langsung return true/false
};

// export const checkAuth = () => {
//   return !!localStorage.getItem("token");
// };

export const getToken = () => {
  return localStorage.getItem("token");
};


export const logout = () => {
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  window.location.reload();
};
