require("dotenv").config({ quiet: true });
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const apiRoutes = require("./routes/index.routes");
const openapi = require("./docs/openapi");
const { routeNotFound, handleErrors } = require("./middlewares/errors");

const PORT = process.env.PORT;
const api = express();

api.use(express.json());

api.use("/api", apiRoutes);
api.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: "GameZone API" }));
api.get("/", (req, res) => res.redirect("/api-docs"));

api.use(routeNotFound);
api.use(handleErrors);

api.listen(PORT, ()=>{
    console.log(`Server running in http://localhost:${PORT}`);
    console.log(`API docs in http://localhost:${PORT}/api-docs`);
});
