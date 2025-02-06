import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import socketConnection from './utilities/socketConnection';
import MainVideoPage from './videoComponents/MainVideoPage';
import './App.css';

const Home = () => <h1>Home page</h1>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Home}/>
        <Route path="/join-video" Component={MainVideoPage}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
