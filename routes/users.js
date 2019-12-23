var express = require('express');
var router = express.Router();


var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', user_controller.login_user_get);

router.post('/login', user_controller.login_user_post);


//just for testing stuff 
router.get('/register_old', user_controller.register_user);


router.get('/register', user_controller.user_register_get); 

router.post('/register', user_controller.user_register_post); 

router.post('/logout', user_controller.user_logout_post); 


module.exports = router;
