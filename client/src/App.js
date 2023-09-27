import './App.css';
import GetNews from './components/GetNews';
import { CrimeStatsContextProvider } from './components/contexts/CrimeStatsContextProvider';
import { HomePage } from './components/pages/HomePage';
import { MapPage } from './components/pages/MapPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <CrimeStatsContextProvider>
      <BrowserRouter>
    <div className="App">
      <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/map' element={<MapPage/>} />
      
      </Routes>
    </div>
    </BrowserRouter>
    </CrimeStatsContextProvider>
  );
}

export default App;
