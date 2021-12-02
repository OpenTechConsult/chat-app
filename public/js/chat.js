const chatForm = document.querySelector('form')
//const messageInput = document.querySelector('input')
const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageInput = e.target.elements.messageToBeSent.value
    socket.emit('sendMessage', messageInput)
})