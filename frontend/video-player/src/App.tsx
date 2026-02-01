import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EmbedPage from './pages/EmbedPage';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/embed/:videoId" element={<EmbedPage />} />
    </Routes>
  );
}

export default App;
