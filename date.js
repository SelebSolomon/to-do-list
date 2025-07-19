
function getDate() {
    
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }
        const date = new Date()
        let day = date.toLocaleDateString("en-US", options)
        return(day)
}

module.exports = getDate