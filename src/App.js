import React from "react";
import Nav from "./UIMain/Nav/nav.jsx";
import Background from "./UIMain/body/background";
import Farms from "./UIMain/body/farms/index";
import Footer from "./UIMain/Footer";
import { Paywall } from "@unlock-protocol/paywall";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import logo from "./UIMain/assets/logos/QBERTSWAG.png";
import { connectors } from "web3modal";
//import Web3 from "web3";
import getWeb3 from "./utils/web3Utils";
//import Util from "./utils/aprLib/index.js";
//import nativeFarmAbi from "./utils/nativeFarmAbi.js";
import mathwlt from "./UIMain/assets/wallets/math-wallet.svg";
import twtwlt from "./UIMain/assets/wallets/trust-wallet.svg";
import sfplwlt from "./UIMain/assets/wallets/safepal-wallet.svg";
import bnbwlt from "./UIMain/assets/wallets/binance-wallet.png";

let paywall;

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
    cacheProvider: true, // optional
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

  //const config = {"unlockUserAccounts":true,"callToAction":{"default":"Become a member today and unlock this blog!"},"icon":"https://staging-app.unlock-protocol.com/static/images/svg/default.svg","locks":{"0x771e09a5bfef4c4b85d796a112d49e839c98d9da":{"name":" "},"0x3a892c7014cd05418e48ae516a6a9e700ccb3e39":{"name":" "}}};

  const config = {
    unlockUserAccounts: true,
    callToAction: { default: "Become a member today and unlock this blog!" },
    icon:
      "https://staging-app.unlock-protocol.com/static/images/svg/default.svg",
    locks: {
      "0x5958d124580813b714e4a4c6386a6e184f9c295d": { name: " " },
      "0xbf75124def5d00e3165a5fc710df9fbcf3a7ebb9": { name: " " }
    }
  };

  const moduleConfig = {
    unlockAppUrl: "https://app.unlock-protocol.com",
    locksmithUri: "https://locksmith.unlock-protocol.com",
    readOnlyProvider:
      "https://eth-mainnet.alchemyapi.io/jsonrpc/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100"
  };

  paywall = new Paywall(config, moduleConfig, provider);

  paywall.loadCheckoutModal();
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={() => (paywall ? paywall.loadCheckoutModal() : startup())}
        >
          Check Out
        </button>
      </header>
    </div>
  );
}

export default App;
