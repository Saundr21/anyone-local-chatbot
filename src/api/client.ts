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

export { getChatCompletion };