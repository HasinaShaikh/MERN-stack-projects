
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Home  from './pages/Home'
import Dashboard from './pages/Dashboard'
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Progress from "./pages/Progress";
import Library from "./pages/Library";
import QuizHistory from "./pages/QuizHistory";
import SavedMaterial from "./pages/savedMaterial";
export const serverUrl = "http://127.0.0.1:4002";

function App() {
  return (
      <>
      <Routes>
        <Route path = '/' element={<Home/>}/>
        <Route path = '/auth' element={<Auth/>}/>
        <Route path = '/dashboard' element={<Dashboard/>}/>
        <Route path="/notes" element={<Notes />} />
       <Route path="/savedMaterial"  element={<SavedMaterial />}/>
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-history" element={<QuizHistory />}/>
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/library" element={<Library />} />
        </Routes>
       
    </>
  )
}

export default App

