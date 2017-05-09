$(document).ready(function() {
	if (window.location.href == window.location.origin + '/home') {
		$("#loggedIn").show()
		$("#loggedOut").hide()

		console.log("You're in the home page.  Your available cookies are below.")
		console.log(Cookies.get('username'))
		console.log(Cookies.get('first_name'))
		console.log(Cookies.get('last_name'))
		console.log(Cookies.get('email'))

		$("#welcomeUser").html("Welcome, " + Cookies.get('first_name'))
		$("#first_name").html(Cookies.get('first_name'))

	}
})