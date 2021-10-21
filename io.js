const fs = require('fs');

const PATH = __dirname + '/data';

const getPath = (name) =>`${PATH}/${name}.bc`;

const callBack = (err) => {
  if(err) {
    return console.error(err);
  }
}

const save = (data, name) => {
  fs.writeFileSync(getPath(name), JSON.stringify(data), { flag: 'w'}, callBack); 
}

const deleteBlock = (name) => {
  fs.unlink(getPath(name), callBack)
} 

const read = async (name) => {
  return JSON.parse(fs.readFileSync(getPath(name), 'utf8' , callBack));
}

const getBlockchains = () =>
  fs.readdirSync(PATH, { withFileTypes: true })
    .map(dirent => dirent.name.split('.')[0])

module.exports = {
  save,
  read,
  getBlockchains,
  deleteBlock
};