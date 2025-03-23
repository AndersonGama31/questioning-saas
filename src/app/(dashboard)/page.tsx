import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <main className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">English Level Quiz</h1>
        <p className="text-xl mb-8">
          Teste e melhore seu inglês com perguntas personalizadas para seu nível, de iniciante (A1) a proficiente (C2).
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Como funciona:</h2>
          <ol className="text-left list-decimal list-inside space-y-2">
            <li>Selecione seu nível de inglês (A1 a C2)</li>
            <li>Responda a 5 perguntas no formato de completar frases</li>
            <li>Receba feedback imediato sobre suas respostas</li>
            <li>Veja sua pontuação final e dicas para melhorar</li>
          </ol>
        </div>

        <Link
          href="/quiz"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
        >
          Começar Quiz
        </Link>
      </main>
    </div>
  );
}
