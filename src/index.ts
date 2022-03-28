import { server } from './server'

const PORT = process.env.PORT || 3000

async function onListening() { () => (`Listening on port ${PORT}`);
}

server.listen(PORT, onListening);