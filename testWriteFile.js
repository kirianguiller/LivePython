fs = require('fs');

fs.writeFile("codeToRun.py", "print('hello worldddd')",function (err) {
    if (err) {
      return console.log(err);
    }
})