var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar definición de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.bulkCreate([
        {
          pregunta: 'Capital de Italia',
          respuesta: 'Roma',
          tema: 'otro'
        },
        {
          pregunta: 'Escudero de Don Quijote de La Mancha',
          respuesta: 'Sancho Panza',
          tema: 'humanidades'},
        {
          pregunta: 'Fundador de la Free Software Foundation',
          respuesta: 'Richard Stallman',
          tema: 'tecnologia'
        },
        {
          pregunta: 'Inventor de la dinamita',
          respuesta: 'Alfred Nobel',
          tema: 'ciencia'
        },
        {
          pregunta: 'Capital de Timor oriental',
          respuesta: 'Dili',
          tema: 'otro'
        },
        {
          pregunta: 'Hija del almirante Daelin Proudmoore',
          respuesta: 'Jaina Proudmoore',
          tema: 'ocio'
        },
        {
          pregunta: 'Masa/Volumen',
          respuesta: 'Densidad',
          tema: 'ciencia'
        },
        {
          pregunta: 'Verdadero nombre del Conde de Montecristo',
          respuesta: 'Edmundo Dantès',
          tema: 'humanidades'
        },
        {
          pregunta: 'Líder y fundador de la banda Led Zeppelin',
          respuesta: 'Jimmy Page',
          tema: 'ocio'
        }
      ]).then(function(){console.log('Base de datos inicializada')});
    };
  });
});
