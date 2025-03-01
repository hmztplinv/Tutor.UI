// src/components/ConversationsList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ConversationsList({ userId, onSelectConversation }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    api.get(`/api/messages/conversations?userId=${userId}`)
      .then(res => setConversations(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div>
      <h4>Conversations</h4>
      {conversations.map(conv => (
        <div 
          key={conv.conversationId}
          onClick={() => onSelectConversation(conv.conversationId)}
          style={{ cursor: 'pointer', marginBottom: '5px', padding: '4px' }}
        >
          <strong>{conv.title || `Conversation #${conv.conversationId}`}</strong>
          {/* <br />
          <small>Last updated: {new Date(conv.lastMessageTime).toLocaleString()}</small> */}
        </div>
      ))}
    </div>
  );
}

export default ConversationsList;
