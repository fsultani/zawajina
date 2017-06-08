var User = require('./models')
var Message = require('./models')

var newUser = new User({
	first_name: "Farid",
	last_name: "Sultani",
	username: "fsultani",
	email: "faridsultani.ba@gmail.com",
	password: "asdf",
})

newUser.save(function(err, user) {
	err ? console.log(err) : console.log(user)
})

var newMessage = new Message({
	message: "This is a test",
	from: "Farid",
	from_user_id: "12345",
	to_user_id: "67890"
})

newMessage.save((err, message) => {
	err ? console.log(err) : console.log(message)
})