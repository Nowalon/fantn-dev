module.exports = {
    url : process.env.NODE_ENV === 'development' ?
        'http://localhost:5000' : 'http://fantn-web-staging.herokuapp.com',
    waitTime : 5000
}
