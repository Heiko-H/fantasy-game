import {Route, Routes} from 'react-router-dom';
import Header from "./components/Header.tsx";
import DndRacePage from "./pages/DndRacePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AdventurePage from "./pages/AdventurePage.tsx";

function App() {
    return (
        <div
            className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black flex flex-col font-sans text-gray-200">
            <Header/>

            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl animate-fadeIn">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="adventure" element={<AdventurePage/>}/>
                        <Route path="dnd" element={<DndRacePage/>}/>
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;
