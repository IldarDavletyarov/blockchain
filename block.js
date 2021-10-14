const objectHash = require('object-hash');
const axios = require('axios');


class Block {
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
  }

  get hash() {
    return objectHash({ data: this.data, hash: this.previousHash }, { encoding: 'hex'});
  };

  async createSign() {
    const resp = (await axios.get(`http://188.93.211.195:8080/ts?digest=${this.hash}`)).data;
    this.sign = resp.timeStampToken.signature;
    this.ts = resp.timeStampToken.ts;
  } 
};

const createBlockChainFromData = async (dataList) => {
  let blockChain = [];
  let previousBlock = null;
  for(let i = 0; i < dataList.length; i++) {
    const newBlock = new Block(dataList[i], previousBlock && previousBlock.hash);
    await newBlock.createSign();
    blockChain.push(newBlock);
    previousBlock = newBlock;
  }

  return blockChain;
};

const validateBlockChain = (blockChain) => {
  previousBlock = null;
  for(let i = 0; i <  blockChain.length; i++) {
    if (!previousBlock || previousBlock.previousHash === blockChain[i].hash) {
      previousBlock = blockChain[i];
      continue;
    }
    return false;
  }
  return true;
};

module.exports = {
  createBlockChainFromData,
};

