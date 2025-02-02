/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Fehler in striktem Modus vermeiden
  swcMinify: false,       // Probleme mit Minification verhindern
  compiler: {
    reactRemoveProperties: true,
    removeConsole: true,  // Entfernt alle Konsolenlogs in der Production-Version
  },
};

module.exports = nextConfig;
