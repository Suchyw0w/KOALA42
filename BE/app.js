const express = require("express");
const morgan = require("morgan"); // Logs HTTP requests
const helmet = require("helmet"); // Adds security headers to responses
const { specs, swaggerUi } = require("./config/swagger"); // Import swagger documentation

// Import routes
const characterRoutes = require("./routes/characters");

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

// Add security headers to all responses
app.use(helmet());

// API Docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Characters API Documentation'
}));

// Routes
app.use("/api/v1/characters", characterRoutes);

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

module.exports = app;