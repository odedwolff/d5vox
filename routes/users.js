var express = require('express');
var router = express.Router();


var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', user_controller.login_user);

//just for testing stuff 
router.get('/register_old', user_controller.register_user);


router.get('/register', user_controller.user_register_get); 



module.exports = router;
