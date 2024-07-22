import './App.css';
import CallRailData from './CallRailData';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <div className="App">
      <Dashboard />
      <Navbar />
      <CallRailData />
    </div>
  );
}

export default App;
