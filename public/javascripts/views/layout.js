const userId = Cookies.get("id") ? Cookies.get("id") : null

function logout() {
  Cookies.remove('token')
  Cookies.remove('first_name')
  Cookies.remove('id')
  window.location.pathname = '/login'
}

const layout = `
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <nav style="padding-top: 10px">
          <ul class="nav nav-pills pull-left">
            <li role="presentation">
              <a href="/"><h3>My App</h3></a>
            </li>
          </ul>
          <ul class="nav nav-pills pull-right">
            <li role="presentation"><a href="/login">Login</a></li>
            <li role="presentation"><a href="/register">Register</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
`;

axios.get(`/conversation/api/totalCount/${userId}`).then(res => {
  const fromUserId = []
  res.data.messages.map(message => {
    if (!fromUserId.includes(message.from_user_id)) {
      fromUserId.push(message.from_user_id)
    } else {
      return
    }
  })
  Cookies.set('conversationCount', fromUserId.length)
})

const authenticatedNavArea = count => {
  const navArea = `
    <div class="container">
      <div class="row">
        <div class="header clearfix">
          <nav style="padding-top: 10px">
            <ul class="nav nav-pills pull-left">
              <li role="presentation">
                <a href="/home">
                  <h3>My App<br>
                  <h5>(${Cookies.get('first_name')})</h5>
                  </h3>
                </a>
              </li>
            </ul>
            <ul class="nav nav-pills pull-right">
              <li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
              <li role="presentation"><a href="/messages">${count > 0 ? `Messages (${count})` : `Messages`}</a></li>
              <li role="presentation"><a href="/profile">Profile</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `
  return navArea
}

const notAuthenticated = `
<li role="presentation"><a href="/login">Login</a></li>
<li role="presentation"><a href="/register">Register</a></li>
`;

window.addEventListener('load', () => {
  axios.defaults.headers.common['authorization'] = Cookies.get('token')

  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  }
})
