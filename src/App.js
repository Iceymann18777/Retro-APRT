import React from "react";
import Nav from "./UIMain/Nav/nav.jsx";
import Background from "./UIMain/body/background";
import Farms from "./UIMain/body/farms/index";
import Footer from "./UIMain/Footer";
//import Web3Modal from "web3modal";
//import WalletConnectProvider from "@walletconnect/web3-provider";
//import { connectors } from "web3modal";
//import logo from "./UIMain/assets/logos/QBERTSWAG.png";
//import Web3 from "web3";
//import getWeb3 from "./utils/web3Utils";

//import Util from "./utils/aprLib/index.js";
//import nativeFarmAbi from "./utils/nativeFarmAbi.js";

import {
  getPCSPrice,
  getDEXGuruPrice,
  getGeckoPrice,
  tryFetchPrice,
  getDebankPrice,
  getCovalentPrice,
  tryFetchLPPrice
} from "./utils/getPrices";
//import getTokenPrice from "./utils/getTvl";
var qbertprice = 100;

const testprice = async () => {
  var qpertaddress = "0x075da65514bc2af2508314f8a3150ca660e6eea1";
  qbertprice = await tryFetchLPPrice(qpertaddress);
  console.log({ qbertprice });
};

export default function App({ children }) {
  return (
    <div className="App">
      <main className="app preload">
        <Nav />
        <Background />
        <Farms />
        <Footer />
        {/*<button onClick={() => startup()}>Check Out</button>*/}
      </main>
      <ul>
        <li>
          {qbertprice} <button onClick={() => testprice()}>try test lol</button>
        </li>
      </ul>
    </div>
  );
}
