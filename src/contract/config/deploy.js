const assert = require('assert');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const ganache = require('ganache');
const { interface, bytecode } = require('./compile');

const INFURA_KEY_URL_SEPHORA =
  'https://sepolia.infura.io/v3/93abdfd7686a4cb39438fd13885376da';
const MNEMONNIC =
  'eight road love come predict toy ramp ivory gap improve become kit';

const provider = new HDWalletProvider(MNEMONNIC, INFURA_KEY_URL_SEPHORA);

const web3 = new Web3(provider);

const deploy = async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [] })
    .send({ from: accounts[0], gas: '1000000' });

  console.log('Attempting to deploy from account', accounts[0]);
  console.log('Contract deployed to', lottery.options.address);

  provider.engine.stop();
};

deploy();
