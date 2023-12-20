import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup'
import Topic from './components/Topic'
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";


function App() {
  return (

    <div className="App">
 
 {false?<></>:
      <BrowserRouter>
        <Routes>
          {
         
         localStorage.getItem('user') ? <>
              <Route path='/' element={<Home/>} />
              <Route  path='/login' element={<Navigate to='/'/>} />
              <Route  path='/signup' element={<Navigate to='/'/>} />
              <Route  path='/topics/:type' element = {<Topic/>}/>
              
              
            </> : <>
              
              <Route path='/' element={<Login/>} />
              <Route  path='/topics/:type' element = {<Login/>}/>
              <Route path='/login' element={<Login />} />
              <Route  path='/signup' element={<Signup />} />
              
            </>
          }
        </Routes>
      </BrowserRouter>
}
    </div>
);
}

export default App;
