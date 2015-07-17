var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('¡No existe quizId = ' + quizId + "!")); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes?search=busqueda y /quizes
exports.index = function(req, res) {
  var busqueda = req.query.search || '';  // Cadena de búsqueda
  var search; // Objeto que irá dentro de findAll
  if (busqueda === '') {
    search = {};
  } else {
    busqueda = '%' + busqueda.match(/[a-zñáéíóú]+/ig).join('%') + '%';
    search = {
      where: {
        pregunta: {
          $like: busqueda
        }
      }
    };
  }
  models.Quiz.findAll(search)
  .then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes, texto: req.query.search});
  })
  .catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
