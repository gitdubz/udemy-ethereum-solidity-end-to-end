import Web3 from 'web3';
let web3;

if (typeof window !== 'undefined' && window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/f7797cab00924e688344dbdb36fadf62'
  );
  web3 = new Web3(provider);
}

export default web3;
