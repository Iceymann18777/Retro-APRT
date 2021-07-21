import { useWallet } from "@binance-chain/bsc-use-wallet";
import { TopMenu as UikitMenu } from "@neonic-libs/uikit";
import React, { useContext } from "react";
import links from "./config";

const Menu = ({ ...props }) => {
  const { account, connect, reset } = useWallet();

  return <UikitMenu links={links} {...props} />;
};

export default Menu;
