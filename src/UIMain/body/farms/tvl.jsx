import { Fragment, useState, useEffect } from "react";
import CountUp from "react-countup";
import Countdown from "react-countdown";
import { getWeb3NoAccount } from "../../../utils/web3Global";
//import { formatNumberHumanize } from "../../../utils/formatBalance";
import { nativeFarmAbi } from "../../../Resources/lib/abi";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";

export default function Tvl() {
  var [value, setValue] = useState(0);
  var [timeLeft, setTimeLeft] = useState(5);
  var [text, setText] = useState("...");

  const web3 = getWeb3NoAccount();
  let pool = new web3.eth.Contract(nativeFarmAbi, farmAddress);

  const GetHarvestTimer = async () => {
    try {
      var currentBlock = await web3.eth.getBlockNumber();
      let startBlockHarvest = await pool.methods.startBlockHarvest().call();
      var startBlock = await pool.methods.startBlock().call();
      var startBlockTime = startBlock - currentBlock;
      var startBlockHarvestTime = startBlockHarvest - currentBlock;
      if (startBlockTime > 0) {
        setTimeLeft(startBlockTime * 3);
        setText("Farms Start");
      } else if (startBlockHarvestTime > 0) {
        setTimeLeft(startBlockHarvestTime * 3);
        setText("Pending Locked");
      } else {
        setTimeLeft(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTVLGlobal = async () => {
    try {
      if (window.ts.value !== 0) {
        if (window.ts.value !== value) {
          setValue(window.ts.value);
        }
      }
      //}
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetHarvestTimer();

    const interval = setInterval(() => {
      // do something
      getTVLGlobal();
    }, 3146);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function renderer({ hours, minutes, seconds, completed, api }) {
    if (completed) {
      // Render a completed state
      return <div></div>;
    } else {
      // Render a countdown
      return (
        <font style={{ color: "red", fontSize: 15 }}>
          {text}: {hours}h :{minutes}m :{seconds}s
        </font>
      );
    }
  }
  return (
    <Fragment>
      <CountUp
        style={{ fontSize: 20 }}
        className="txt tvl ml-auto"
        //start={0}
        end={value}
        duration={1}
        prefix="TVL $"
        separator=","
        decimals={2}
        redraw={true}
      />
      {/*<div style={{ fontSize: 20 }} className="txt tvl ml-auto">
        TVL ${formatNumberHumanize(value, 2)} <br></br>
  </div>*/}
      <Countdown date={Date.now() + timeLeft * 1000} renderer={renderer} />
    </Fragment>
  );
}
