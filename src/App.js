import React, { useState, useEffect, useCallback } from "react";
import Nav from "./UIMain/Nav/nav.jsx";
import Background from "./UIMain/body/background";
import Farms from "./UIMain/body/farms/index";
import Footer from "./UIMain/Footer";
import { createweb3Modal } from "./utils/web3Modal/createweb3Modal";
import { useConnectWallet, useDisconnectWallet } from "./utils/web3Modal/hooks";
import HeaderTest from "./UIMain/HeaderTest";
//import Web3Modal from "web3modal";
//import WalletConnectProvider from "@walletconnect/web3-provider";
//import { connectors } from "web3modal";
//import logo from "./UIMain/assets/logos/QBERTSWAG.png";
//import Web3 from "web3";
//import getWeb3 from "./utils/web3Utils";

//import Util from "./utils/aprLib/index.js";
//import nativeFarmAbi from "./utils/nativeFarmAbi.js";

//import { tryFetchLPPrice} from "./utils/getPrices";
//var qbertprice = 100;

{
  /*const testprice = async () => {
  var qpertaddress = "0x075da65514bc2af2508314f8a3150ca660e6eea1";
  qbertprice = await tryFetchLPPrice(qpertaddress);
  console.log({ qbertprice });
};*/
}

export default function App() {
  const {
    connectWallet,
    web3,
    address,
    networkId,
    connected
  } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const [web3Modal, setModal] = useState(null);

  useEffect(() => {
    setModal(createweb3Modal);
  }, [setModal]);

  useEffect(() => {
    if (web3Modal && (web3Modal.cachedProvider || window.ethereum)) {
      connectWallet(web3Modal);
    }
  }, [web3Modal, connectWallet]);

  const connectWalletCallback = useCallback(() => {
    connectWallet(web3Modal);
  }, [web3Modal, connectWallet]);

  const disconnectWalletCallback = useCallback(() => {
    disconnectWallet(web3, web3Modal);
  }, [web3, web3Modal, disconnectWallet]);

  return (
    <div className="App">
      <main className="app preload">
        <Nav
          address={address}
          connected={connected}
          connectWallet={connectWalletCallback}
          disconnectWallet={disconnectWalletCallback}
        />
        <Background />
        <Farms
          address={address}
          connected={connected}
          connectWallet={connectWalletCallback}
          disconnectWallet={disconnectWalletCallback}
        />
        <Footer />
        <HeaderTest
          address={address}
          connected={connected}
          connectWallet={connectWalletCallback}
          disconnectWallet={disconnectWalletCallback}
        />
        {/*<button onClick={() => startup()}>Check Out</button>*/}
      </main>
      {/* <ul>
          <li>
            {qbertprice}{" "}
            <button onClick={() => testprice()}>try test lol</button>
          </li>
        </ul>
*/}
    </div>
  );
}
