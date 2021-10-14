const block = require('./block');
const io = require('./io');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const _ = require('lodash');
const charm = require('charm')(process.stdout);

let selected = 0;

const createBlockChainFromLine = async () => {
  rl.question('Write data splitted via comma \n', async (answer) => {
    const data = answer.split(',');

    const blockchain = await block.createBlockChainFromData(data);

    console.log(blockchain);
    io.save(blockchain, new Date().getTime());
    rl.close();
  });
};

const readBlockChains = async () => {

}

const choicesObject = {
  "create blockchain": createBlockChainFromLine,
  "read blockchains": readBlockChains,
};

const choices = Object.keys(choicesObject);


function renderChoices() {
  choices.forEach(function( choice, i ) {
    charm.foreground("cyan");
    charm.write("[" + (i === selected ? "X" : " ") + "] ");
    (i !== selected) && charm.foreground("white");
    charm.write(choice + "\r\n");
    charm.foreground("white");
  });
}

process.stdin.on('keypress', function(s, key) {
  if( key.name === "up" && (selected - 1) >= 0 ) {
    selected--;
  } else if( key.name === "down" && (selected + 1) < choices.length ){
    selected++;
  } else {
    return; // don't render if nothing changed
  }
  charm.erase("line");
  choices.forEach(function() {
    charm.up(1);
    charm.erase("line");
  });
  renderChoices();
});

renderChoices();

rl.on('line', async function(line) {
  await choicesObject[choices[selected]]()
  // charm.write("You choosed: " + choices[selected] + "\r\n");
}).on('close', function() {
  console.log('Have a great day!');
  rl.close();
  process.exit(0);
});
