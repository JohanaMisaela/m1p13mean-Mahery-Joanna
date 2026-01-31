import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerSetup = (app) => {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Mall API",
                version: "1.0.0",
            },
            servers: [
                { url: "http://localhost:5000", description: "Local server" },
                { url: 'https://ecommerce-back-node-express-mongo.onrender.com', description: 'Render server' }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
        },
        apis: ["./modules/**/*.js"], // tous tes fichiers routes avec Swagger
    };

    const specs = swaggerJsdoc(options);
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
