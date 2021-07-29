import { useState, useEffect, useCallback } from "react";
import { tryFetchPrice } from "../../../../utils/getPrices";
import { calculateApr } from "../../../../utils/apr";
import { getWeb3NoAccount } from "../../../../utils/web3Global";
import util from "../../../../utils/aprLib/index";
import BigNumber from "bignumber.js";
import { infoPry } from "../../../assets/svg";
import $ from "jquery";
import getBalance from "../../../../utils/tokenUtils";
import { constants, utils } from "ethers";
import { formatNumberSuffix } from "../../../../utils/formatBalance";
import {
  tokenAbi,
  rcubeAbi,
  poolAbi,
  strategyAbi
} from "../../../../Resources/lib/abi";
const qbrtprice = window.qbertprice;
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";

export default function Pool(props) {
  var [loaded, setLoaded] = useState(false);
  var [balance, setBalance] = useState(0);
  var [depositState, setDepositState] = useState(0);
  var [withdrawState, setWithdrawState] = useState(0);
  var [poolInfo, setPoolInfo] = useState({
    pool: "",
    deposited: 0,
    allowonce: 0,
    pending: 0,
    price: 0,
    balance: 0,
    apr: 0,
    locked: true
  });
  const loadall = useCallback(async () => {
    if (window.qbertprice) {
      if (window.ethereum) {
        try {
          window.ts.times = 1;
          await loadPool();
        } catch (error) {}
      }
    }
  }, []);
  const loadPool = async () => {
    const web3ext = await getWeb3NoAccount();
    let token = new web3ext.eth.Contract(tokenAbi, props.token_address);
    let pool = new web3ext.eth.Contract(poolAbi, farmAddress);
    let strategy = new web3ext.eth.Contract(strategyAbi, props.poolAddress);
    try {
      let balanced = await getBalance(props.token_address, window.account);
      setBalance(balanced);
      var QBERT_PERBLOCK = await pool.methods.NATIVEPerBlock().call();
      let deposited = await pool.methods
        .stakedWantTokens(props.id, window.account)
        .call();
      let allowance = await token.methods
        .allowance(window.account, farmAddress)
        .call();
      let pendingBefore = poolInfo.pending;
      //console.log(pending);
      let pending = await pool.methods
        .pendingNATIVE(props.id, window.account)
        .call();
      let price;
      if (!poolInfo.price) {
        price = await tokenPrice();
      }
      //let qbertPrice = await util.getTokenPrice("0x6D45A9C8f812DcBb800b7Ac186F1eD0C055e218f",18);
      //let qbertPrice = window.qbertprice;
      let locked;
      if (props.token_address == "0xa6e53f07bD410df069e20Ced725bdC9135146Fe9") {
        let rcube = new web3ext.eth.Contract(rcubeAbi, props.token_address);
        let burnAmount = await rcube.methods._getBurnLevy.call().call();
        console.log(burnAmount);
        if (burnAmount > 1) {
          locked = true;
        } else {
          locked = false;
        }
      }
      let balance;
      if (!props.isLp || props.isLpCompund) {
        balance = await strategy.methods.wantLockedTotal().call();
      } else {
        balance = await token.methods.balanceOf(props.poolAddress).call();
      }
      if (props.poolAddress == "0xB9468Ee4bEf2979615855aB1Eb6718505b1BB756") {
        //console.log(price);
      }
      let total = (balance / 10 ** props.decimals) * price;
      let apr = await calculateApr(
        pool,
        balance,
        price,
        props.id,
        props.decimals
      );
      if (!window.ts.added.includes(props.token_address)) {
        window.ts.value =
          window.ts.value + (balance / 10 ** props.decimals) * price;
        window.ts.deposited =
          window.ts.deposited + (deposited / 10 ** props.decimals) * price;
        window.ts.added.push(props.token_address);
      }
      await setPoolInfo({
        pool,
        deposited,
        allowance,
        pending,
        price,
        balance,
        apr,
        userBalance: balanced,
        locked
      });
    } catch (error) {
      console.log(error);
    }
  };
  const maxButton = async (param) => {
    if (param == "deposit") {
      setDepositState(balance);
      let elem = document.getElementsByClassName("depositInput" + props.id);
      elem[0].value = balance / 10 ** props.decimals;
    } else if (param == "withdraw") {
      setWithdrawState(poolInfo.deposited);
      let elem = document.getElementsByClassName("withdrawInput" + props.id);
      elem[0].value = poolInfo.deposited / 10 ** props.decimals;
    }
  };
  const handdleInput = async (param, event) => {
    event.preventDefault();
    if (param == "withdraw" && event.target.value) {
      if (event.target.value) {
        setWithdrawState(parseFloat(event.target.value) * 10 ** props.decimals);
      } else {
        setWithdrawState(0);
      }
    } else if (event.target.value) {
      if (event.target.value) {
        setDepositState(parseFloat(event.target.value) * 10 ** props.decimals);
      } else {
        setDepositState(0);
      }
    }
  };
  async function tokenPrice() {
    if (!props.isLp) {
      if (!props.isBNB) {
        let tokenPrice = await util.getTokenPrice(
          props.price.lpaddress,
          props.decimals
        );
        tokenPrice = tokenPrice[props.price.reserve];
        return tokenPrice;
      } else {
        return 300;
      }
    } else {
      let value = await util.getLpPrice(
        props.price.lpaddress,
        props.tokenDecimals
      );
      value = value[props.price.reserve] * 2;
      let tokenPrice = await util.getTokenPrice(
        props.price.bnnlpaddress,
        props.tokenDecimals
      );
      tokenPrice = tokenPrice[props.price.reserve];
      return value * tokenPrice;
    }
  }
  async function approve() {
    let token = new web3.eth.Contract(tokenAbi, props.token_address);
    await token.methods
      .approve(farmAddress, constants.MaxUint256)
      .send({ from: window.account });
    let allowance = await token.methods
      .allowance(window.account, farmAddress)
      .call();
  }
  async function deposit() {
    if (balance >= depositState) {
      let depod = depositState.toLocaleString("fullwide", {
        useGrouping: false
      });
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let amount = new Web3.utils.toBN(depod).toString();
      await pool.methods
        .deposit(props.id, amount)
        .send({ from: window.account });
      setTimeout(async () => {
        let tokenStakeds = await pool.methods
          .stakedWantTokens(props.id, window.account)
          .call();
        window.ts.deposited =
          window.ts.deposited +
          (tokenStakeds / 10 ** props.decimals) * poolInfo.price;
      }, 4000);
    }
  }
  async function whitdraw() {
    if (poolInfo.deposited >= withdrawState) {
      let pool = new web3.eth.Contract(poolAbi, farmAddress);
      let withs = withdrawState.toLocaleString("fullwide", {
        useGrouping: false
      });
      let amount = new Web3.utils.toBN(withs).toString();
      await pool.methods
        .withdraw(props.id, amount)
        .send({ from: window.account });
      setTimeout(async () => {
        let tokenStakeds = await pool.methods
          .stakedWantTokens(props.id, window.account)
          .call();
        window.ts.deposited =
          window.ts.deposited -
          (tokenStakeds / 10 ** props.decimals) * poolInfo.price;
      }, 4000);
    }
  }
  async function harvest() {
    let pool = new web3.eth.Contract(poolAbi, farmAddress);
    if (poolInfo.pending > 1e8) {
      await pool.methods.withdraw(props.id, 0).send({ from: window.account });
      let pendingQbert = await pool.methods
        .pendingNATIVE(props.id, window.account)
        .call();
    }
  }
  {
    /*useEffect(async () => {
    if (!loaded) {
      setLoaded(true);
      
    }
  });*/
  }

  useEffect(() => {
    loadall();
    const interval = setInterval(() => {
      loadall();
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [loadall]);

  let sd = () => {
    $(`div.details.id${props.id}`).slideToggle(500);
    $(`div.pool-card.id${props.id}`).toggleClass("expanded", true);
  };
  return (
    <div
      className={`pool-card  highlighted radioactive  ${props.special} id${props.id}`}
    >
      <div className="tag-container">
        {poolInfo.locked ? (
          <font
            style={{
              color: "red",
              fontSize: 15,
              backgroundColor: "var(--c-background-2)",
              borderRadius: "var(--r-border-2)",
              border: "#d40000 2px solid",
              padding: "2px 4px",
              boxShadow: "var(--t-shadow-3)"
            }}
          >
            Locked
          </font>
        ) : (
          <div className="mini-tag">
            {poolInfo.locked ? "Locked" : props.number_fee}
          </div>
        )}
      </div>
      <div className="info">
        <div className="symbols">
          <img src={"../images/" + props.image_name} />
          <img src={"../images/" + props.pair_image} />
        </div>
        <div className="pool">
          <div className="ttl">
            {props.name}
            <div className="sub-ttl"></div>
          </div>
          <div className="bottom">
            <div className="tag multiplier">{props.pool_multiplier}</div>
            <div className="provider ml-10">QBert</div>
          </div>
        </div>
        <div className="key-value apy shorter">
          <div className="val primary">
            {formatNumberSuffix(poolInfo.apr, 2)}%
          </div>
          <div className="key">APR</div>
        </div>
        <div className="key-value balance">
          <div className="val">
            {poolInfo.userBalance
              ? (poolInfo.userBalance / 10 ** props.decimals).toFixed(2)
              : "***"}
          </div>
          <div className="key">Balance</div>
        </div>
        <div className="key-value deposited">
          <div className="val">
            {poolInfo.deposited
              ? (poolInfo.deposited / 10 ** props.decimals).toFixed(2)
              : "***"}
          </div>
          <div className="key">Deposited</div>
        </div>
        <div className="key-value daily shorter">
          <div className="val">
            {poolInfo.apr
              ? formatNumberSuffix(poolInfo.apr / 365, 2) + "%"
              : "***"}
          </div>
          <div className="key">Daily</div>
        </div>
        <div className="key-value tvl shorter">
          <div className="val">
            {poolInfo.price
              ? "$" +
                formatNumberSuffix(
                  (poolInfo.balance / 10 ** props.decimals) * poolInfo.price,
                  0
                )
              : "***"}
          </div>
          <div className="key">TVL</div>
        </div>
        <div
          className="btn outlined ml-auto get"
          href={props.buy_url}
          target="_blank"
        >
          Get {props.name}
        </div>
        <div
          onClick={() => {
            sd();
          }}
          className="btn expand ml-10"
        ></div>
      </div>
      <div className={`details id${props.id}`}>
        <div className="line"></div>
        <div className="transactions">
          <div className="transaction deposit no-bg">
            <div className="amount">
              <span className="ttl">Wallet:</span>
              <span className="val" data-display-decimals="6">
                {(poolInfo.userBalance / 10 ** props.decimals).toFixed(3)}{" "}
                <span className="estimate"></span>
              </span>
            </div>
            <div className="swap">
              <a href={props.buy_url}>Get {props.name}</a>
            </div>
            <div className="input-container number with-max">
              <input
                className={"depositInput" + props.id}
                onChange={(e) => handdleInput("deposit", e)}
                type="number"
                data-humanize="false"
                data-decimal-places="18"
              />
              <div
                onClick={() => {
                  maxButton("deposit");
                }}
                className="max"
              >
                MAX
              </div>
            </div>
            {parseInt(poolInfo.allowance) < parseInt(depositState) ? (
              <div
                className="btn secondary mt-20 deposit"
                onClick={() => {
                  approve();
                }}
              >
                Approve
              </div>
            ) : (
              <div
                className="btn mt-20 deposit"
                onClick={() => {
                  deposit();
                }}
                data-currency-contract="0x0000000000000000000000000000000000000000"
              >
                Deposit
              </div>
            )}
          </div>
          <div className="transaction withdraw">
            <div className="amount">
              <span className="ttl">Vault:</span>
              <span className="val" data-display-decimals="6">
                {poolInfo.deposited > 1e8
                  ? (poolInfo.deposited / 10 ** props.decimals).toFixed(3)
                  : 0}
                <span className="estimate"></span>
              </span>
            </div>
            <div className="input-container number with-max">
              <input
                className={"withdrawInput" + props.id}
                onChange={(e) => handdleInput("withdraw", e)}
                type="number"
                data-humanize="false"
                data-decimal-places="18"
              />
              <div
                onClick={() => {
                  maxButton("withdraw");
                }}
                className="max"
              >
                MAX
              </div>
            </div>
            <div
              onClick={() => {
                whitdraw();
              }}
              className="btn secondary mt-20 withdraw"
            >
              Withdraw to Wallet
            </div>
          </div>
          <div className="transaction harvest">
            <div className="ttl">Pending :</div>
            <div className="val">
              <span className="amount">
                {(poolInfo.pending / 10 ** 18).toFixed(2)}
              </span>
              <span style={{ fontSize: 13 }} className="value">
                {" "}
                ($
                {((poolInfo.pending / 10 ** 18) * poolInfo.qbertPrice).toFixed(
                  2
                )}
                )
              </span>
            </div>
            <div
              onClick={() => {
                harvest();
              }}
              className="btn primary harvest"
            >
              Harvest
            </div>
          </div>
        </div>
        <div className="farm-info">
          <div className="information">
            <div className="info">
              <div className="itm head">
                <span className="ttl">APR</span>
              </div>
              <div className="itm qbert-apy">
                <span className="ttl">{props.name} APR:&nbsp;</span>
                <span className="val">
                  {formatNumberSuffix(poolInfo.apr, 2)} %
                </span>
                <img className="tooltip" src={infoPry}></img>
              </div>
            </div>
            <div className="info">
              <div className="itm head">
                <span className="ttl">Daily</span>
              </div>
              <div className="itm qbert-daily-apy">
                <span className="ttl">{props.name} Daily:&nbsp;</span>
                <span className="val">
                  {formatNumberSuffix(poolInfo.apr / 365, 2)}%
                </span>
              </div>
            </div>
            <div className="info">
              <div className="itm head">
                <span className="ttl">Farm</span>
              </div>
              <div className="itm qbert-daily-apy">
                <span className="ttl">{props.name} TVL:&nbsp;</span>
                <span className="val">
                  $
                  {formatNumberSuffix(
                    (poolInfo.balance / 10 ** props.decimals) * poolInfo.price,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
