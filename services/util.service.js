export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    loadFromStorage,
    saveToStorage,
    animateCSS,
    timeAgo
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color' ,'of nature', 'tuned', 'to', 'a live channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)]
        if (size >= 1 ) txt += ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function animateCSS(el, animation='bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function timeAgo(msDate) {
	const now = Date.now()
	const elapsed = now - msDate

	const seconds = Math.floor(elapsed / 1000)
	const minutes = Math.floor(elapsed / (1000 * 60))
	const hours = Math.floor(elapsed / (1000 * 60 * 60))
	const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))

	if (seconds < 60) {
		return "a few seconds ago"
	} else if (minutes < 60) {
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
	} else if (hours < 24) {
		return `${hours} hour${hours === 1 ? "" : "s"} ago`
	} else if (days === 1) {
		return "a day ago"
	} else if (days < 7) {
		return "a few days ago"
	} else {
		const date = new Date(msDate)
		const day = String(date.getDate()).padStart(2, "0")
		const month = String(date.getMonth() + 1).padStart(2, "0") // Months are 0-based
		const year = date.getFullYear()
		return `${day}/${month}/${year}`
	}
}