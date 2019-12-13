var User = require('../models/user');
const validator = require('express-validator');


exports.register_user = function(req, res) {
    res.send('NOT IMPLEMENTED: register user');
};


exports.login_user = function(req, res) {
    res.send('NOT IMPLEMENTED: login user');
};


exports.user_register_get = function(req, res, next) {     
  res.render('user_register', {title:"Enter User Details"} );
};


exports.user_register_post = [
	validator.body('user', 'user name required').isLength({ min: 1 }).trim(),
	
	
	validator.body('password', 'password required').isLength({ min: 1 }).trim(),
	// Sanitize (escape) the name field.
	
	validator.sanitizeBody('name').escape(),

	(req, res, next) => 
		{

			// Extract the validation errors from a request.
			const errors = validator.validationResult(req);

			// Create a genre object with escaped and trimmed data.
			var user = new User(
			  { user_name: req.body.user, hash_password:req.body.password}
			);

			if (!errors.isEmpty()) {
			  // There are errors. Render the form again with sanitized values/error messages.
			  res.render('user_register', { title: 'See Errors', credentials:user , errors: errors.array()});
			  return;
			}
			else {
			  // chech whether username is in use
			  User.findOne({ 'user_name': req.body.user })
				.exec( function(err, found_usr) {
				   if (err) { return next(err); }

				   if (found_usr)
				   {
					 // Genre exists, redirect to its detail page.
					 //res.redirect(found_usr.url);
					  res.render('user_register', { title: 'See Errors', credentials:user , plainError: "user name already in use, please choose another"});
					  return;
				   }
				   else 
				   {
					 user.save(function (err) {
						if (err) { return next(err); }
						res.send("new user added");
						});
				   }

				 });
			}
		}
]


