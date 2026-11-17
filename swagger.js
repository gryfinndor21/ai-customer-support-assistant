const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AI Customer Support API",
            version: "1.0.0",
            description: "API documentation for the AI Customer Support project"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ],
        paths: {
            "/": {
                get: {
                    summary: "Check API server",
                    responses: {
                        200: { description: "Server is running" }
                    }
                }
            },
            "/health": {
                get: {
                    summary: "Check server and Redis health",
                    responses: {
                        200: { description: "Health status returned" }
                    }
                }
            },
            "/order/{orderId}": {
                get: {
                    summary: "Get order details",
                    parameters: [{
                        name: "orderId",
                        in: "path",
                        required: true,
                        schema: { type: "string" }
                    }],
                    responses: {
                        200: { description: "Order found" },
                        404: { description: "Order not found" }
                    }
                }
            },
            "/faqs": {
                get: {
                    summary: "Get frequently asked questions",
                    responses: {
                        200: { description: "FAQs returned" }
                    }
                }
            },
            "/chat": {
                post: {
                    summary: "Send a message to the AI assistant",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["message", "sessionId"],
                                    properties: {
                                        message: { type: "string" },
                                        sessionId: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: "AI response returned" },
                        400: { description: "Missing required fields" }
                    }
                }
            },
            "/escalate": {
                post: {
                    summary: "Escalate an issue to human support",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["issue"],
                                    properties: {
                                        customerName: { type: "string" },
                                        orderId: { type: "string" },
                                        issue: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: "Ticket created" },
                        400: { description: "Issue is required" }
                    }
                }
            },
            "/tickets": {
                get: {
                    summary: "Get all support tickets",
                    responses: {
                        200: { description: "Tickets returned" }
                    }
                }
            },
            "/conversations/{sessionId}": {
                get: {
                    summary: "Get conversation history",
                    parameters: [{
                        name: "sessionId",
                        in: "path",
                        required: true,
                        schema: { type: "string" }
                    }],
                    responses: {
                        200: { description: "Conversation history returned" }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};