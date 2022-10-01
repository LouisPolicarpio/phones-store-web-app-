let PhoneListing = require("../models/PhoneListing");
let mongoose = require("mongoose")
let User = require("../models/User")
let jwt = require("jsonwebtoken");
const md5 = require("md5");
const {login} = require("./auth");
const {compileETag} = require("express/lib/utils");

let JWT_SECRET = "odfnbei0rjhnvg0ernbgert34u2-i3-10394-3)(&%*)@#)(y#%)#jh()jrJSEONSOIJNVG0AOVH"

module.exports.showMain = function(req,res){
		res.render('main');
}

module.exports.showReset = function (req, res) {
	res.render('reset');
}

module.exports.loginPage = function(req,res){
	res.render('loginPage');
}

module.exports.userPage = function(req,res){
	res.render('user');
}

module.exports.userCheckout = function(req,res){
	res.render('userCheckout');
}


module.exports.getBestSellers = async function (req, res) {

	let update_res = await PhoneListing.updateMany({}, [{
		$set: {
			avg_rating: {
				$avg: {
					$map: {
						input: "$reviews",
						as: "el",
						in: "$$el.rating"
					}
				}
			}
		}
	}]);
	
	console.log(update_res.matchedCount);
	console.log(update_res.modifiedCount);
	console.log(update_res.acknowledged);

	PhoneListing.find()
		.where('disabled').exists(false)
		.where({"$expr": {$gte: [{$size: "$reviews"}, 2]}})
		.sort({avg_rating: -1}).limit(5)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.json(result);
			//res.end(JSON.stringify(result))
		});
}

module.exports.getSoldOutSoon = function (req, res) {

	PhoneListing.find()
		.where('disabled').exists(false)
		.where('stock').gt(0)
		.sort({stock: 1}).limit(5)
		.then((result) => {
			res.setHeader('Content-Type', 'application/json');
			res.json(result)
			//res.end(stringify(result))
		});

}

module.exports.getSellerDetails = function (req, res) {
	let id = req.query['id']
	id = new mongoose.Types.ObjectId(id);
	User.findById(id)
		.then(result => {
			res.setHeader('Content-Type', 'application/json');
			res.json(result)
		});
}

module.exports.search = function (req,res) {
	let id = req.query['id'];
	let searchTerm = req.query['searchTerm'];
	let filter = req.query['filter'];
	let price = req.query['price']
	if (searchTerm === undefined) searchTerm = "";
	if (filter === undefined) filter = "";
	if (price === undefined) price = "";

	if (id !== undefined && id !== "") {
		let _id = new mongoose.Types.ObjectId(id);
		PhoneListing.findById(_id)
			.then(result => {
				res.setHeader('Content-Type', 'application/json');
				res.json(result)
			});
		return;
	}

	if (filter !== "" && price !== "" ) {
		PhoneListing.find({"title":{$regex: ".*" + searchTerm + ".*", $options:"i"}})
			.where('brand', filter)
			.where('price').lt(price)
			.then(result => {
				res.setHeader('Content-Type', 'application/json');
				res.json(result)
				//res.end(stringify(result))
			})
	}
	else if (filter === "" && price !== "") {
		PhoneListing.find({"title":{$regex: ".*" + searchTerm + ".*", $options:"i"}})
			.where('price').lt(price)
			.then(result => {
				res.setHeader('Content-Type', 'application/json');
				res.json(result)
			})
	}
	else if (filter !== "" && price === "") {
		PhoneListing.find({"title":{$regex: ".*" + searchTerm + ".*", $options:"i"}})
			.where('brand', filter)
			.then(result => {
				res.setHeader('Content-Type', 'application/json');
				res.json(result)
			})
	}
	else if (filter === "" && price === "") {
		PhoneListing.find({"title":{$regex: ".*" + searchTerm + ".*", $options:"i"}})
			.then(result => {
				res.setHeader('Content-Type', 'application/json');
				res.json(result)
			})
	}
	
}

module.exports.updateUser = async function(req, res) {
	let token = req.cookies['token']
	if (token === undefined) {
		res.json({status: "Must be signed in"})
		return;
	}
	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		return res.json({status: "Invalid token - authentication failed"})
	}

	try {
		let firstName = req.body['firstname'];
		let lastName = req.body['lastname'];
		let newEmail = req.body['email'];


		let _id = new mongoose.Types.ObjectId(payload._id);
		await User.findOneAndUpdate(
			{"_id": _id},
			{$set: {"firstname": firstName,
					"lastname": lastName,
					"email": newEmail}}
		);
		return res.json({status: 'Update profile successful'})
	} catch (e) {
		return res.json({status: 'Could not update profile'})
	}

}

//can return the new document if want. just add .then() to findOneAndUpdate
module.exports.updateFirstname = async function (req, res) {

	let token = req.cookies['token']
	if (token === undefined) {
		res.json({status: "Must be signed in"})
		return;
	}

	try {
		let payload = jwt.verify(token, JWT_SECRET)
		console.log(payload)

		let firstName = req.query['firstname']
		let _id = new mongoose.Types.ObjectId(payload._id);
		await User.findOneAndUpdate(
			{"_id": _id},
			{$set: {"firstname": firstName}}
		);
		return res.json({status: 'Update first name worked'})
	} catch (e) {
		return res.json({status: 'Could not update first name'})
	}
}

module.exports.updateLastname = async function (req, res) {

	let token = req.cookies['token'];
	if (token === undefined) {
		res.json({status: "Must be signed in"})
		return;
	}

	try {
		let payload = jwt.verify(token, JWT_SECRET)

		let lastName = req.query['lastname']
		let _id = new mongoose.Types.ObjectId(payload._id);
		await User.findOneAndUpdate(
			{"_id": _id},
			{$set: {"lastname": lastName}}
		);
		return res.json({status: 'Update last name worked'})
	} catch (e) {
		return res.json({status: 'Could not update last name'})
	}
}

//should prob be filtering by _id
module.exports.updateEmail = async function (req, res) {

	let token = req.cookies['token']
	if (token === undefined) {
		res.json({status: "Must be signed in"})
		return;
	}

	try {
		let payload = jwt.verify(token, JWT_SECRET)
		console.log(payload)

		let newEmail = req.query['email']
		let _id = new mongoose.Types.ObjectId(payload._id);
		await User.findOneAndUpdate(
			{"_id": _id},
			{$set: {"email": newEmail}}
		);
		return res.json({status: 'Update email worked'})
	} catch (e) {
		return res.json({status: 'Could not update email'})
	}
}

module.exports.updatePassword = async function (req, res) {

	let token = req.cookies['token']
	try {
		let payload = jwt.verify(token, JWT_SECRET)

		let _id = new mongoose.Types.ObjectId(payload._id);
		let oldPassword = md5(req.body['oldPassword'])
		let newPassword = md5(req.body['newPassword'])

		console.log(oldPassword)
		await User.findById(_id)
			.then((user) => {
				console.log("user: "+ user)
				if (user.password === oldPassword) {
					user.password = newPassword;
					user.save((err) => {
						if (err) {
							return res.status(500).send({ message: err });
						}
					});
					return res.json({status: 'Update password worked'});
				} else {
					return res.json({status: 'Incorrect password'})
				}
			});
	} catch (e) {
		return res.json({status: 'Could not update password'})
	}
}

module.exports.setNewPassword = async function (req,res) {

	let email = req.body['email']
	let pwd = md5(req.body['password'])

	await User.findOneAndUpdate(
		{email: email},
		{password: pwd}
	).then((user) => {
		if (!user) {
			res.json({status: "Could not find user to update"})
		}
		return res.json({status: 'A new password has been set'})
	})

}

module.exports.createNewPhonelisting  = function (req, res) {
	let token = req.cookies['token']
	if (token === undefined) {
		return res.json({status: "Must be signed in"})
	}

	let title = req.body['title'];
	let brand = req.body['brand'];
	let image = req.body['image'];
	let stock = req.body['stock'];
	let price = req.body['price'];

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		res.status(400).json({status: "Could not verify token", e});
	}

	try {
		let listing = new PhoneListing({
			title: title,
			brand: brand,
			image: image,
			stock: stock,
			seller: payload._id,
			price: price
		});

		listing.save(function (err, phone) {
			if (err) return console.error(err);
			return res.json({status: "Added listing", phone})
		});
	} catch (e) {
		console.log(e.message)
		res.status(400).json({status: "unable to add listing", e})
	}

}

module.exports.getUsersPhonelistings  = async function (req, res) {

	let token = req.cookies['token']
	if (token === undefined) {
		res.json({status: "Must be signed in"})
		return;
	}

	try {
		let payload = jwt.verify(token, JWT_SECRET)
		console.log(payload)

		let _id = payload._id;
		await PhoneListing.find(
			{"seller" : _id}
		)
			.then((list) => {
				if (list.length < 1) {
					return res.json({status: 'No phone entries for this user'})
				}
				return res.json(list)
			})

	} catch (e) {
		return res.json({status: 'Could not find users phonelistings'})
	}

}

module.exports.addReview = async function(req, res) {
	let token = req.cookies['token']
	if (token === undefined) {
		res.status(400).json({status: "Must be signed in to add rating"});
		return;
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		res.status(400).json({status: "Could not verify token", e});
	}
	try {
		let phoneId = req.body['phoneId'];
		phoneId = new mongoose.Types.ObjectId(phoneId);
		let comment = req.body['comment'];
		let rating  = req.body['rating'];

		rating = Number(rating)
		if (isNaN(rating)) return res.status(400).json({status: "Rating must be a number"})
		if (rating < 0 || rating > 5) return res.status(400).json({status: "Rating must be between 0-5"})

		let reviewerId = new mongoose.Types.ObjectId(payload._id);

		await PhoneListing.findOneAndUpdate(
			{_id: phoneId},
			{ "$push":
					{"reviews":
							{
								"reviewer": reviewerId,
								"rating": rating,
								"comment": comment
							}
					}
			}
		).then((listing) => {
			console.log(listing)
			res.json({status: "Added review"})
		})
	} catch (e) {
		res.json({status: "Could not add review", e})
	}



}

module.exports.removeListing = async function (req,res) {
	let token = req.cookies['token']
	if (token === undefined) {
		return res.status(400).json({status: "Must be signed in to add rating"});
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		res.status(400).json({status: "Could not verify token", e});
	}

	try {
		let seller = payload._id;
		let _id = req.body['id']
		await PhoneListing.findOneAndDelete(
			{"_id" : _id, "seller": seller}
		).then((listing) => {
				return res.json({status: 'Successfully deleted phone listing', listing})
			});
	} catch (e) {
		return res.json({status: 'Could not delete phone listing'})
	}
}

module.exports.enableListing = async function (req, res) {
	let token = req.cookies['token']
	if (token === undefined) {
		return res.status(400).json({status: "Must be signed in to add rating"});
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		res.status(400).json({status: "Could not verify token", e});
	}

	try {
		let listingID = req.body['id'];

		await PhoneListing.findOneAndUpdate(
			{_id: listingID, seller: payload._id},
			{ $unset: { disabled : ""}},
			{new: true}

		).then((listing) => {
			return res.json({status: 'Successfully enabled phone listing', listing})
		})

	} catch (e) {
		res.status(400).json({status: "Could not disable phone listing", e});
	}
}

module.exports.disableListing = async function (req, res) {
	let token = req.cookies['token']
	if (token === undefined) {
		return res.status(400).json({status: "Must be signed in to add rating"});
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		res.status(400).json({status: "Could not verify token", e});
	}

	try {
		let listingID = req.body['id'];

		await PhoneListing.findOneAndUpdate(
			{_id: listingID, seller: payload._id},
			{ $set: { disabled : ""}},
			{new: true}
		).then((listing) => {
			return res.json({status: 'Successfully disabled phone listing', listing})
		})

	} catch (e) {
		res.status(400).json({status: "Could not disable phone listing", e});
	}
}

module.exports.checkout = async function (req,res) {
	let token = req.cookies['token']
	if (token === undefined) {
		return res.status(400).json({status: "Must be signed in to add rating"});
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		res.status(400).json({status: "Could not verify token", e});
	}

	let finished = false;
	try {
		let listings = req.body['listings']
		console.log(listings)

		for (const listing of listings) {
			if (finished) return;
			let id = listing['id'];
			let quantity = listing['quantity']
			if (quantity < 0) return res.status(400).json({status: 'Cannot buy negative quantity'})

			await PhoneListing.findById(id)
				.then((foundListing) => {
					if (foundListing.stock - quantity < 0) {
						res.json({status: "Not enough stock for " + foundListing.title})
						finished = true;
						return;
					}
				});
		}
		if (finished) return;

		for (const listing of listings) {
			let id = listing['id'];
			let quantity = listing['quantity']
			await PhoneListing.findOneAndUpdate(
				{_id: id},
				{"$inc": {"stock": (quantity*-1)}}
			);
		}

		return res.json({status: 'Successfully checked out'})
	} catch (e) {
		res.status(400).json({status: "Could not checkout", e});
	}
}

module.exports.getUserDetails = async function (req,res) {
	let token = req.cookies['token']
	if (token === undefined) {
		return res.status(400).json({status: "Must be signed in"})
	}

	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET)
	} catch (e) {
		return res.status(400).json({status: "Could not verify token", e});
	}

	try {
		let _id = payload._id;
		await User.findById(new mongoose.Types.ObjectId(_id))
			.then((user) => {
				return res.json(user)
			});
	} catch (e) {
		return res.json({status: 'Could not find users phonelistings'})
	}
}