var Author = require('../models/user');


exports.register_user = function(req, res) {
    res.send('NOT IMPLEMENTED: register user');
};


exports.login_user = function(req, res) {
    res.send('NOT IMPLEMENTED: login user');
};


exports.user_register_get = function(req, res, next) {     
  res.render('user_register', {title:"Enter User Details"} );
};


