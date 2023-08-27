const assert = require('assert');
const ganache = require('ganache');
const { Web3, utils } = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let lottery;

describe('Lottery', () => {
  before(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
        arguments: []
      })
      .send({ from: accounts[0], gas: '1000000' });
    await lottery.methods.participate().send({
      from: accounts[1],
      value: utils.toWei('0.1', 'ether'),
      gas: 100000
    });

    await lottery.methods.participate().send({
      from: accounts[4],
      value: utils.toWei('0.1', 'ether'),
      gas: 100000
    });

    await lottery.methods.participate().send({
      from: accounts[2],
      value: utils.toWei('0.1', 'ether'),
      gas: 100000
    });

    await lottery.methods.participate().send({
      from: accounts[3],
      value: utils.toWei('0.1', 'ether'),
      gas: 100000
    });
    const participant = await lottery.methods.getParticipant().call();
    console.log({ participant });
  });

  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows multiple account to enter', async () => {
    const participant = await lottery.methods.getParticipant().call();
    console.log({ participant });
    assert.equal(accounts[1], participant[0]);
    assert.equal(accounts[4], participant[1]);
    assert.equal(accounts[2], participant[2]);
    assert.equal(accounts[3], participant[3]);
    assert.equal(4, participant.length);
  });

  it('can t pick winner if not manager', async () => {
    try {
      const data = await lottery.methods.pickWinner().send({
        from: accounts[1],
        gas: '1000000'
      });
      console.log({ data });
      assert(false);
    } catch (err) {
      console.log({ err });
      assert.ok(err);
    }
  });

  it('can pick winner if manager', async () => {
    try {
      const data = await lottery.methods.pickWinner().send({
        from: accounts[0],
        gas: '1000000'
      });
      console.log({ data });
      assert(true);
    } catch (err) {
      console.log({ err });
      assert(false);
    }
  });

  it('cant pick winner if participant[] is empty', async () => {
    try {
      const data = await lottery.methods.pickWinner().send({
        from: accounts[0],
        gas: '1000000'
      });
      console.log({ data });
      assert(false);
    } catch (err) {
      console.log({ err });
      assert.ok(err);
    }
  });

  it('require minimum of ether to participate', async () => {
    try {
      await lottery.methods.participate().send({
        from: accounts[0],
        value: utils.toWei('0.001', 'ether')
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it('send money to the winner, reset array', async () => {
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    let participant = await lottery.methods.getParticipant().call();
    console.log({ participant });

    await lottery.methods.participate().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether')
    });
    participant = await lottery.methods.getParticipant().call();
    console.log({ participant });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    participant = await lottery.methods.getParticipant().call();
    console.log({ participant });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    console.log({
      initialBalance,
      finalBalance__: finalBalance,
      diff: initialBalance - finalBalance
    });
    assert(initialBalance - finalBalance > 0);
  });
});
