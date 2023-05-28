const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require('cors');



const dev = process.env.NODE_ENV !== "production"; // if not in production, then in development
const app = next({ dev });
const handle = app.getRequestHandler();


// https://nextjs.org/docs/advanced-features/custom-server
app.prepare().then(() => {
    const server = express();
    server.use(cors());
    // apply a proxy when in dev mode
    if (dev) {
        server.use("/api", createProxyMiddleware({
            target: "http://localhost:8000",
            changeOrigin: true,
        }));
    }

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:8000");
    });
})
.catch(err => {
    console.log("Error", err);
});
