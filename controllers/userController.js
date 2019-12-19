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
			var sessionIdCookie;
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
				User.findOne({ 'user_name': req.body.user}).
				then(
					function (foundOne){
						 //user not found
						 if(foundOne==null){
							res.render("action_feedback", {message:"user not found"});
							return null;
						 }
						  //compare passwords
						const reqPass=req.body.password;
						const savedPasHash=foundOne.hash_password;
						const passwordmatch=passwordHash.verify(reqPass,savedPasHash);
						if(!passwordmatch){
							res.render("action_feedback", {message:"password don't match"});
							return null;
						}
						sessionIdCookie = utils.generateSessionIdCookie(req.body.user);  
						console.log("sessionIdCookie=" + sessionIdCookie);
						
						//return foundOne.update({active_session_id: sessionIdCookie})
						foundOne.active_session_id=sessionIdCookie;
						return foundOne.save(); 
					  
					},
					function(err){
						console.log("error=" + err);
						res.render("action_feedback", {message:"error on user search"});
					}
				).then(
					function(args){
						if(args==null){
							return;
						}
						res.cookie('sessionId',sessionIdCookie, { maxAge: 900000, httpOnly: false });
						res.render("action_feedback", {message:"updated objects, callback sent args" + args});
					},
					function(err){
						res.render("action_feedback", {message:"error on object update" + err});
					}
				);
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
						res.cookie('sessionId',sessionIdCookie, { maxAge: 900000, httpOnly: false });
						res.render("action_feedback", {message:"New User Saved"});
						});
				   }

				 });
			}
		}
]


