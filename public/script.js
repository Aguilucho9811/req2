const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('ingresa un nickname?')
appendMessage('Te has unido')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  console.log(data)
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`Tú: ${message}`, true);
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message, isOutgoing = false) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add(isOutgoing ? 'outgoing' : 'incoming');
  messageContainer.append(messageElement);
}
