# AI Customer Support Assistant

## Project Overview
An AI-powered customer support backend built using Node.js, Express, Ollama, and Redis.

Customers can:
- Check order status.
- Get answers to frequently asked questions.
- Chat with an AI assistant.
- Escalate issues to human support.
- Retrieve previous conversation history.

## Technology Stack
- Node.js
- Express.js
- JavaScript
- Ollama
- Qwen 2.5 (1.5B)
- Redis
- Swagger
- JSON

## Main Features
1. Order lookup
2. AI-powered customer support
3. FAQ responses
4. Human support escalation
5. Redis conversation history
6. Swagger API documentation

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | Check server |
| GET | /health | Check server and Redis |
| GET | /order/:orderId | Retrieve order |
| GET | /faqs | Retrieve FAQs |
| POST | /chat | Chat with AI |
| POST | /escalate | Create support ticket |
| GET | /tickets | Retrieve tickets |
| GET | /conversations/:sessionId | Retrieve chat history |

## Running the Project

Start Redis:

    sudo systemctl start redis-server

Check Ollama:

    ollama list

Install dependencies:

    npm install

Start the application:

    node server.js

Server address: http://localhost:3000

Swagger documentation: http://localhost:3000/api-docs

## Future Improvements
- Integrate a CRM system.
- Add authentication.
- Store tickets in a database.
- Implement AI tool calling.
- Add automated tests.
- Deploy on AWS.

## Learning Outcomes
This project demonstrates REST APIs, AI integration, prompt engineering, Redis conversation storage, and API documentation.
