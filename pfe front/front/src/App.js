import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './Pages/Register';
import Login from './Pages/Login';
import HomeMed from './Pages/HomeMed';
import HomeAd from './Pages/HomeAd';
import Visiteur from './Pages/Visiteur';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin-home" element={<HomeAd />} />
          <Route path="/medecin-home" element={<HomeMed />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Visiteur />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
