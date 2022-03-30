import React from 'react';
import './App.css';
import AudioTable from './AudioTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">MedicBot Entries List</h1>
      </header>
      <div className="App-body">
        <AudioTable/>
      </div>
    </div>
  );
}

export default App;
