const WebSocket = require('ws');

let wss; // Store the WebSocket server instance globally

// Initialize WebSocket server
const initWebSocket = (server, verifyGoogleToken) => {
    wss = new WebSocket.Server({server});

    wss.on('connection', (ws, req) => {
        console.log('New WebSocket connection');

        // Extract token from query parameters
        const url = new URL(req.url, 'ws://localhost');
        const token = url.searchParams.get('token');

        if (token) {
            verifyGoogleToken(token).then((payload) => {
                if (payload) {
                    ws.userId = payload.sub; // Attach user ID to the WebSocket instance
                } else {
                    ws.close(); // Close connection if token verification fails
                }
            });
        }

        // Broadcast received messages to other clients
        ws.on('message', (message) => {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    });

    return wss;
};

// Retrieve the WebSocket server instance
const getWebSocketServer = () => {
    if (!wss) {
        throw new Error('WebSocket server has not been initialized!');
    }
    return wss;
};

module.exports = {initWebSocket, getWebSocketServer};
