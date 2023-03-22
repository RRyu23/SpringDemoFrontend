import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage.js'
import TransactionPage from './transactionPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Routes>
      </Router>
  );
}

export default App;
