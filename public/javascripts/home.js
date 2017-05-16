$(document).ready(function() {
	if (Cookies.get('username')) {
		$("#loggedIn").show()
		$("#loggedOut").remove()

		$("#currentUser").html("Welcome, " + Cookies.get('first_name'))
	} else {
		$("#currentUser").html("Welcome to the site")
		$("#loggedIn").remove()
		$("#loggedOut").show()
	}

	profile = () => {
		$.get('/' + Cookies.get('username'), function(data) {
			console.log('data')
			console.log(data)
		})
	}
})