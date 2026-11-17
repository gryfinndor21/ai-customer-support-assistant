const express = require("express");
const fs = require("fs");
const path = require("path");
const { createClient } = require("redis");
const { askAI } = require("./services/aiService");
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Load business data
const orders = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "orders.json"), "utf8")
);

const faqs = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "faqs.json"), "utf8")
);

// Redis setup
const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on("error", (error) => {
    console.error("Redis Error:", error.message);
});

// Temporary ticket storage
const tickets = [];

// Home route
app.get("/", (req, res) => {
    res.send("AI Customer Support API is running!");
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        redis: redisClient.isReady ? "Connected" : "Disconnected"
    });
});

// Get order details
app.get("/order/:orderId", (req, res) => {
    const order = orders.find(
        (item) => item.orderId === req.params.orderId
    );

    if (!order) {
        return res.status(404).json({
            error: "Order not found"
        });
    }

    res.json(order);
});

// Get FAQs
app.get("/faqs", (req, res) => {
    res.json(faqs);
});

// AI customer support chat
app.post("/chat", async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({
                error: "Message and sessionId are required"
            });
        }

        const redisKey = `conversation:${sessionId}`;

        const savedHistory = await redisClient.get(redisKey);
        const conversation = savedHistory
            ? JSON.parse(savedHistory)
            : [];

        let context = "";

        const orderIdMatch = message.match(/ORD\d+/i);

        if (orderIdMatch) {
            const order = orders.find(
                (item) =>
                    item.orderId.toLowerCase() ===
                    orderIdMatch[0].toLowerCase()
            );

            context = order
                ? JSON.stringify(order)
                : "Order not found in the system.";
        } else {
            context = JSON.stringify(faqs);
        }

        const previousConversation = conversation
            .map((item) => `${item.role}: ${item.content}`)
            .join("\n");

        const fullContext = `
Business Information:
${context}

Previous Conversation:
${previousConversation}
`;

        const reply = await askAI(message, fullContext);

        conversation.push(
            { role: "user", content: message },
            { role: "assistant", content: reply }
        );

        // Keep only the latest 10 messages
        const recentConversation = conversation.slice(-10);

        // Save conversation for 24 hours
        await redisClient.set(
            redisKey,
            JSON.stringify(recentConversation),
            { EX: 86400 }
        );

        res.json({
            sessionId,
            reply
        });

    } catch (error) {
        console.error("Chat Error:", error.message);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

// Escalate issue to human support
app.post("/escalate", (req, res) => {
    const { customerName, orderId, issue } = req.body;

    if (!issue) {
        return res.status(400).json({
            error: "Issue is required"
        });
    }

    const ticket = {
        ticketId: "TICKET-" + Date.now(),
        customerName: customerName || "Unknown",
        orderId: orderId || "Not provided",
        issue,
        status: "Open",
        createdAt: new Date().toISOString()
    };

    tickets.push(ticket);

    res.status(201).json({
        message: "Issue escalated successfully",
        ticket
    });
});

// Get all support tickets
app.get("/tickets", (req, res) => {
    res.json(tickets);
});

// Get conversation history
app.get("/conversations/:sessionId", async (req, res) => {
    try {
        const redisKey = `conversation:${req.params.sessionId}`;
        const savedHistory = await redisClient.get(redisKey);

        res.json(
            savedHistory ? JSON.parse(savedHistory) : []
        );

    } catch (error) {
        res.status(500).json({
            error: "Could not retrieve conversation"
        });
    }
});

// Start server after Redis connects
async function startServer() {
    try {
        await redisClient.connect();

        console.log("Redis connected successfully!");

        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
            console.log("Swagger docs: http://localhost:3000/api-docs");
        });

    } catch (error) {
        console.error("Could not start server:", error.message);
    }
}

startServer();