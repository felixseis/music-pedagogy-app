import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SightReading from './pages/SightReading';
import Intervals from './pages/Intervals';
import Dictation from './pages/Dictation';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sight-reading" element={<SightReading />} />
          <Route path="intervals" element={<Intervals />} />
          <Route path="dictation" element={<Dictation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
