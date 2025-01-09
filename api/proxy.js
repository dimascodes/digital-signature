import { createProxyMiddleware } from "http-proxy-middleware";

export default async function handler(req, res) {
  const backendUrl = process.env.BACK;

  if (!backendUrl) {
    res.status(500).json({ error: "Backend URL is not configured!" });
    return;
  }

  const proxy = createProxyMiddleware({
    target: `http://${process.env.BACK}`,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  });

  proxy(req, res, (err) => {
    if (err) {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    }
  });
}
