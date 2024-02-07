const express = require('express');
const os = require("os");
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
      const interfaceInfo = interfaces[interfaceName];
      for (const info of interfaceInfo) {
          if (info.family === 'IPv4' && !info.internal) {
              return info.address;
          }
      }
  }
  return null;
};

app.use(express.static('public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'voting', 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    connection.query('SELECT * FROM vote', (err, rows) => {
      if (err) {
        console.error('Error querying votes from MySQL:', err);
      } else {
        rows.forEach((row) => {
          candidates[row.stall - 1].votes = row.votes;
        });
        io.emit('updateVotes', candidates);
      }
    });
  }
});

const candidates = [
  { name: 'Candidate 1',stall_no: 1, votes: 0 },
  { name: 'Mahan siddhartha high school (+2)',stall_no: 2, votes: 0 },
  { name: 'Candidate 1',stall_no: 3, votes: 0 },
  { name: 'Candidate 2',stall_no: 4, votes: 0 },
  { name: 'Candidate 1',stall_no: 5, votes: 0 },
  { name: 'Candidate 2',stall_no: 6, votes: 0 },
  { name: 'Candidate 1',stall_no: 7, votes: 0 },
  { name: 'Candidate 2',stall_no: 8, votes: 0 },
  { name: 'Candidate 1',stall_no: 9, votes: 0 },
  { name: 'Candidate 2',stall_no: 10, votes: 0 },
  { name: 'Candidate 1',stall_no: 11, votes: 0 },
  { name: 'Candidate 2',stall_no: 12, votes: 0 },
  { name: 'Candidate 1',stall_no: 13, votes: 0 },
  { name: 'Candidate 2',stall_no: 14, votes: 0 },
  { name: 'Candidate 1',stall_no: 15, votes: 0 },
  { name: 'Candidate 2',stall_no: 16, votes: 0 },
  { name: 'Candidate 1',stall_no: 17, votes: 0 },
  { name: 'Candidate 2',stall_no: 18, votes: 0 },
  { name: 'Candidate 1',stall_no: 19, votes: 0 },
  { name: 'Candidate 2',stall_no: 20, votes: 0 },
  { name: 'Candidate 1',stall_no: 21, votes: 0 },
  { name: 'Candidate 2',stall_no: 22, votes: 0 },
  { name: 'Candidate 1',stall_no: 23, votes: 0 },
  { name: 'Candidate 2',stall_no: 24, votes: 0 },
  { name: 'Candidate 1',stall_no: 25, votes: 0 },
  { name: 'Candidate 2',stall_no: 26, votes: 0 }
];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('updateVotes', candidates);

  socket.on('vote', (candidateIndex) => {
    const candidate = candidates[candidateIndex - 1];
    connection.query(
      'UPDATE vote SET votes = votes + 1 WHERE stall = ?',
      [candidate.stall_no],
      (err, results) => {
        if (err) {
          console.error('Error updating votes in MySQL:', err);
        } else {
          connection.query('SELECT * FROM vote', (err, rows) => {
            if (err) {
              console.error('Error querying votes from MySQL:', err);
            } else {
              rows.forEach((row) => {
                candidates[row.stall - 1].votes = row.votes;
              });

              io.emit('updateVotes', candidates);
            }
          });
        }
      }
    );
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
server.listen(port, () => {
  try {
      
      const localIP = getLocalIP();
      console.log("\n\nServer started on port\n\n\tlocal:", `http://localhost:${port}`);
      if (localIP) {
          console.log("\texternal:", `http://${localIP}:${port}`);
      } else {
          console.log("Local IP not available.");
      }
  } catch (err) {
      console.log(err);
  }
});