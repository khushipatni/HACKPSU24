import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Divider, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCommentIcon from '@mui/icons-material/AddComment'; 
import MicIcon from '@mui/icons-material/Mic'; 
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'; 
import Cookies from 'js-cookie';

const Chat = () => {
  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: 'General Inquiry',
      messages: [
        { text: 'Hello! How can I assist you today?', sender: 'bot' },
      ],
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);
  const [inputValue, setInputValue] = useState('');
  const [allMessages, setAllMessages] = useState('');

  // Speech Recognition Hook
  const {
    transcript,
    interimTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    const id = Cookies.get('userId');
    setUserId(id);
    console.log('Fetched userId:', id);
  }, []);

  useEffect(() => {
    // Update inputValue with the speech recognition transcript
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]); 

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      // Log the speech recognition result
      console.log('Sending message:', inputValue);

      // Update conversation with user's message
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.id === activeConversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, { text: inputValue, sender: 'user' }],
              }
            : conversation
        )
      );

      const requestBody = { query: inputValue, id: userId, allMessages: allMessages };

      // Clear the input field
      setInputValue('');

      try {
        const request = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        };

        const response = await fetch('http://localhost:5001/api/chat', request);
        const data = await response.json();

        if (response.ok) {
          // Update conversation with bot's response
          console.log(allMessages + data.prev)
          setAllMessages(allMessages + data.prev)
          setConversations((prevConversations) =>
            prevConversations.map((conversation) =>
              conversation.id === activeConversationId
                ? {
                    ...conversation,
                    messages: [...conversation.messages, { text: data.response, sender: 'bot' }],
                  }
                : conversation
            )
          );
        } else {
          console.error('Error in response:', data);
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
  };

  const handleNewConversation = () => {
    const newConversationId = conversations.length + 1; 
    const newConversation = {
      id: newConversationId,
      title: `New Conversation ${newConversationId}`, 
      messages: [],
    };

    setConversations([...conversations, newConversation]);
    setActiveConversationId(newConversationId);
  };

  const activeConversation = conversations.find((conv) => conv.id === activeConversationId);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleListen = () => {
    SpeechRecognition.startListening();
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setInputValue(transcript); // Set the input field to the result after stopping
  };

  return (
    <Box sx={{ width: '100vw', height: '90vh', bgcolor: '#fffcfc', display: 'flex' }}>
      <Box sx={{ width: '20%', bgcolor: 'black', color: 'white', padding: 2, borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Conversations</Typography>
          <IconButton onClick={handleNewConversation} sx={{ color: 'white' }}>
            <AddCommentIcon />
          </IconButton>
        </Box>

        {conversations.map((conversation) => (
          <React.Fragment key={conversation.id}>
            <Typography
              onClick={() => setActiveConversationId(conversation.id)}
              sx={{
                padding: 1,
                borderRadius: 1,
                bgcolor: activeConversationId === conversation.id ? '#333' : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#555' },
              }}
            >
              {conversation.title}
            </Typography>
            <Divider sx={{ my: 1, backgroundColor: 'white' }} />
          </React.Fragment>
        ))}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3, bgcolor: '#f8f9fa' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
          {activeConversation?.messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: '75%',
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                bgcolor: message.sender === 'user' ? '#dbeafe' : '#fff',
                borderRadius: '20px',
                boxShadow: 2,
                padding: 1,
              }}
            >
              <Typography sx={{ color: 'black' }}>{message.text}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              '& fieldset': { borderRadius: '20px' },
            }}
          />
          {/* Microphone button to the right of the input field */}
          <Button
            variant="secondary"
            onMouseDown={handleListen}
            onMouseUp={handleStopListening}
            sx={{
              minWidth: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: listening ? 'secondary.main' : '#949494',
              color: 'white',
            }}
          >
            <MicIcon />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSendMessage}
            sx={{
              bgcolor: '#949494',
              minWidth: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
