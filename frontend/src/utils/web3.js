import Web3 from "web3";

let web3;

export const getWeb3 = () => {
  if (!web3) {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    } else {
      console.error("No Metamask found");
    }
  }
  return web3;
};
