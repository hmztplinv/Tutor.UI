// src/App.js
import React, { useState, useEffect } from 'react';
import api from './services/api';
import ConversationsList from './components/ConversationsList';

function App() {
  const userId = 1; // Örnek kullanıcı

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Inputlar
  const [title, setTitle] = useState('');      // Yeni konuşma başlığı
  const [inputText, setInputText] = useState(''); // Mesaj

  // localStorage: conversationId
  useEffect(() => {
    const storedConvId = localStorage.getItem('conversationId');
    if (storedConvId) {
      setConversationId(parseInt(storedConvId));
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('conversationId', conversationId.toString());
    } else {
      localStorage.removeItem('conversationId');
    }
  }, [conversationId]);

  // conversationId değişince mesajları çek
  useEffect(() => {
    if (conversationId) {
      api.get(`/api/messages?conversationId=${conversationId}`)
        .then(res => setMessages(res.data))
        .catch(err => console.error(err));
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Mesaj gönder
  const sendMessage = () => {
    if (!inputText.trim()) return;

    const body = {
      userId,
      conversationId, // null ise yeni ID üretilecek
      title: (conversationId === null) ? title : null, 
      message: inputText
    };

    api.post('/api/messages', body)
      .then(res => {
        const { conversationId: convId, id, message, response } = res.data;
        
        if (!conversationId) {
          setConversationId(convId);
        }

        setMessages(prev => [
          ...prev,
          {
            id,
            userId,
            conversationId: convId,
            message,
            response,
            createdAt: new Date().toISOString()
          }
        ]);

        // Temizle
        setInputText('');
      })
      .catch(err => console.error(err));
  };

  // Yeni konuşma başlat
  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setTitle(''); // Başlık inputunu da temizle
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* SOL KISIM */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '8px' }}>
        <h3>Conversations</h3>
        <button onClick={startNewConversation}>New Conversation</button>
        
        <div style={{ marginTop: '8px' }}>
          <label>Title for new chat:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Daily English Practice"
            style={{ width: '100%', marginTop: '4px' }}
          />
        </div>

        <ConversationsList
          userId={userId}
          onSelectConversation={(convId) => {
            setConversationId(convId);
          }}
        />
      </div>

      {/* SAĞ KISIM */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px' }}>
        <h2>Chat with LLM</h2>

        {/* Mesaj Alanı */}
        <div style={{ border: '1px solid #ccc', flex: 1, overflowY: 'auto', marginBottom: '8px', padding: '8px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ marginBottom: '16px' }}>
              
              {/* Kullanıcı Mesajı (solda) */}
              <div style={{ textAlign: 'left', background: '#e1f5fe', padding: '6px', borderRadius: '6px', maxWidth: '60%' }}>
                <strong>User:</strong> {m.message}
              </div>

              {/* Asistan Cevabı (sağda) */}
              {m.response && (
                <div style={{ textAlign: 'right', padding: '6px', borderRadius: '3px', maxWidth: '60%', float: 'right' }}>
                  <strong>Assistant:</strong> {m.response}
                </div>
              )}
              <div style={{ clear: 'both' }}></div>
            </div>
          ))}
        </div>

        {/* Input + Gönder */}
        <div style={{ display: 'flex' }}>
          <input
            style={{ flex: 1, marginRight: '8px' }}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
