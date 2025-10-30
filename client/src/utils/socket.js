// WebSocket configuration utility
export const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    // Production: use same domain
    return window.location.origin;
  } else {
    // Development: use localhost
    return "http://localhost:5001";
  }
};

export const getSocketConfig = () => {
  return {
    withCredentials: true,
    transports: ["websocket", "polling"],
  };
};
