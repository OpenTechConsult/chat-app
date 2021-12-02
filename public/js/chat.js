const chatForm = document.querySelector('form')
const shareLocationBtn = document.querySelector('#share-location')
//const messageInput = document.querySelector('input')
const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

socket.on('userLocation', (userLocation) => {
    console.log(userLocation)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageInput = e.target.elements.messageToBeSent.value
    socket.emit('sendMessage', messageInput)
})

shareLocationBtn.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        socket.emit('sendLocation', userLocation)
    })

})

// Goal: share coordinates with other users
// 1. Have client emit "sendLocation" with an object as the data
//      - Object should contain latitude and longitude properties
// 2. Server should listen for "sendLocation"
//      - When fired, send a "message" to all connected clients "Location: lat, long"
// 3. Test the work