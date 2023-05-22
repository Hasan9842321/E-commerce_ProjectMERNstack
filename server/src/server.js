const app = require('./app');
const serverPort = require('./secret');

app.listen(serverPort, () => {
    console.log(`server is tunning at http://localhost:${serverPort}`)
})