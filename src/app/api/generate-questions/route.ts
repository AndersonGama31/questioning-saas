import { NextResponse, NextRequest } from 'next/server';

import { generateQuestions } from '@/lib/openai';
import prisma from '@/lib/prisma';

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

    const newQuestionsCount = Math.ceil(count / 2);
    const existingQuestions = await prisma.question.findMany({
      where: { level },
      orderBy: { createdAt: 'desc' }
    });
    const newQuestionsData = await generateQuestions(level, newQuestionsCount);
    const newQuestions = newQuestionsData.questions;
    for (const question of newQuestions) {
      await prisma.question.create({
        data: {
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          level
        }
      });
    }
    const shuffledExisting = shuffleArray(existingQuestions);
    const existingToUse = shuffledExisting.slice(0, count - newQuestionsCount);
    const allQuestions = [...existingToUse, ...newQuestions];
    const finalQuestions = shuffleArray(allQuestions);

    return NextResponse.json({ questions: finalQuestions });
  } catch (error) {
    console.error('Erro ao gerar perguntas:', error);
    return NextResponse.json({ error: 'Falha ao gerar perguntas' }, { status: 500 });
  }
}
