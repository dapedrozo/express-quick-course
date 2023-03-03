//server de express
//usar el modulo nodemon para mantener el debugg true y para usarlo en la consola se tipea npx nodemon index.js

const express = require('express');
const morgan = require('morgan');
const app = express();

//configuraciones de express
//las configs se pasan con el parametro .set, para hacerlo rapido el primer parametro es el nombre de la variable y el segundo parametro es el valor de la variable
//ej una config que especifique el name de mi applicacion
//puedo ver esto por consola si en el listen del server le digo que me imprima desde el get, el nombre de la variable en este caso appName
app.set('appName','ExpressCourse');
//config el puerto
app.set('port',3000);
//config el motor de plantillas, para esto hay que instalar npm i ejs pero no hace falta importarlo
//es lo mismo que jinja solo que este es de express
//para usarlo se crea una carpeta llamada de alguna forma en este caso views y se crea un archivo .ejs y la estructura es igual a html5
//hay otro motor de plantillas que se llama handlebars que es literalmente el mismo de flask
app.set('view engine','ejs');


//middlewares
app.use(express.json());
//explicacion middlewares
//esta funcion va a registrar las peticiones que lleguen al server, una vez recibimos la peticion queremos continuar con el resto de rutas entonces reqeurimos 3 datos, un req,res y next, un middleware por tanto es solo un manejador de peticion que podemos ejecutar antes de que llegue a la ruta original, es parecido a app.all() pero ese metodo solo sirve para 1 ruta por ejemplo todas las rutas user pero solo user, el middleware sirve para todas las rutas que creemos, y luego una vez creado el middleware lo ejecutamos debajo del app.use(express.json()), siempre se llama con el app.use, por ejemplo con el middleware podemos hacer una validacion de cada usuario antes de que llegue a una ruta
//ojo todo lo que sea req es informacion del navegador que hace la peticion, todo lo que sea res es informacion de lo que el server devuelve al navegador
//por ejemplo un middleware para obtener informacion de la peticion de las personas se llama morgan (buscar como morgan npm)
//se instala normal npm i morgan
/*
function logger(req,res,next){
    //ejemplo de imprimir que ruta esta solicitando el usuario desde el navegador
    console.log(`Ruta recibida: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}
app.use(logger);
*/

//ejemplo de track de peticiones con morgan
//hay middleware para autenticacion, para subir datos, para cargar imagenes, etc.
app.use(morgan('dev'));

//all es funcion de express para hacer algo antes de que llegue una peticion a una ruta especifica, por ejemplo para todas las rutas user quiero que haga mostrar por consola "por aqui paso" por ejemplo, y necesita de los metodos req y res para hacerlo en la solicitud y la respuesta, si le ponemos un res.end() lo que hara es qeu finalizara ahi y todas las respuestas de la ruta user seran esa, si queremos que continue a otra funcion con el metodo http especifico debemos pasarle un parametro next a la funcion y despues llamarlo
app.all('/user',(req,res,next)=>{
    console.log('por aqui paso');
    next();
});

/*
app.get('/',(req,res)=>{
    res.send('peticion get recibida');
})
*/

//rutas
//utilizando el motor de plantillas de ejs
//este motor es igual al de flask, tenemos por ejemplo el resultado de una consulta a bd y se lo pasamos a la plantilla solo que se lo pasamos como un json y la variable people en este caso tiene todos los datos de data
app.get('/',(req,res)=>{
    const data = [{name:"jhon"},{name:"pim"},{name:"pam"}];
    res.render('index.ejs', {people:data});
})

app.get('/user',(req,res)=>{
    res.json({
        name:"cameron",
        lastname:"howe"
    });
})

app.post('/user',(req,res)=>{
    console.log(req.body);
    res.send('recibido');
})

//generar rutas dinamicas, para recibir un id por ejemplo, se hace con : y un nombre de variable
app.post('/user/:id',(req,res)=>{
    //req.body es lo que llega de informacion del lado del cliente
    console.log(req.body);
    //permite capturar la info de la url o de otras fuentes
    console.log(req.params)
    res.send('recibido');
})

app.delete('/user/:userId',(req,res)=>{
    //las comillas de javascript se utilizan para concatenar texto y codigo javascript, en este caso se une el rexto y el ID que viene de la url para indicar que ha sido eliminado
    res.send(`el usuario ${req.params.userId} ha sido eliminado`);
})

app.put('/user/:userId',(req,res)=>{
    console.log(req.body);
    console.log(req.params);
    res.send(`el usuario ${req.params.userId} ha sido actualizado`);
})

app.post('/about',(req,res)=>{
    res.send('peticion post recibida');
})

app.put('/contact',(req,res)=>{
    res.send('peticion put recibida');
})

app.delete('/test',(req,res)=>{
    res.send('<h1>peticion delete recibida</h1>');
})

//middleware para enviar html al front archivos html, css y javascript, este middle se escribe casi al final porqeu primero tiene que pasar por todas las rutas previamente si no encuentra la rura por ejemplo en este caso la ruta raiz, si no la encuentra entonces entra a este middleware
//como parametro le damos el nombre de una carpeta que creemos, en este caso se llamara public
app.use(express.static('public'));

app.listen(app.get('port'), ()=>{
    console.log(app.get('appName'));
    console.log('server on port',app.get('port'));
})

/* server basico de node
const http = require('http');
const server = http.createServer((req,res)=>{
    res.status = 200;
    res.setHeader('Content-Type', 'text/plai');
    res.end('Hello');
});
server.listen(3000,()=>{
    console.log('server on port 3000');
})
*/