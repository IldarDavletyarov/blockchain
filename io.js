const fs = require('fs');

const PATH = __dirname + '/data';

const save = (data, name) => {
  fs.writeFileSync(`${PATH}/${name}.bc`, JSON.stringify(data), { flag: 'w'}, function(err) {
    if(err) {
        return console.error(err);
    }
  }); 
}

const read = async (name) => {
  return JSON.parse(fs.readFileSync(`${PATH}/${name}.bc`, 'utf8' , (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  }));
}

const getBlockchains = () =>
  fs.readdirSync(PATH, { withFileTypes: true })
    .map(dirent => dirent.name.split('.')[0])

module.exports = {
  save,
  read,
  getBlockchains,
};