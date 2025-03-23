'use client';

import { useState, useEffect, useRef } from 'react';

import LevelSelector from '@/components/level-selector';
import QuizCard from '@/components/quiz-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IQuestion } from '@/interfaces';

export default function Quiz() {
  const [level, setLevel] = useState<string | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [count, setCount] = useState('6');

  useEffect(() => {
    if (!level) return;

    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ level, count: Number(count) })
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar questões');
        }

        const data = await response.json();

        if (!data.questions || data.questions.length === 0) {
          throw new Error('Nenhuma questão recebida');
        }

        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [level]);

  const handleLevelSelect = (selectedLevel: string) => {
    setLevel(selectedLevel);
    setQuestions([]);
    setScore(0);
    setQuizComplete(false);
    setAnsweredQuestions([]);
  };

  const handleAnswer = (questionIndex: number, isCorrect: boolean) => {
    if (answeredQuestions.includes(questionIndex)) return;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, questionIndex]);

    setTimeout(() => {
      const nextQuestion = questionRefs.current[questionIndex + 1];
      if (nextQuestion) {
        nextQuestion.scrollIntoView({ behavior: 'smooth' });
      } else {
        setQuizComplete(true);
      }
    }, 500);
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setQuizComplete(false);
    setLevel(null);
    setAnsweredQuestions([]);
  };

  if (!level) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Quiz de Inglês</h1>
        <div className="flex justify-center">
          <Select onValueChange={value => setCount(value)} defaultValue="5">
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Quantas perguntas?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 perguntas</SelectItem>
              <SelectItem value="10">10 perguntas</SelectItem>
              <SelectItem value="15">15 perguntas</SelectItem>
              <SelectItem value="20">20 perguntas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <LevelSelector onSelectLevel={handleLevelSelect} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Carregando perguntas...</h1>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Erro!</h1>
        <p className="mb-4">{error}</p>
        <button
          onClick={handleRestartQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Quiz Completo!</h1>
        <p className="text-xl mb-6">
          Sua pontuação: <span className="font-bold">{score}</span> de {questions.length}
        </p>
        <p className="mb-6">
          {score === questions.length
            ? 'Excelente! Você acertou todas as perguntas!'
            : score > questions.length / 2
              ? 'Bom trabalho! Continue praticando.'
              : 'Continue praticando para melhorar seu nível de inglês.'}
        </p>
        <button
          onClick={handleRestartQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Tentar outro nível
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nível {level?.toUpperCase()}</h1>
        <div className="text-lg">
          Respondidas: {answeredQuestions.length} de {questions.length}
        </div>
      </div>

      <div className="mb-6 bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div
            key={question.id}
            ref={el => {
              questionRefs.current[index] = el;
            }}
            className="scroll-mt-8"
          >
            <QuizCard question={question} onAnswer={isCorrect => handleAnswer(index, isCorrect)} />
          </div>
        ))}
      </div>

      {quizComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
          <div className="container mx-auto text-center">
            <p className="text-xl mb-4">
              Pontuação final: <span className="font-bold">{score}</span> de {questions.length}
            </p>
            <button
              onClick={handleRestartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Tentar outro nível
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
