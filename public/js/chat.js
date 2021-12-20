const chatForm = document.querySelector('form')
const shareLocationBtn = document.querySelector('#share-location')
const messageFormInput = document.querySelector('input')
const messageFormBtn = document.querySelector('#sendMessageBtn')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

const socket = io()

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, { 
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
     })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
     })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('userLocation', (userLocation) => {
    console.log(userLocation)
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', {username, room}, (error) => { 
    if(error) {
        alert(error)
        location.href = '/'
    }
    console.log('Joined!')
})
