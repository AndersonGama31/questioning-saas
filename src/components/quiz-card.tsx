'use client';

import { useEffect, useState } from 'react';

import { IQuestion } from '@/interfaces';

interface IProps {
  question: IQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizCard({ question, onAnswer }: IProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [answered, setAnswered] = useState(false);

  const handleSelectOption = (optionId: string) => {
    if (answered) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || answered) return;

    const isCorrect = selectedOption === question.correctAnswer;
    setAnswered(true);
    onAnswer(isCorrect);
  };

  useEffect(() => {
    setSelectedOption('');
    setAnswered(false);
  }, [question]);

  const getOptionClassName = (optionId: string) => {
    let className = 'block w-full text-left p-3 mb-2 border rounded-md';

    if (!answered) {
      className += selectedOption === optionId ? ' bg-blue-100 border-blue-500' : ' hover:bg-gray-50';
    } else {
      if (optionId === question.correctAnswer) {
        className += ' bg-green-100 border-green-500';
      } else if (selectedOption === optionId) {
        className += ' bg-red-100 border-red-500';
      }
    }

    return className;
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">{question.text}</h3>

      <div className="mb-4">
        {question.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option.id)}
            className={getOptionClassName(option.id)}
          >
            <span className="font-medium mr-2">{option.id}.</span> {option.text}
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mt-4 text-center">
          {selectedOption === question.correctAnswer ? (
            <div className="text-green-600 font-medium">Correto!</div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-red-600 font-medium">Incorreto. A resposta correta é {question.correctAnswer}.</div>
              <div className="text-purple-600 font-medium">{question.explanation}.</div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            selectedOption ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Verificar
        </button>
      )}
    </div>
  );
}
