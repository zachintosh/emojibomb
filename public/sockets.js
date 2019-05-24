const socket = new WebSocket(`ws://${window.location.hostname}:8001`)
const UID = window.localStorage.getItem('UID') || Math.random();
window.localStorage.setItem('UID', UID)

class Bomb {
  constructor({id, x, y, exploded}) {
    let div = document.getElementById(id)

    if (!div) {
      div = document.createElement('div');
      div.id = id;
      div.classList.add('bomb')
      div.style.position = 'absolute'
      div.style.width = '20px'
      div.style.height = '20px'
      div.style.borderRadius = '20px'
      div.style.userSelect = 'none';
      div.style.zIndex = '-1'
      document.body.appendChild(div)
    }
    this.icon = div;
    if (exploded) div.classList.add('exploded')
    div.style.left = `${exploded ? `calc(${x}px - 30pt)` : x}px`
    div.style.top = `${exploded ? `calc(${y}px - 30pt)` : y}px`
    div.textContent = exploded ? '💥': '💣'
    div.style.fontSize = exploded ? '50pt' : '20pt'

    if (exploded && div) setTimeout(() => {
      document.body.removeChild(div)
    }, 1000)
  }
}


const CURRENT_MOUSE_POSITON = {}

// Notify us whenever a new connection is opened
socket.addEventListener('open', event => {
  console.log('%cSocket opened at ' + event.target.url, 'color: green')
  socket.send(JSON.stringify({type: 'UID', UID}))
  MESSAGE_GATE_OPEN = true;
})

socket.addEventListener('message', event => {
  const message = JSON.parse(event.data)

  switch (message.type) {

    case 'USER_JOINED':
      toast(`${message.data.avatar} has joined!`)
      updatePlayerList(message.data.playerList)
      break
      
    case 'USER_LEFT':
      updatePlayerList(message.data.playerList)
      break
      
    case 'BOMBS':
      console.log(message.data);
      // [...document.querySelectorAll('.bomb')].forEach(x => x.parentElement.removeChild(x))
      message.data.forEach((bomb) => {
        !bomb.dead && new Bomb(bomb)
      })
      break

    case 'MOUSE_POSITIONS':
      Object.entries(message.data).forEach(([_UID, client]) => {
        let div = document.getElementById(_UID)

        if (!div) {
          div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.width = '20px'
          div.style.height = '20px'
          div.style.borderRadius = '20px'
          div.textContent = client.avatar
          div.id = _UID
          div.style.userSelect = 'none'
          div.style.fontSize = '25pt'
          document.body.appendChild(div)
        }
        if (div.textContent !== client.avatar) {
          div.textContent = client.avatar
        }

        if (UID !== _UID) {
          div.style.left = `${client.position.x}px`
          div.style.top = `${client.position.y}px`
        } else {
          div.style.left = `${CURRENT_MOUSE_POSITON.x}px`
          div.style.top = `${CURRENT_MOUSE_POSITON.y}px`
        }

        return div
      })
      break
  }
  
})

document.addEventListener('mousemove', event => {
  CURRENT_MOUSE_POSITON.x = event.x;
  CURRENT_MOUSE_POSITON.y = event.y;
  socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({
    type: 'MOUSE_POSITION',
    UID,
    position: {
      x: event.x,
      y: event.y
    }
  }))
})

document.addEventListener('mousedown', event => {
  socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({
    type: 'MOUSE_CLICK',
    UID,
    position: {
      x: event.x,
      y: event.y
    }
  }))
})