import express,{Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

/*
* Clase de inicio de nuestra aplicación NodeJsExpress
* Autor: Elizabeth Gutierrez Olvera
* Fecha: 28 de febrero de 2024
*/

class Server{
    private app:Application;

    //Inicializa clase
    constructor(){
        this.app=express();
        this.config();
        this.routes();
        this.app.listen(this.app.get("port"), ()=>{
            console.log("Server on port", this.app.get("port"));
        });

    }

    //Configuración de módulos
    config():void{
        //configuración del puerto para el servidor
        this.app.set("port",3000);

        //muestra las peticiones en consola
        this.app.use(morgan("dev"));

        //Puertos de conexion de la API
        this.app.use(cors());

        //Solo se permiten peticiones en formato JSON
        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({extended:false}));
    }

    //Configuración de las rutas
    routes(){

    }

}

const server = new Server();