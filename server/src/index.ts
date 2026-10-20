import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./config/config.js";
import webhookRoutes from "./routes/webhook.routes.js";
import searchRoutes from "./routes/search.route.js";
import chatRoutes from "./routes/chat.routes.js";
import listingRoutes from "./routes/listing.routes.js";


// init express app
const app = express();

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy and running smoothly.",
    timeStamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to the Wesh API! Please refer to the documentation for available endpoints.",
  });
});
// routes
app.use("/api/webhooks", webhookRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/listings", listingRoutes)

// fallback route for handling unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(
    `Health check available at http://localhost:${config.port}/api/health`,
  );
});
