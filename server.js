var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

const execute = require('./router/connection');
var routerVentas = require('./router/routerVentas');
var routerUsers = require('./router/routerUsers');
var routerTipoDocs = require('./router/routerTipoDocs');
var routerPedidos = require('./router/routerPedidos');
var routerEmpleados = require('./router/routerEmpleados');
var routerClientes = require('./router/routerClientes');

var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || 9090;

app.use(bodyParser.json());

app.use(express.static('APP'));

var path = __dirname + '/'

//manejador de rutas
router.use(function (req,res,next) {
  /*
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, pplication/json');
        // Set to true if you need the website to include cookies in the requests sent
      res.setHeader('Access-Control-Allow-Credentials', true);
*/
  console.log("/" + req.toString());
  next();
});

app.get("/",function(req,res){
  execute.start();
	res.sendFile(path + 'index.html');
}); 

app.get("/api/index",function(req,res){
  
	res.sendFile(path + '/APP/VENTAS/index.html');
}); 


//Router para app VENTAS
app.use('/ventas', routerVentas);

//Router para usuarios
app.use('/usuarios', routerUsers);

// Router para Tipodocumentos
app.use('/tipodocumentos', routerTipoDocs);

// Router para pedidos en linea
app.use('/pedidos', routerPedidos);

// Router para empleados o vendedores
app.use('/empleados', routerEmpleados);

// Router para clientes
app.use('/clientes', routerClientes);


app.get("/reload",function(req,res){

  let sucursal = req.query.sucursal;
  let msg = req.query.msg;

  
  io.emit('ventas reload', msg, sucursal);
  res.send('200');

}); 


app.use("/",router);

app.use("*",function(req,res){
  res.send('<h1 class="text-danger">NO DISPONIBLE</h1>');
});


// SOCKET HANDLER
io.on('connection', function(socket){
  
  socket.on('ventas nueva', function(msg,sucursal){
    
	  io.emit('ventas nueva', msg, sucursal);
  });
  
});



http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

/*
app.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});
*/
