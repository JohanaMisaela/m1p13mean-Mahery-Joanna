import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Centre Commercial MEAN",
            version: "1.0.0",
            description: "Documentation des API pour le projet Master 1 – Promotion 13",
        },
        servers: [
            { url: "http://localhost:5000", description: "Serveur local" },
        ],
    },
    apis: ["./modules/**/*.js"],
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app) => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
