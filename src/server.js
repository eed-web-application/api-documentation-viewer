const express = require("express");
const swaggerUi = require("swagger-ui-express");
const axios = require("axios");
const fs = require("fs");

// Load configuration
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const app = express();
const port = 3000;


// Dynamic endpoint to serve OpenAPI JSON
app.get("/api-docs-json/:appName", async (req, res) => {
  const appName = req.params.appName;
  const apiConfig = config.apps.find(api => api.name === appName);
  console.log(`Update document for app: ${appName} with config`)
  if (!apiConfig) {
    res.status(404).send({ message: "API not found" });
    return;
  }

  try {
    const response = await axios.get(apiConfig.uri);
    res.json(response.data);
  } catch (error) {
    console.error(`Failed to fetch OpenAPI document for ${appName}: ${error}`);
    res.status(500).send({ message: "Failed to fetch OpenAPI document" });
  }
});

// Setup Swagger UI for each API with a dynamic OpenAPI JSON URL
config.apps.forEach(api => {
  const options = {
    swaggerOptions: {
      url: `/api-docs-json/${api.name}`,
    }
  };

  app.use(`/api-docs/${api.name}`, swaggerUi.serve, swaggerUi.setup(null, options));
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/config", (req, res) => {
  res.json(config.apps);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
