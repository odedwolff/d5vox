var User = require('../models/user');
const validator = require('express-validator');
var passwordHash = require('password-hash');
var utils = require('../utils/d5utils');

exports.register_user = function(req, res) {
    res.send('NOT IMPLEMENTED: register user');
};



exports.login_user_get = function(req, res, next) {     
  res.render('user_login', {title:"Enter User Details"} );
};


exports.login_user_post = [
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
			  { user_name: req.body.user, hash_password: passwordHash.generate(req.body.password)}
			);

			if (!errors.isEmpty()) {
			  // There are errors. Render the form again with sanitized values/error messages.
			  res.render('user_register', { title: 'See Errors', credentials:user , errors: errors.array()});
			  return;
			}
			else 
			{
				  // chech whether username is in use
				  User.findOne({ 'user_name': req.body.user}, function(err, found_usr) 
				  {
					   if (err)
					   { 
							console.log("error while searching user");
							return next(err); 
					   }
					   if (found_usr)
					   {
							const reqPass=req.body.password;
							const savedPasHash=found_usr.hash_password;
							console.log("given pass, hash=( " + reqPass + "," + savedPasHash + ")" );
							const passwordmatch=passwordHash.verify(reqPass,savedPasHash);
							if(passwordmatch){
								const sessionIdCookie = utils.generateSessionIdCookie(req.body.user);  
								found_usr.update({active_session_id: sessionIdCookie} ,(err, doc)=>
									{
										if(err){
											console.log("error while updating user");
											return next(err)
										}else{
											res.cookie('sessionId',sessionIdCookie, { maxAge: 900000, httpOnly: true });
											res.render("action_feedback", {message:"Logon done"});
										}
									}
								);
									
							}else{
								console.log("password don't match")
								res.render("action_feedback", {message:"password don't match"});
							}
						}else{
							console.log("user not found");
							res.render("action_feedback", {message:"user not found"});
						}
					   
					
				});
			}
		}
]


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
			  { user_name: req.body.user, hash_password: passwordHash.generate(req.body.password)}
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
					
					//reply with a session cookie- log the new user on 
					const sessionIdCookie = utils.generateSessionIdCookie(req.body.user);  
					user.active_session_id=sessionIdCookie;
					
					user.save(function (err) {
						if (err) { return next(err); }
						//res.send("new user added");
						res.cookie('sessionId',sessionIdCookie, { maxAge: 900000, httpOnly: true });
						res.render("action_feedback", {message:"New User Saved"});
						});
				   }

				 });
			}
		}
]


