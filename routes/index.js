var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', sessionController.autoLogout, function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId
router.param('commentId', commentController.load);  // autoload: commentId

// Defición de rutas de sesión
router.get('/login',  sessionController.new);  // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas de /quizes
router.get('/quizes', sessionController.autoLogout, quizController.index);
router.get('/quizes/:quizId(\\d+)', sessionController.autoLogout, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', sessionController.autoLogout, quizController.answer);
router.get('/quizes/new', sessionController.autoLogout, sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.autoLogout, sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.autoLogout, sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.autoLogout, sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.autoLogout, sessionController.loginRequired, quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.autoLogout,
  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', sessionController.autoLogout,
  commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
  sessionController.autoLogout, sessionController.loginRequired,
  commentController.publish);

// Definición de ruta de créditos
router.get('/author', sessionController.autoLogout,
  function(req, res) {
    res.render('author', { errors: [] });
  }
);

module.exports = router;
