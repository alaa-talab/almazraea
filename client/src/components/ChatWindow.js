import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatWindow = ({ user, onClose }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${user.userId}/chats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, [user.userId]);

  const openChat = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:5000/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setActiveChat(response.data);
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    try {
      const response = await axios.post(`http://localhost:5000/chat/${activeChat._id}/message`, { text: message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setActiveChat(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-1/3 h-1/2 bg-white shadow-lg rounded-t-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl">الدردشة</h2>
        <button onClick={onClose} className="text-red-500">إغلاق</button>
      </div>
      <div className="flex h-full">
        <div className="w-1/3 border-r overflow-y-auto">
          {chats.map(chat => (
            <div key={chat._id} className="p-4 cursor-pointer" onClick={() => openChat(chat._id)}>
              <img src={chat.participants.find(p => p._id !== user.userId).profilePicture || 'path_to_default_profile_picture'} alt="Profile" className="h-8 w-8 rounded-full" />
              <p>{chat.participants.find(p => p._id !== user.userId).username}</p>
            </div>
          ))}
        </div>
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {activeChat && activeChat.messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded ${msg.sender._id === user.userId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <img src={msg.sender.profilePicture || 'path_to_default_profile_picture'} alt="Profile" className="h-6 w-6 rounded-full inline-block" />
                <p className="inline-block ml-2">{msg.text}</p>
              </div>
            ))}
          </div>
          {activeChat && (
            <form onSubmit={sendMessage} className="p-4 border-t">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="اكتب رسالة..."
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">إرسال</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
