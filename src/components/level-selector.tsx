'use client';

export default function LevelSelector({ onSelectLevel }: any) {
  const levels = [
    { id: 'a1', name: 'A1 - Iniciante básico' },
    { id: 'a2', name: 'A2 - Iniciante intermediário' },
    { id: 'b1', name: 'B1 - Intermediário' },
    { id: 'b2', name: 'B2 - Intermediário avançado' },
    { id: 'c1', name: 'C1 - Avançado' },
    { id: 'c2', name: 'C2 - Proficiente' }
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Selecione seu nível de inglês</h2>
      <div className="grid gap-3">
        {levels.map(level => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {level.name}
          </button>
        ))}
      </div>
    </div>
  );
}
