const express = require("express");
const swaggerUi = require("swagger-ui-express");
const axios = require("axios");
const fs = require("fs");

// Load configuration
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const app = express();
const port = 3000;

// Function to dynamically fetch and serve OpenAPI documentation
const serveApiDocs = async (app, config) => {
  for (const api of config.apps) {
    try {
      // Fetch the OpenAPI document from the remote URI
      const response = await axios.get(api.uri);
      const openapiDocument = response.data;

      // Serve the OpenAPI document using Swagger UI
      app.use(
        `/api-docs/${api.name}`,
        swaggerUi.serve,
        swaggerUi.setup(openapiDocument)
      );
    } catch (error) {
      console.error(
        `Failed to load OpenAPI document for ${api.name}: ${error}`
      );
    }
  }
};

// Call the function and pass in the Express app and config
serveApiDocs(app, config).then(() => {
  console.log("All configured APIs are being served.");
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/config", (req, res) => {
  res.json(config.apps);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
