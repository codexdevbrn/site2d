import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import './index.css';

// Carregadas sob demanda: nenhuma das duas é necessária na Home, e ambas puxam o SDK
// do Firebase, que é pesado. Isso mantém a Home leve para quem só visita o site.
const Midia = lazy(() => import('./pages/Midia'));
const AdminYoutube = lazy(() => import('./pages/AdminYoutube'));

function PageFallback() {
  return <div style={{ minHeight: '100vh' }} />;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="midia" element={<Midia />} />
          </Route>
          <Route path="admin/youtube" element={<AdminYoutube />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
