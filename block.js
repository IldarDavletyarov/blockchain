const objectHash = require('object-hash');
const axios = require('axios');
const rs = require('jsrsasign');
// parsePublicPKCS8Hex
const publicKey = rs.KEYUTIL._getKeyFromPublicPKCS8Hex(`30819f300d06092a864886f70d010101050003818d0030818902818100a811365d2f3642952751029edf87c8fa2aeb6e0feafcf800190a7dd2cf750c63262f6abd8ef52b251c0e10291d5e2f7e6682de1aae1d64d4f9b242050f898744ca300a44c4d8fc8af0e7a1c7fd9b606d7bde304b29bec01fbef554df6ba1b7b1ec355e1ff68bd37f3d40fb27d1aa233fe3dd6b63f7241e734739851ce8c590f70203010001`);

console.log(publicKey);


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

const getTs = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}T0${now.getHours()}:${now.getMinutes()}.${now.getMilliseconds()}+03`;
}

const verify = (blockChain) => {
  previousBlockHash = createHash(blockChain[0].data, blockChain[0].previousHash);
  for(let i = 1; i < blockChain.length; i++) {
    const block = blockChain[i];
    if (previousBlockHash !== block.previousHash) {
      return false;
    }
    previousBlockHash = createHash(block.data, block.previousHash);

    const sig = new rs.Signature({alg: 'SHA256withRSAandMGF1'});
    sig.init(publicKey);
    console.log(getTs()+previousBlockHash)
    sig.updateHex(getTs()+previousBlockHash);

    console.log('TEST', sig.verify(block.sign));
    // console.log(previousBlockHash);
    // console.log(block.sign);
  }
  return true;
};

module.exports = {
  createBlockChainFromData,
  verify,
};

