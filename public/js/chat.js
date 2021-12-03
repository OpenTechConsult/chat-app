const chatForm = document.querySelector('form')
const shareLocationBtn = document.querySelector('#share-location')
const messageFormInput = document.querySelector('input')
const messageFormBtn = document.querySelector('#sendMessageBtn')
const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

socket.on('userLocation', (userLocation) => {
    console.log(userLocation)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    messageFormBtn.setAttribute('disabled', 'disabled')
    const messageInput = e.target.elements.messageToBeSent.value
    socket.emit('sendMessage', messageInput, (error) => {
        messageFormBtn.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
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
    // disable
    shareLocationBtn.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        socket.emit('sendLocation', userLocation, () => {
            shareLocationBtn.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })

})

// Goal: Disable the send location button while location being sent
//
// 1. Setup a selector at the top of the file ✔️
// 2. Disable the button just before getting the current position ✔️
// 3. Enable the button in the acknowledgment callback ✔️
// 4. Test your work ✔️