const http = require('http');
const app = require('./src/app');
const db = require('./src/config/db');
const {initWebSocket} = require('./src/config/websocket');
const verifyGoogleToken = require('./src/utils/googleAuth');

const server = http.createServer(app);
initWebSocket(server, verifyGoogleToken);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
