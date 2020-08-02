import React from 'react';
import logo from './logo.svg';
import './App.css';
import md5File from 'yhutils/lib/md5sumFile';
import {parseUserAgent, parseUserAgentV2, parseUserAgentV3} from 'yhutils/lib/userAgent';
import imageFileScaleAsync from 'yhutils/lib/imageFileScale';
import dataUrlOfFile from 'yhutils/lib/dataUrlOfFile';

function App() {
  const [md5, setMd5] = React.useState('');
  const [agent1, setAgent1] = React.useState('');
  const [agent2, setAgent2] = React.useState('');
  const [agent3, setAgent3] = React.useState('');
  const [dataUrl, setDataUrl] = React.useState(null);

  const handleMd5files = async (evt) => {
    let result = await md5File(evt.target.files[0])
    setMd5(result);
    console.log('md5files', result);
  }
  const handleAgent1 = () => {
    let agent1 = parseUserAgent();
    setAgent1(JSON.stringify(agent1));
  }
  const handleAgent2 = () => {
    let agent2 = parseUserAgentV2();
    setAgent2(JSON.stringify(agent2));
  }
  const handleAgent3 = () => {
    let agent3 = parseUserAgentV3();
    setAgent3(JSON.stringify(agent3));
  }
  const handleScaleImage = async (evt) => {
    let file0 = evt.target.files[0];
    let fileDest = await imageFileScaleAsync(file0, {maxHeight: 1440});
    console.log('fileDest', fileDest);
    let data = await dataUrlOfFile(fileDest);
    let dataUrl = data.dataUrl;
    setDataUrl(dataUrl);
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
      <div>
        <div onClick={handleAgent1}>userAgent1:{agent1}</div>
        <div onClick={handleAgent2}>userAgent2:{agent2}</div>
        <div onClick={handleAgent3}>userAgent3:{agent3}</div>
      </div>
      <div>
      <input type='file' onChange={handleScaleImage} />
      {dataUrl &&<img src={dataUrl} />}
      </div>
    </div>
  );
}

export default App;
