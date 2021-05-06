const express = require('express');

const controller = require('../controllers/controller');

// import module `validation`
const validation = require('../helpers/validation.js');

const router = express.Router();

router.get('/', controller.getIndex);

router.get('/register-check', controller.checkRegister);

//reg
router.post('/register', validation.registerValidation(), controller.postRegister);

router.post('/login', validation.loginValidation(), controller.postLogin);

// Add premade decks to a newly registered account
router.get('/add', controller.addPremadeDecks);

// redirects
router.get('/index', controller.getIndex);

router.get('/account', controller.getAccountSettings);

router.get('/about', controller.getAboutKanau);

router.get('/browse', controller.getBrowse);

router.get('/decks', controller.getDecks);

router.get('/dictionary', controller.getDictionary);

router.get('/study/:deck', controller.getStudyDeck);

router.get('/getStudyCards', controller.getStudyCards);

router.post('/passCard', controller.postPassCard);

router.post('/failCard', controller.postFailCard);

router.get('/getFlashcardData', controller.getFlashcardData);

router.get('/getFlashcardDataFilter', controller.getFlashcardDataFilter);

router.post('/testajax', (req, res) => {
  console.log("AJAX REQUEST DATA IS: ");
  console.log(req.body);

  res.status(200).send('just some random testing going on here');
});

router.post('/editDeck', controller.postEditDeck);

router.post('/addCard', controller.postAddCard);

router.post('/editCard', controller.postEditCard);

router.post('/deleteCard', controller.postDeleteCard);

router.get('/getEngTranslation', controller.getEnglishTranslation);

module.exports = router;