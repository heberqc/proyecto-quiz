// Devuelve las horas, minutos y segundos actuales en un objeto
function getTime() {
  var now = new Date();
  return {
    h: now.getHours(),
    m: now.getMinutes(),
    s: now.getSeconds()
  };
}

// Convierte la hora en un número de la forma HHMMSS
function num_tiempo(tiempo) {
  return tiempo.h * 10000 + tiempo.m * 100 + tiempo.s;
}

// Compara la hora de la última actividad con la hora actual y devuelve
// false cuando la diferencia de horas es mayor a 2 minutos
function control_tiempo(ultimaActividad) {
  var out = true;
  var tiempo_actual = getTime();
  if (num_tiempo(tiempo_actual) - num_tiempo(ultimaActividad) > 200) {
    out = false;
  }
  return out;
}

// MW que cierra la sesión cuando han pasado 2 minutos desde la última actividad
exports.autoLogout = function(req, res, next) {
  if (req.session.user) {
    if (!control_tiempo(req.session.user.lastTime)) {
      delete req.session.user;
      req.session.errors = [{"message": 'La sesión ha expirado luego de 2 minutos'}];
    }
  }
  next();
};

// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
    req.session.user.lastTime = getTime();
    next();
  } else {
    res.redirect('/login');
  }
};

// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se auténtica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
            return;
        }

        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {
          id:user.id,
          username:user.username,
          lastTime: getTime()
        };

        res.redirect(req.session.redir.toString() || '/');// redirección a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};
