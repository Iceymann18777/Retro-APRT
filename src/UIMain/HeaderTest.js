import React, { useEffect, useRef, useState } from "react";
import { renderIcon } from "@download/blockies";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { WbSunny, NightsStay } from "@material-ui/icons";

const HeaderTest = ({
  connected,
  address,
  connectWallet,
  disconnectWallet
}) => {
  const [shortAddress, setShortAddress] = useState("");
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const canvas = canvasRef.current;
    renderIcon({ seed: address.toLowerCase() }, canvas);
    const updatedDataUrl = canvas.toDataURL();
    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl);
    }
    if (address.length < 11) {
      setShortAddress(address);
    } else {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [dataUrl, address, connected]);

  return (
    <div>
      <button
        disableElevation
        onClick={connected ? disconnectWallet : connectWallet}
      >
        {connected ? (
          <>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Avatar
              alt="address"
              src={dataUrl}
              style={{
                width: "24px",
                height: "24px",
                marginRight: "4px"
              }}
            />
            {shortAddress}
          </>
        ) : (
          <>{"Vault-Wallet"}</>
        )}
      </button>
    </div>
  );
};

export default HeaderTest;
