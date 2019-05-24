function updatePlayerList(playerList) {
  const list = document.getElementById('player-list')

  list.innerHTML = '<div class="players-label">Players</div>';

  Object.entries(playerList).forEach(([UID, client]) => {
    const div = document.createElement('div')
    div.textContent = client.avatar
    list.appendChild(div)
  })
}