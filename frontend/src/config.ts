const config = {
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  VATSIM_API_URL: import.meta.env.VITE_VATSIM_API_URL,
  VATSIM_REDIRECT: import.meta.env.VITE_VATSIM_REDIRECT,
  PUBLIC_API_URL: import.meta.env.VITE_PUBLIC_API_URL,
  defaultSectorIds: ["CDC", "GRC", "ADC", "TRE/L", "EL"],
};

export default config;
