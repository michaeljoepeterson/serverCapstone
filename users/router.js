'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('../models/userData');

const router = express.Router();

const jsonParser = bodyParser.json();

module.exports = {router};

router.post('/',jsonParser,(req,res) => {
	//check for illegal characters
	const legalChars = /^[a-zA-z0-9\{\}\<\>\[\]\+\*.,?!;\s']*$/;
	//const checkChars = legalChars.test(req.body);
	const checkChars = Object.keys(req.body).find(key =>{
		const check = legalChars.test(req.body[key]);
		if(!check){
			return req.body[key];
		}
	});
	//console.log(checkChars);
	if (checkChars){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Illegal Character",
			location: checkChars
		});
	}

	const requestFields = Object.keys(req.body).length;
	//check for the number of fields in the request object
	if (requestFields > 2){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Extra Field"
		});
	}
	const requiredFields = ['username','password'];
	const missingField = requiredFields.find(field => !(field in req.body));
	if(missingField){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Missing Field",
			location:missingField
		});
	}
	//make sure the fields are strings
	const stringFields = ['username', 'password'];
	const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

	if (nonStringField){
		return res.status(422).json({
	      code: 422,
	      reason: 'ValidationError',
	      message: 'Incorrect field type: expected string',
	      location: nonStringField
    	});
	}
	// check if the fields have spaces at beginning or end
	const explicityTrimmedFields = ['username', 'password'];
  	const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  	);

  	if (nonTrimmedField) {
	    return res.status(422).json({
	      code: 422,
	      reason: 'ValidationError',
	      message: 'Cannot start or end with whitespace',
	      location: nonTrimmedField
	    });
  }
  //check the length of the fields
  const sizedFields = {
    username: {
      min: 1,
      max: 50
    },
    password: {
      min: 10,
      max: 72
    }
  };
   const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
	//need to add other checks such as length, trim, check for string, check for illegal chars
	let {username, password} = req.body;
	return User.find({username}).count()
	.then(count => {
		if (count > 0){
			return Promise.reject({
				code:422,
				reason:"ValidationError",
				message:"Username taken",
				location:'username'
			});
		}
		return User.hashPassword(password);
	})
	.then(hash => {
		return User.create({
			username,
			password: hash
		});
	})
	.then(user =>{
		return res.status(201).json(user.serialize());
	})
	.catch(err => {
		if(err.reason === 'ValidationError'){
			return res.status(err.code).json(err);
		}
		res.status(500).json({code:500, message:'internal server error'});
	});
});