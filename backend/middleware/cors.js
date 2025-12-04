// middleware/cors.js
const allowedOrigins = [
  "https://o-barbeirao-z8nt.vercel.app", // Admin
  "https://o-barbeirao.vercel.app",      // Produção
  "https://www.barbeirao.com",           // Domínio oficial
  "https://barbeirao.com",               // Domínio oficial sem www
  "http://localhost:5173",               // Vite Local
  "http://localhost:3000"                // Local extra
];

module.exports = (req, res, next) => {
  const origin = req.headers.origin;

  // 1. Define a origem se estiver na lista
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Permite pedidos sem origem (mobile apps/postman) se necessário
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  // 2. Define os outros cabeçalhos
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // 3. Responde IMEDIATAMENTE ao Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 4. Continua para a rota real
  next();
};
