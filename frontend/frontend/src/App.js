import './App.css';
import CallRailData from './CallRailData';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Call Rail Dashboard</h1>
      </header>
      <Navbar />
      <CallRailData />
    </div>
  );
}

export default App;
