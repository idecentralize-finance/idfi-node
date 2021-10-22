require('dotenv').config()
const url = require('url')
const path = require('path')
const express = require('express')
const exp = express();
const http = require('http');
const server = http.createServer(exp);
const { Server } = require("socket.io")
const io = new Server(server)

const midNode = function (node){  
    console.log("\x1b[32m%s\x1b[0m",'--------------------- NODE ---------------------');

    
  
       const app = new express();
       const midPort = process.env.PORT
       const midHost = process.env.HOST
  
       app.use(function(req, res, next) {
           res.header("Access-Control-Allow-Origin", "*");
           res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
           next();
          });
  
       app.get('/ping', function(req, res){  
            console.log('PING');
            console.log("\x1b[32m%s\x1b[0m",'Registering Node');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader('Content-Type', 'application/json');
            res.jsonp(node);
            return;
           })
  
           startLocalDaemon()   
        app.listen(midPort, midHost, () => {
          console.log("\x1b[32m%s\x1b[0m",`listening ${midHost} on port : `, midPort);
        }) 
      }
  




      const keepDaemonAlive = (socket) => {
        const response = new Date();
        console.log('Keep Alive')
        socket.emit("heartbeat", response);
      };
      
      
      
      
      const startLocalDaemon = () =>{
        let interval
        io.on('connection', (socket) => {  
          console.log('Client connected');
          if (interval) {
            clearInterval(interval);
          }
          interval = setInterval( () => keepDaemonAlive(socket), 1000);
          socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(interval);
          });
      
      
        });
      
      
      }
  
      module.exports = {
        midNode,
        startLocalDaemon
      };