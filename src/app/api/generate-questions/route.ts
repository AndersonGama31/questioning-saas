// import { NextResponse, NextRequest } from 'next/server';

// import { generateQuestions } from '@/lib/openai';

// export async function POST(request: NextRequest) {
//   try {
//     const { level, count } = await request.json();

//     if (!level || !['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(level)) {
//       return NextResponse.json({ error: 'Nível inválido' }, { status: 400 });
//     }

//     const data = await generateQuestions(level, count || 5);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Erro ao gerar perguntas:', error);
//     return NextResponse.json({ error: 'Falha ao gerar perguntas' }, { status: 500 });
//   }
// }

import { NextResponse, NextRequest } from 'next/server';

import questions from '@/data/questions.json';
import { generateQuestions } from '@/lib/openai';

// Função para remover duplicatas baseada no texto da questão
function removeDuplicates(questions: any[]) {
  const seen = new Set();
  return questions.filter(question => {
    const duplicate = seen.has(question.text);
    seen.add(question.text);
    return !duplicate;
  });
}

// Função de embaralhamento Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request: NextRequest) {
  try {
    const { level, count } = await request.json();

    if (!level || !count) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const validLevels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
    if (!validLevels.includes(level)) {
      return NextResponse.json({ error: 'Nível inválido' }, { status: 400 });
    }

    // Filtra questões existentes pelo nível
    const existingQuestions = questions.questions.filter(question => question.level === level);

    if (existingQuestions.length >= count) {
      // Se tiver questões suficientes, apenas embaralha e seleciona
      const shuffledQuestions = shuffleArray(existingQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, count);
      return NextResponse.json({ questions: selectedQuestions });
    }

    // Gera questões adicionais se necessário
    const remainingCount = count - existingQuestions.length;
    const response = await generateQuestions(level, remainingCount);
    const newQuestions = JSON.parse(response);

    // Combina questões existentes com novas, remove duplicatas e embaralha
    const combinedQuestions = [...existingQuestions, ...newQuestions.questions];
    const uniqueQuestions = removeDuplicates(combinedQuestions);
    const finalQuestions = shuffleArray(uniqueQuestions).slice(0, count);

    return NextResponse.json({ questions: finalQuestions });
  } catch (error) {
    console.error('Erro ao gerar perguntas:', error);
    return NextResponse.json({ error: 'Falha ao gerar perguntas' }, { status: 500 });
  }
}
