import React, { useState } from 'react';
import './chat.css';       
import api from '../services/api';

function Chat() {
  const [userId, setUserId] = useState(1); // Sabit veya login'den alabilirsiniz
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // 1) Önce kendi mesajınızı state'e ekleyin
    const newUserMessage = {
      id: Date.now(), // geçici id
      userId: userId,
      message: inputText,
      response: null,
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // 2) API'ye gönderin
      const body = {
        userId: userId,
        message: inputText
      };
      const res = await api.post('/api/messages', body);
      // res.data içinde userMessage.Id, Message, Response döner

      // 3) Gelen asistan yanıtını, state içindeki son mesaja ekleyin
      const updatedMessage = {
        ...newUserMessage,
        id: res.data.id,
        response: res.data.response
      };
      setMessages(prev => {
        // Son eklediğimiz mesajın response'unu güncelleyelim
        // Basit yöntem: prev array'i kopyala, son elemana response ekle
        const copy = [...prev];
        copy[copy.length - 1] = updatedMessage;
        return copy;
      });
    } catch (error) {
      console.error('Mesaj gönderirken hata:', error);
    } finally {
      setInputText('');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Chat with TutorAI</h2>

      {/* Mesajları listede göster */}
      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '8px' }}>
            <strong>User:</strong> {msg.message} <br/>
            {msg.response && (
              <>
                <strong>Assistant:</strong> {msg.response}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Input + Gönder Butonu */}
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
