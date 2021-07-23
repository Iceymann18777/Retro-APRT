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

async function startup() {
  console.log("starting up");
  const providerOptions = {
    /* See Provider Options Section */
    injected: {
      display: {
        name: "Metamask",
        description: "Metamask"
      }
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: "https://bsc-dataseed.binance.org/",
          56: "https://bsc-dataseed.binance.org/"
        }
      }
    },
    "custom-binance": {
      display: {
        name: "Binance",
        description: "Binance Chain Wallet",
        logo: bnbwlt
      },
      package: "binance",
      connector: async (ProviderPackage, options) => {
        const provider = window.BinanceChain;
        await provider.enable();
        return provider;
      }
    },
    "custom-math": {
      display: {
        name: "Math",
        description: "Math Wallet",
        logo: mathwlt
      },
      package: "math",
      connector: connectors.injected
    },
    "custom-twt": {
      display: {
        name: "Trust",
        description: "Trust Wallet",
        logo: twtwlt
      },
      package: "twt",
      connector: connectors.injected
    },
    "custom-safepal": {
      display: {
        name: "SafePal",
        description: "SafePal App",
        logo: sfplwlt
      },
      package: "safepal",
      connector: connectors.injected
    }
  };

  const web3Modal = new Web3Modal({
    network: "binance", // optional
    cacheProvider: false, // optional
    theme: {
      background: "#380033a8",
      main: "#fff",
      secondary: "#00c0d4",
      border: "#380033a8",
      hover: "#ff0a9c78"
    },
    providerOptions // required
  });

  const provider = await web3Modal.connect();
  getWeb3(provider);
}

function App() {
  return (
    <div className="App">
      <main className="app preload">
        <Nav />
        <Background />
        <Farms />
        <Footer />
        <button onClick={() => startup()}>Check Out</button>
      </main>
    </div>
  );
}

export default App;
