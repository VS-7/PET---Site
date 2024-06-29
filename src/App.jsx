import './App.css';

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
//context 
import { AuthProvider  } from '../context/AuthContext';

// hooks 
import { useAuthentication } from './hooks/useAuthentication';
import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
// pages

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Post from './pages/Post/Post';
import ResetPassword from './components/ResetPassword';
import PublicationCreator from './pages/PublicationCreate/PublicationCreator';
import CoursePage from './pages/CourseCreate/CoursePage';
import CourseList from './pages/CourseCreate/CourseList';
import TopicList from './pages/CourseCreate/TopicList';
import TopicPage from './pages/CourseCreate/TopicPage';
import PublicationPage from './pages/PublicationCreate/PublicationPage';
import TopicView from './pages/CourseCreate/TopicView';
import CourseView from './pages/CourseCreate/CourseView';
import BusSchedule from './pages/BusSchedule/BusSchedule';
import EditPublicationPage from './pages/PublicationCreate/EditPublicationPage';
import ArticleCreator from './pages/ArticleCreator/ArticleCreator';
import ArticlePage from './pages/ArticleCreator/ArticlePage';
import ArticleEditPage from './pages/ArticleCreator/ArticleEditPage';
import ArticleListPage from './pages/ArticleCreator/ArticleListPage';

function App() {

  const [theme, setTheme] = useState('dark'); // Tema padrão definido como 'dark'

   // Função para alternar entre os temas
   const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };

   // Aplica a classe do tema ao corpo do documento
   useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  const loadingUser = user === undefined

  useEffect (() => {
    
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth]);

  if(loadingUser)
  return (
    <div className="loading-container">
    <div className="loader"></div>
    <p className="loading-text">Carregando...</p>
  </div>
  );

  return (
    <div className='App'>
    <div className='main-container'>
    {/*} <button onClick={toggleTheme} style={{ position: 'fixed', zIndex: 1000, top: '15px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
  </button>*/}
      <AuthProvider value={ { user }}>
        <BrowserRouter>
            <Navbar />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/horario-onibus" element={<BusSchedule />} />
              <Route path='/resetPassword' element={<ResetPassword />} />
             {/*Publicações*/}
              <Route 
                path='/criar-publicacao' 
                element={user ? <PublicationCreator /> : <Navigate to="/" />} />
              <Route 
                path='/publicacao/:publicationId' 
                element={user ? <PublicationPage /> : <Navigate to="/" />} />
             <Route 
                path='/editar-publicacao/:publicationId' 
                element={<EditPublicationPage />} /> 
              {/*Cursos*/}
              <Route 
                path='/cursos/:courseId/topico/:topicId' 
                element={user ? <TopicView /> : <Navigate to="/" />} />   
             <Route 
                path='/criar-curso' 
                element={user ? <CoursePage /> : <Navigate to="/" />} />
            <Route 
                path='/cursos/lista/:courseId' 
                element={user ? <TopicList /> : <Navigate to="/" />} />
            <Route 
                path='/cursos/:courseId/topicos/:topicId' 
                element={user ? <TopicPage /> : <Navigate to="/" />} />
            <Route 
                path='/cursos' 
                element={user ? <CourseList /> : <Navigate to="/" />} />
             <Route 
                path='/cursos/:courseId' 
                element={user ? <CourseView /> : <Navigate to="/" />} />   
              {/*Artigos*/}
              <Route 
                path='/criar-artigo' 
                element={user ? <ArticleCreator /> : <Navigate to="/" />} />   
              <Route 
                path='/artigos/:articleId' 
                element={user ? <ArticlePage /> : <Navigate to="/" />} />   
              <Route 
                path='/editar-artigo/:articleId' 
                element={user ? <ArticleEditPage /> : <Navigate to="/" />} />   
              <Route 
                path='/artigos' 
                element={user ? <ArticleListPage /> : <Navigate to="/" />} />   
             <Route 
                path='/dashboard' 
                element={user ? <Dashboard /> : <Navigate to="/" />} />
            </Routes>
          </div>
          
        </BrowserRouter>
      </AuthProvider>
      </div>
    </div>
  )
}



export default App
