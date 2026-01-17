import {useGameState} from './hooks/useGameState';
import {EPILOGUES, QUESTIONS} from './data/adventure';
import type {Answer} from './types/game';
import QuestionCard from './components/QuestionCard';
import EndScreen from './components/EndScreen';

function App() {
    const {state, updateState, resetGame} = useGameState();

    const handleAnswer = (answer: Answer) => {
        const newHistory = [...state.history, answer.id];

        // Check if nextQuestionId exists in EPILOGUES
        if (EPILOGUES[answer.nextQuestionId]) {
            updateState({
                history: newHistory,
                isFinished: true,
                finalEpilogueId: answer.nextQuestionId,
                currentQuestionId: null
            });
        } else if (QUESTIONS[answer.nextQuestionId]) {
            updateState({
                history: newHistory,
                currentQuestionId: answer.nextQuestionId
            });
        } else {
            console.error("Next ID not found in QUESTIONS or EPILOGUES:", answer.nextQuestionId);
        }
    };

    const currentQuestion = state.currentQuestionId ? QUESTIONS[state.currentQuestionId] : null;
    const currentEpilogue = state.finalEpilogueId ? EPILOGUES[state.finalEpilogueId] : null;

    return (
        <div
            className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black flex flex-col font-sans text-gray-200">
            <header
                className="w-full py-4 px-6 border-b border-gray-800/50 backdrop-blur-md bg-black/30 flex flex-row items-center justify-center gap-4">
                <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" className="h-10 w-auto md:h-12"/>
                <h1 className="text-xl md:text-3xl font-serif font-black tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [text-shadow:_1px_1px_0_rgb(0_0_0_/_40%)]">
                    Fantasy Game
                </h1>
            </header>

            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl animate-fadeIn">
                    {!state.isFinished && currentQuestion && (
                        <QuestionCard
                            question={currentQuestion}
                            onAnswer={handleAnswer}
                        />
                    )}

                    {state.isFinished && currentEpilogue && (
                        <EndScreen
                            epilogue={currentEpilogue}
                            onRestart={resetGame}
                        />
                    )}

                    {!state.isFinished && !currentQuestion && (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-4">Ein Fehler ist aufgetreten oder das Abenteuer ist zu
                                Ende.</h1>
                            <button onClick={resetGame}
                                    className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Neustart
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
