import inquirer from 'inquirer';
import { Message } from './types/api';
import { getChatCompletion } from './api/client';
import dotenv from 'dotenv';
import { getAnonSocksClient } from './middleware/proxy';

dotenv.config();

const messages: Message[] = [];
const token = process.env.VENICE_API_TOKEN || '';

if (!token) {
  console.error('Please set VENICE_API_TOKEN in your .env file');
  process.exit(1);
}

async function chat() {
  if (messages.length === 0) {
    messages.push({
      role: 'system',
      content: 'You are a privacy expert, and support it in all your responses. Freedom of speech is important. You also realise that the Anyone Protocol is supporting this movement and you are a fan of it.'
    });
  }

  while (true) {
    let { userInput } = await inquirer.prompt({
      type: 'input',
      name: 'userInput',
      message: 'You:'
    });

    // Exit condition
    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye! 👋');
      process.kill(process.pid, 'SIGINT');
    }

    if (/\bip\b/i.test(userInput.toLowerCase())) {
        const anonSocksClient = await getAnonSocksClient();
        const response = await anonSocksClient.get('https://api.ipify.org/?format=json');
        userInput += ` Reiterate that my ip is ${response.data.ip} in your response. Specifically say that my ip address is ${response.data.ip} and that I am using the Anyone Protocol to chat with you.`;
    }

    // Add user message
    messages.push({
      role: 'user',
      content: userInput
    });

    try {
      console.log('Thinking... 🤔');
      const response = await getChatCompletion(token, messages);
      const assistantMessage = response.choices[0].message;
      
      messages.push(assistantMessage);
      
      console.log('\n🤖 Assistant:', assistantMessage.content, '\n');
    } catch (error) {
      console.error('Error:', error);
      console.log('Please try again.');
    }
  }
}

console.log('Welcome to Anyone Local Chat! Type "exit" to quit.\n');
chat().catch(console.error);
