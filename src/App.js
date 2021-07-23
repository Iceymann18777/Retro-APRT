import React from "react";
import Nav from "./UIMain/Nav/nav.jsx";
import Background from "./UIMain/body/background";
import Farms from "./UIMain/body/farms/index";
import Footer from "./UIMain/Footer";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { connectors } from "web3modal";
//import logo from "./UIMain/assets/logos/QBERTSWAG.png";
//import Web3 from "web3";
import getWeb3 from "./utils/web3Utils";
//import Util from "./utils/aprLib/index.js";
//import nativeFarmAbi from "./utils/nativeFarmAbi.js";
import mathwlt from "./UIMain/assets/wallets/math-wallet.svg";
import twtwlt from "./UIMain/assets/wallets/trust-wallet.svg";
import sfplwlt from "./UIMain/assets/wallets/safepal-wallet.svg";
import bnbwlt from "./UIMain/assets/wallets/binance-wallet.png";

function App() {
  return (
    <div className="App">
      <main className="app preload">
        <Nav />
        <Background />
        <Farms />
        <Footer />
        {/*<button onClick={() => startup()}>Check Out</button>*/}
      </main>
    </div>
  );
}

export default App;
