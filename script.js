let stompClient = null;

function connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    // Creates a new SockJS object that connects to the WebSocket endpoint at http://localhost:8080/ws

    stompClient = Stomp.over(socket);
    // Creates a STOMP client by wrapping the SockJS socket.

    /*
    STOMP (Simple Text Oriented Messaging Protocol) is a higher-level protocol that runs over WebSocket. It adds message framing, headers, destinations (like topics/queues), etc
    */
    
    stompClient.connect({}, function(frame) { // Initiates the STOMP connection, function runs when the connection is successfully established
        console.log('Connected: ' + frame); // frame parameter contains the CONNECTED frame from the server (includes session ID, etc.)
        
        stompClient.subscribe('/topic/public', function(message) {
            showMessage(JSON.parse(message.body));
        });
        // Subscribes to the destination /topic/public. The second argument is the callback that will be called every time a message arrives on this destination
        
        stompClient.send("/app/chat.addUser",
            {},
            JSON.stringify({sender: 'User123', type: 'JOIN'})
        );
        // Immediately after connecting, sends a message to the server endpoint /app/chat.addUser with a JSON payload saying that a user named "User123" has joined
    });
}

function sendMessage() {
    const messageContent = document.getElementById('messageInput').value;
    if(messageContent && stompClient) {
        const chatMessage = {
            sender: 'User123',
            content: messageContent,
            type: 'CHAT'
        }; // Creates a JavaScript object with the message data
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        // Sends the message to the server endpoint /app/chat.sendMessage
        document.getElementById('messageInput').value = '';
    }
}

function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p><strong>${message.sender}:</strong> ${message.content}</p>`;
}

// Connect on page load
connect();