import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PlayerPage from './pages/PlayerPage';

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
      <Route path="/share/:videoId" element={<PlayerPage />} />
    </Routes>
  );
}

export default App;
