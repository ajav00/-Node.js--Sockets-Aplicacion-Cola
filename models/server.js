const express = require('express');
const cors = require('cors');
const { socketController } = require('../sockets/controllers');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS 
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio Público
        this.app.use(express.static('public'));
    }

    sockets(){
        this.io.on('connection', socketController );
    }

    routes(){
        // this.app.use(this.paths.auth, require('../routes/auth'));
        
    }

    listen(){
        this.server.listen(this.port, ()=>{
            console.log("Servidor corriendo en puerto", this.port);
        });
    }

}

module.exports = Server;