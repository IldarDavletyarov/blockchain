const objectHash = require('object-hash');
const axios = require('axios');


class Block {
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
  }

  get hash() {
    return createHash(this.data, this.previousHash);
  };

  async createSign() {
    const resp = (await axios.get(`http://188.93.211.195:8080/ts?digest=${this.hash}`)).data;
    this.sign = resp.timeStampToken.signature;
    this.ts = resp.timeStampToken.ts;
  } 
};

const createHash = (data, previousHash) => objectHash({ data: data, hash: previousHash }, { encoding: 'hex'})

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

const verify = (blockChain) => {
  console.log('blockchain',blockChain[0]);
  previousBlockHash = createHash(blockChain[0].data, blockChain[0].previousHash);
  for(let i = 1; i < blockChain.length; i++) {
    const block = blockChain[i];
    console.log('block', block);
    if (previousBlockHash !== block.previousHash) {
      console.log(previousBlockHash, block);
      return false;
    }
    previousBlockHash = createHash(block.data, block.previousHash);
  }
  return true;
};

module.exports = {
  createBlockChainFromData,
  verify,
};

