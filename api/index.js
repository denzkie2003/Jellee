import { Hono } from "hono";
import http from "http";
import novelfireRoutes from "../src/routes/novelfire.js"; // Adjust path if needed

const app = new Hono();

// Use the novelfire routes
app.route("/api/v1/novelfire", novelfireRoutes);

app.get("/", (c) => {
  return c.text("Welcome to the JelLee API – Get access to data from various novel websites!");
});

app.all('*', (c) => {
  console.log(`Request received: ${c.req.method} ${c.req.url}`);
  return c.json({ success: false, message: "404 Not Found" }, 404);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Create an HTTP server and pass requests to `app.fetch`
const server = http.createServer(async (req, res) => {
  const fullUrl = `http://${req.headers.host}${req.url}`;
  
  const request = new Request(fullUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? null : req,
  });

  const response = await app.fetch(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
});

// Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});