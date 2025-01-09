import { createProxyMiddleware } from "http-proxy-middleware";

const proxy = createProxyMiddleware({
  target: process.env.BACK, // Menggunakan environment variable
  changeOrigin: true,
  pathRewrite: { "^/api/proxy": "/" }, // Menulis ulang path untuk diteruskan ke backend
});

export default function handler(req, res) {
  return proxy(req, res, (result) => {
    if (result instanceof Error) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Proxy membutuhkan body parser dinonaktifkan
  },
};
