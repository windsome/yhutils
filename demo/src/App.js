import React from 'react';
import logo from './logo.svg';
import './App.css';
import md5File from 'yhutils/lib/md5sumFile';

function App() {
  const [md5, setMd5] = React.useState('');
  const handleMd5files = async (evt) => {
    let result = await md5File(evt.target.files[0])
    setMd5(result);
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
  <div>md5文件:{md5}</div>
        <input type='file' onChange={handleMd5files} />
      </div>
    </div>
  );
}

export default App;
