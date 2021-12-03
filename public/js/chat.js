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
    socket.emit('sendMessage', messageInput, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('The message was delivered!')
    })
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
        socket.emit('sendLocation', userLocation, () => {
            console.log('Location shared!')
        })
    })

})

// Goal: Setup acknowledgment
//
// 1. Setup the client acknowledgment function
// 2. Setup the server to send back the acknowledgment
// 3. Have the client print "Location shared!" when acknowledgment
// 4. Test your work