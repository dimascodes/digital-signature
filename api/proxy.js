import { createProxyMiddleware } from "http-proxy-middleware";

export default async function handler(req, res) {
  const proxy = createProxyMiddleware({
    target: `http://${process.env.BACK}`,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/api",
    },
  });

  proxy(req, res, (err) => {
    if (err) {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy error");
    }
  });
}
