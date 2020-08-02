import React from 'react';
import logo from './logo.svg';
import './App.css';
import md5File from 'yhutils/src/md5sumFile';

function App() {
  const md5files = async (evt) => {
    let result = await md5File(evt.files[0])
    console.log('md5files', result);
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <div>md5文件</div>
        <input type='file' onChange={} />
      </div>
    </div>
  );
}

export default App;
