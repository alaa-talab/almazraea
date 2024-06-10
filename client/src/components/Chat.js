import React, { useState, useEffect } from 'react';

const Chat = ({ chatRoom }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Make API request to fetch chat messages
    fetch(`http://localhost:5000/chat/${chatRoom}/messages`)
     .then(response => response.json())
     .then(data => setMessages(data));
  }, [chatRoom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/chat/${chatRoom}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ text: message })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;