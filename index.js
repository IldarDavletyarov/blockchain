const inquirer = require('inquirer');
const block = require('./block');
const io = require('./io');

const choicesObjectMenu = {
  'Create blockchain': createBlockChainFromLine,
  'List of blockchains': readBlockChains,
  'Exit': () => {},
};

const choicesObjectReadMenu = {
  'Verify': verify,
};


function verify(blockChain) {
  block.verify(blockChain) 
  ? console.log('\x1b[32m', 'Successful verification!\n')
  : console.log('\x1b[31m', 'Failed verification!\n');
}


async function createBlockChainFromLine() {
  inquirer
  .prompt([
    {
      name: 'name',
      message: 'Write name of blockchain',
    },
    {
      name: 'data',
      message: 'Write data via comma\n',
    },
  ])
  .then(async answers => {
    const data = answers.data.split(',');

    const blockchain = await block.createBlockChainFromData(data);

    io.save(blockchain, answers.name);

    console.log('Success created!\n');
    start();
  });
};

async function readBlockChains() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'block',
      message: 'List of blockchains',
      choices: io.getBlockchains(),
    },
  ])
  .then(async answers => {
    const block = await io.read(answers.block);
    console.log(block);
    inquirer.prompt([
      {
        type: 'list',
        name: 'menu',
        message: `What you want with ${answers.block}`,
        choices: Object.keys(choicesObjectReadMenu)
      },
    ]).then(async answers => {
      choicesObjectReadMenu[answers.menu](block);
      start();
    })
  });
}

const start = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'Hello to blockchain/v1\n',
      choices: Object.keys(choicesObjectMenu),
    },
  ])
  .then(async answers => {
    await choicesObjectMenu[answers.menu]();
  });
};

start();