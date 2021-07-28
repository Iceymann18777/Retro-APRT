import Countdown from "react-countdown";
import { getWeb3NoAccount } from "../../../utils/web3Global";
import { Fragment, useState, useEffect } from "react";
import { formatNumberHumanize } from "../../../utils/formatBalance";
import nativeFarmAbi from "../../../Resources/lib/abi/nativeFarmAbi.json";
const farmAddress = "0x738600B15B2b6845d7Fe5B6C7Cb911332Fb89949";
const web3 = getWeb3NoAccount();
export default function Tvl() {
  var [value, setValue] = useState(0);
  var [timeLeft, setTimeLeft] = useState(5);
  var [loaded, setLoaded] = useState(false);
  var [text, setText] = useState("...");
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!loaded) {
        setLoaded(true);
      }
      let pool = new web3.eth.Contract(nativeFarmAbi, farmAddress);
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
      if (web3 && window.ts) {
        setValue(window.ts.value);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  });

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
      <div style={{ fontSize: 20 }} className="txt tvl ml-auto">
        TVL ${formatNumberHumanize(value, 2)} <br></br>
        <Countdown date={Date.now() + timeLeft * 1000} renderer={renderer} />,
      </div>
    </Fragment>
  );
}
