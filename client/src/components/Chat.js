import React, { useCallback, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const Chat = ({ user, chatRoom }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user && chatRoom) {
      const pusher = new Pusher('a098b5fa1f9da52f9bf0', {
        cluster: 'us3',
      });

      const channel = pusher.subscribe('chat');
      channel.bind('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        pusher.unsubscribe('chat');
      };
    }
  }, [user, chatRoom]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/chat/${chatRoom}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [chatRoom]);

  useEffect(() => {
    if (chatRoom) {
      fetchMessages();
    }
  }, [chatRoom, fetchMessages]);

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
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === user.userId ? 'own' : ''}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
        />
        <button type="submit">إرسال</button>
      </form>
    </div>
  );
};

export default Chat;
