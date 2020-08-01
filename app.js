const path = require('path')

fs = require('fs');

const express = require('express')

const {spawn} = require('child_process');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'node_modules')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // socket.emit('message', 'Vous êtes bien connecté !');
    socket.on('newCodeText', (newCodeText) => {
        console.log(newCodeText);
        socket.broadcast.emit("newCodeText", newCodeText)
      });
    socket.on("clickRun", (codeToRun) => {
      console.log("codeToRun", codeToRun)
      fs.writeFile("codeToRun.py", codeToRun, function (err) {
        if (err) {
          return console.log(err);
        }
      });
      var dataToSend;
      const python = spawn('python', ['codeToRun.py']);
      python.stdout.on('data', function (data) {
        console.log("data", data)
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend)
      });
      python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        io.sockets.emit("out", dataToSend || "")
      })
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});