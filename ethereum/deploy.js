// https://rinkeby.infura.io/v3/f7797cab00924e688344dbdb36fadf62
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'soap topple airport chapter polar present kid clever they ecology come render',
  'https://rinkeby.infura.io/v3/f7797cab00924e688344dbdb36fadf62'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`DEPLOY: Attempting to deploy from account: ${accounts[0]}`);
  console.log(compiledFactory.interface);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: '0x' + compiledFactory.bytecode })
    .send({ from: accounts[0] });

  console.log(`DEPLOY: Deployment successful @ ${result.options.address}`);
};

deploy();
