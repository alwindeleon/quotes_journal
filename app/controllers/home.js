const express = require('express');
const router = express.Router();
const db = require('../models');
const Sequelize = require('sequelize');

module.exports = (app) => {
  app.use('/', router);
};

let auth = function(req, res, next){
  if(req.session && req.session.user){
    next();
  } else {
    return res.redirect('/login');
  }

};

router.get('/', (req, res, next) => {
  return res.redirect('/login');
});

router.get('/login', (req, res, next) => {
    return res.render('login');
});

router.get('/logout',function(req, res, next){
  req.session.destroy();
  res.redirect('/login')
});

router.get('/register', (req, res, next) => {
    return res.render('registration');
});

router.get('/dashboard', auth, (req, res, next) => {
	console.log('session: ',req.session)
	let payload = {user: req.session.user}
	console.log('render',payload);
	if(req.session.user.curator) {
		return res.redirect('/curator')
	} else if (req.session.user.admin) {
		return res.redirect('/admin')
	}
	db.Quote.findAll({user_id: req.session.user.email}).then( quotes => {
		return res.render('dashboard',{
			user: req.session.user,
			quotes: quotes.reverse()
		});
	});
    
});

//like a quote
router.get('/like/:quote_id', (req, res, next) => {
	db.Quote.update({likes: Sequelize.literal('likes +1')},{ where: {id:req.params.quote_id}}).then( quote => {
		return res.redirect('/quote/'+req.params.quote_id);
	})
});

//approve a quote
router.get('/curate/:quote_id', (req, res, next) => {
	console.log(req.params)
	db.Quote.update({curated: true},{ where: {id:req.params.quote_id}}).then( quote => {
		return res.redirect('/curator');
	})
	.catch( err => {
		console.log(err);
		return res.redirect('/curator');
	})
});

//delete a quote
router.get('/delete/:quote_id', (req, res, next) => {
	console.log(req.params)
	db.Quote.destroy({ where: {id:req.params.quote_id}}).then( quote => {
		return res.redirect('/admin');
	})
	.catch( err => {
		console.log(err);
		return res.redirect('/admin');
	})
});

router.get('/public', (req, res, next) => {
	db.Quote.findAll({where:{public:true}}).then( quotes => {
		return res.render('public', {
			quotes: quotes,
			user: req.session.user
		});
	})
	.catch( err => {
		console.log(err);
		return res.redirect('/dashboard');
	})
});

router.get('/curator', auth, (req, res, next) => {
	db.Quote.findAll({where:{public:true}}).then( quotes => {
		return res.render('curator', {
			quotes: quotes,
			user: req.session.user
		});
	})
	.catch( err => {
		console.log(err);
		return res.redirect('/dashboard');
	})
});

router.get('/admin', auth, (req, res, next) => {
	db.Quote.findAll({where:{public:true}}).then( quotes => {
		return res.render('admin', {
			quotes: quotes,
			user: req.session.user
		});
	})
	.catch( err => {
		console.log(err);
		return res.redirect('/dashboard');
	})
});


router.get('/quote/:id', (req, res, next) => {
	let quoteTemp = null;
	db.Quote.findOne({where:{id:req.params.id}}).then( quote => {
		console.log(quote.dataValues);
		if(quote == null){
			return res.redirect('/dashboard');
		}
		quoteTemp = quote;
		return db.Comment.findAll({where:{quote_id: quote.id}})
		// return res.render('quote', {
		// 	quote: quote.dataValues,
		// 	user: req.session.user
		// });
	})
	.then( comments => {
		
		comments = comments.map( x => x.dataValues);
		console.log(comments);
		return res.render('quote', {
			quote: quoteTemp.dataValues,
			user: req.session.user,
			comments: comments
		})
	})
	.catch( err => {
		console.log(err);
		return res.redirect('/dashboard');
	})
    
});

router.post('/login', (req, res, next) => {
	console.log(req.body);
	db.User.findOne({where: req.body}).then( user => {
		console.log(user.dataValues);
		req.session.user = user.dataValues;
		if(user == null){
			return res.render('login', {message: 'invalid credentials!'});
		}
		if(user.curator) {
			return res.redirect('/curator');
		}
		else if(user.admin) {
			return res.redirect('/admin');
		}
		else {
			return res.redirect('/dashboard');
		}
		
	})
	.catch( err => {
		console.log(err);
		return res.render('login', {message: 'invalid credentials!'});
	})
});


//create user
router.post('/user', (req, res, next) => {
	req.body.admin = false;
	req.body.curator = false;

	if(req.body.fullname == 'curator') {
		req.body.curator = true;
	}
	else if(req.body.fullname == 'admin') {
		req.body.admin = true;
	}

	db.User.create(req.body).then( user => {
			console.log(user);
			return res.render('login', {message: 'user created'})
		})
		.catch( err => {
			return res.render('registration', {message: 'invalid inputs!'})
			console.log(err);
		})
});


//create quote
router.post('/quote/:user_id', (req, res, next) => {
	req.body.user_id = req.params.user_id;
	if( req.body.public == 'public') {
		req.body.public = true;
	}
	else {
		req.body.public = false;
	}
	req.body.curated = false;
	req.body.likes = 0;

	db.Quote.create(req.body).then( quote => {
			console.log(quote);
			return res.redirect('/dashboard');
		})
		.catch( err => {
			console.log(err);
			return res.redirect('/dashboard');
		})
});


//create comment
router.post('/comment/:user/:quote_id', (req, res, next) => {
	req.body.user = req.params.user;
	req.body.quote_id = req.params.quote_id;

	db.Comment.create(req.body).then( comment => {
			console.log(comment);
			return res.redirect('/quote/'+req.body.quote_id);
		})
		.catch( err => {
			console.log(err);
			return res.redirect('/dashboard');
		})
});

