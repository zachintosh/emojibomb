const express = require('express')
const path = require('path')
const app = express()
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8001 })

const { Bomb, removeBombFromList } = require('./classes.js')

const avatars = ['🦖', '🏈', '🍕', '🧀', '🚗', '🐻', '🐉', '🍔', '🥑', '🍰', '🧠', '🌝', '🌈', '🍭', "✌", "😂", "😝", "😁", "😱", "👉", "🙌", "🍻", "🔥", "🌈", "☀", "🎈", "🌹", "💄", "🎀", "⚽", "🎾", "🏁", "😡", "👿", "🐻", "🐶", "🐬", "🐟", "🍀", "👀", "🚗", "🍎", "💝", "💙", "👌", "❤",, "😍", "😉", "😓", "😳", "💪", "💩", "🍸", "🔑", "💖", "🌟", "🎉", "🌺", "🎶", "👠", "🏈", "⚾", "🏆", "👽", "💀", "🐵", "🐮", "🐩", "🐎", "👃", "👂", "🍓", "💘", "💜", "👊", "💋", "😘", "😜", "😵", "🙏", "👋", "🚽", "💃", "💎", "🚀", "🌙", "🎁", "⛄", "🌊", "⛵", "🏀", "🎱", "💰", "👶", "👸", "🐰", "🐷", "🐍", "🐫", "🔫", "👄", "🚲", "🍉", "💛", "💚"]
const USERS = {}
let BOMBS = []

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(path.resolve('.', './public/index.html')))

// Broadcasts data to every connection
wss.broadcast = function broadcast(type, data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }))
    }
  });
};

wss.on('connection', ws => {
  let UID;

  ws.on('message', message => {
    data = JSON.parse(message)
    switch (data.type) {
      case 'UID':
        UID = data.UID
        USERS[UID] = { avatar: avatars[Math.floor(Math.random() * avatars.length)] }
        wss.broadcast('USER_JOINED', { avatar: USERS[UID].avatar, playerList: USERS })
        break
      case 'MOUSE_POSITION':
        USERS[UID].position = data.position
        console.log('MESSAGE', message)
        wss.broadcast('MOUSE_POSITIONS', USERS)
        break
      case 'MOUSE_CLICK':
        BOMBS.push(new Bomb(data.position, BOMBS))
        BOMBS.push(data.position)
        wss.broadcast('BOMBS', BOMBS)
        break
      }
    })
    
  ws.on('close', () => {
    wss.broadcast('USER_LEFT', { UID, avatar: USERS[UID].avatar, playerList: USERS })
  })
  
})

app.listen(8000, () => console.log('Server Started - Listening...'))

// setInterval(() => {
//   BOMBS = [];
//   wss.broadcast('CLEAR_BOMBS', BOMBS)
// }, 10000)