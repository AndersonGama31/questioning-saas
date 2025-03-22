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
    const existingQuestions = questions.questions.filter(question => question.level === level);
    if (existingQuestions.length >= count) {
      const selectedQuestions = existingQuestions.slice(0, count);
      return NextResponse.json({ questions: selectedQuestions });
    }
    const remainingCount = count - existingQuestions.length;
    const response = await generateQuestions(level, remainingCount);
    const data = JSON.parse(response);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao gerar perguntas:', error);
    return NextResponse.json({ error: 'Falha ao gerar perguntas' }, { status: 500 });
  }
}
