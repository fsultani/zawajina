$(document).ready(function() {
	// var cookiesMap = Object.entries(Cookies.get())
	// cookiesMap.map((index) => {
	// 	Cookies.remove(index[0])
	// })

	if (Cookies.get('username')) {
		console.log(Cookies.get('username') + " is logged in.")
		$("#loggedIn").show()
		$("#loggedOut").hide()
	} else {
		console.log("No one is logged in.")
		$("#loggedIn").hide()
		$("#loggedOut").show()
	}

	login = () => {		
		var username = $("[name='username']").val()
		var password = $("[name='password']").val()
		$.ajax({
			type: "PUT",
			url: '/login',
			data: {
				username: username,
				password: password
			},
			success: function(response) {
				console.log('Success:')
				console.log(response.user)
				// console.log(JSON.stringify(response.user))

				Cookies.set('username', response.user.username)
				Cookies.set('first_name', response.user.first_name)
				Cookies.set('last_name', response.user.last_name)
				Cookies.set('email', response.user.email)
				
				console.log(Cookies.get('username', response.user.username))
				console.log(Cookies.get('first_name', response.user.first_name))
				console.log(Cookies.get('last_name', response.user.last_name))
				console.log(Cookies.get('email', response.user.email))
				
				window.location.href = window.location.origin + '/home'
			},
			error: function(error) {
				console.log("Error:")
				console.log(error)
			}
		})
	}

	// logout = () => {
	// 	console.log("Logout has been clicked.")
	// 	var cookiesMap = Object.entries(Cookies.get())
	// 	cookiesMap.map((index) => {
	// 		console.log(index)
	// 		Cookies.remove(index[0])
	// 	})
	// 	$("#loggedIn").hide()
	// 	$("#loggedOut").show()
	// }

	if (window.location.href == window.location.origin + '/logout') {
		console.log("You are now logged out.")
		// var myMap = new Map()

		// var cookiesMap = Object.entries(Cookies.get())

		console.log("Before cookies")
		console.log(Cookies.get('username'))
		console.log(Cookies.get('first_name'))
		console.log(Cookies.get('last_name'))
		console.log(Cookies.get('email'))

		Cookies.remove('username')
		Cookies.remove('first_name')
		Cookies.remove('last_name')
		Cookies.remove('email')

		console.log("After cookies")
		console.log(Cookies.get('username'))
		console.log(Cookies.get('first_name'))
		console.log(Cookies.get('last_name'))
		console.log(Cookies.get('email'))

		// cookiesMap.map((index) => {
		// 	console.log(index[0])
		// 	Cookies.remove("'" + index[0] + "'")
		// })
		// console.log("After cookies")

		$("#loggedIn").hide()
		$("#loggedOut").show()
	}
})

