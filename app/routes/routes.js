let express = require('express')
let router = express.Router();
let controller = require('../controllers/controller')
let auth = require('../controllers/auth')

// router.get('/', controller.showHomePage);
// router.post('/survey', controller.showResult);
router.get('/best-sellers', controller.getBestSellers)
router.get('/sold-out-soon', controller.getSoldOutSoon)
router.get('/search', controller.search)
router.get('/', controller.showMain)
router.post('/signup', auth.signUp)
router.get('/login', auth.login)
router.post('/logout', auth.logOut)
//endpoint that verifies a users email, and sends one if it is valid
router.post('/reset-password', auth.resetPassword)
//once user clicks on link from email, they are shown this page where they enter new password
router.get('/reset/:email', controller.showReset)
router.get('/confirm/:confirmationCode', auth.verifyUser)
router.put('/reset-new', controller.setNewPassword)
router.put('/updateFirstname', controller.updateFirstname)
router.put('/updateLastname', controller.updateLastname)
router.put('/updateEmail', controller.updateEmail)
router.put('/update-profile', controller.updateUser)
router.put('/update-password', controller.updatePassword)
router.get('/listings', controller.getUsersPhonelistings)
router.delete('/remove-listing', controller.removeListing)
router.get('/seller-details', controller.getSellerDetails)
router.post('/add-review', controller.addReview)
router.post('/add-listing', controller.createNewPhonelisting)
router.put('/enable-listing', controller.enableListing)
router.put('/disable-listing', controller.disableListing)
router.get('/login-page', controller.loginPage)
router.get('/user-page', controller.userPage)
router.put('/checkout', controller.checkout)
router.get('/user', controller.getUserDetails)
router.get('/user-checkout', controller.userCheckout)


module.exports = router;