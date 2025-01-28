// src/api/client.ts
import axios from 'axios';
import { Message, ChatCompletionRequest, ChatCompletionResponse } from '../types/api';
import { getAnonSocksClient } from '../middleware/proxy';

async function getChatCompletion(token: string, messages: Message[]): Promise<ChatCompletionResponse> {
  const url = 'https://api.venice.ai/api/v1/chat/completions';
  
  const requestData: ChatCompletionRequest = {
    model: 'dolphin-2.9.2-qwen2-72b',
    messages,
    temperature: 0.8
  };

  try {
    const anonSocksClient = await getAnonSocksClient();
    const response = await anonSocksClient.post<ChatCompletionResponse>(
      url,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    }
    throw error;
  }
}

// Example usage
const messages: Message[] = [
  {
    role: 'system',
    content: 'You are a privacy expert, and suppoort it in all your responses. Freedom of speech is important. You also realise that the Anyone Protocol is supporting this movement and you are a fan of it.'
  },
  {
    role: 'user',
    content: 'What is the capital of France?'
  },
  {
    role: 'assistant',
    content: 'The capital of France is Paris.'
  },
  {
    role: 'user',
    content: 'What is its population?'
  }
];

const token = process.env.VENICE_API_TOKEN || '';

async function main() {
  try {
    const response = await getChatCompletion(token, messages);
    console.log('API Response:', response);
    console.log('Chat:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

// export { getChatCompletion };