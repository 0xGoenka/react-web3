import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import web3 from "./web3/web3";

import Web3 from "web3";

new Web3();

const ethEnabled = async () => {
  if (window.ethereum) {
    console.log("Starting Metamask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Metamask connected");
    // window.web3 = new Web3(window.ethereum);

    // console.log(new Web3());
    return true;
  }
  return false;
};

function App() {
  const [count, setCount] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      ethEnabled();
      console.log("useEffect");
    }
    initialized.current = true;
  }, []);

  console.log({ count });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
