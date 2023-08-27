console.log('Recompiling...');

const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    lottery: {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

console.log({
  compiledErrors: solc.compile(JSON.stringify(input)).compiled?.error,
  parsedError: JSON.parse(solc.compile(JSON.stringify(input))).errors
});

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'lottery'
].Lottery;

console.log('Recompiled !');
