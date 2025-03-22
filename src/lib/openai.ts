import OpenAI from 'openai';

import { ELevel } from '@/interfaces';

const openai = new OpenAI({
  apiKey: ''
});

export async function generateQuestions(level: ELevel, count = 5) {
  const levelDescriptions = {
    a1: 'Iniciante básico - vocabulário simples e estruturas gramaticais básicas',
    a2: 'Iniciante intermediário - frases simples do cotidiano',
    b1: 'Intermediário - comunicação em situações familiares',
    b2: 'Intermediário avançado - comunicação clara sobre tópicos complexos',
    c1: 'Avançado - comunicação fluente e espontânea',
    c2: 'Proficiente - compreensão e expressão precisa em situações complexas'
  };

  const prompt = `
  Create ${count} English questions at ${level} level (${levelDescriptions[level]}) 
  in a fill-in-the-blank format with multiple choice answers.
  
  Each question must have:
  1. A sentence with a blank marked as "___"
  2. Four options (A, B, C, D)
  3. Only one correct answer
  4. The correct answer identified
  5. A clear and concise grammatical explanation in English for why the answer is correct
  
  Return the data in the following JSON format:
  {
    "questions": [
      {
        "id": "1",
        "text": "I ___ to the store yesterday.",
        "options": [
          {"id": "A", "text": "go"},
          {"id": "B", "text": "went"},
          {"id": "C", "text": "goes"},
          {"id": "D", "text": "going"}
        ],
        "correctAnswer": "B",
        "explanation": "We use 'went' (past simple of 'go') because we're talking about a completed action in the past, indicated by the time marker 'yesterday'."
      }
    ]
  }
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an English teaching expert who creates accurate questions for proficiency level assessment.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' }
  });

  try {
    const content = response.choices[0].message.content;
    if (content) {
      return JSON.parse(content);
    } else {
      throw new Error('Response content is null');
    }
  } catch (error) {
    console.error('Erro ao processar resposta da OpenAI:', error);
    return { questions: [] };
  }
}
