const fs = require('fs');

const PATH = __dirname + '/data';

const save = (data, name) => {
  fs.writeFileSync(`${PATH}/${name}.json`, JSON.stringify(data), { flag: 'w'}, function(err) {
    if(err) {
        return console.error(err);
    }
  }); 
}

const read = (name) => {
  let result;
  fs.readFile(`${PATH}/${name}.json`, 'utf8' , (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    result = JSON.parse(data);
  })
  return result;
}

module.exports = {
  save,
  read,
};