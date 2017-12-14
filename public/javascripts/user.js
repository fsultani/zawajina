const userPath = window.location.pathname.split('/')[2]

const openMessageComposer = () => {
  $("#messageCta").hide()
  $("#contactForm").fadeTo("medium", 1, () => {})
}

const sendMessage = () => {
  const message = document.getElementById("composeMessage").value
  axios.post('/messages/api/new-message', {
    userId: userPath,
    message: message
  })
  .then(function(res) {
    console.log("res.data.member\n", res.data.member[0])
    console.log("res.data.user\n", res.data.user[0])
  })
}

const cancelSend = () => {
  $("#contactForm").fadeOut("medium", () => {})
  $("#messageCta").show()
}

const beginUserPageLayout = `
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <nav style="padding-top: 10px">
          <ul class="nav nav-pills pull-left">
            <li role="presentation">
              <a href="/home"><h3>My App</h3></a>
            </li>
          </ul>
          <ul class="nav nav-pills pull-right">
          `;

const authenticated = `
<li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
<li role="presentation"><a href="/messages">Messages</a></li>
<li role="presentation"><a href="/profile">Profile</a></li>
`;

const notAuthenticated = `
<li role="presentation"><a href="/login">Login</a></li>
<li role="presentation"><a href="/register">Register</a></li>
`;

const endUserPageLayout = `</ul></nav></div></div></div></div>`;

window.addEventListener('load', () => {
  const url = window.location.pathname.split('/')
  if (url[1] === 'users' && url[3] === 'about' && Cookies.get('token')) {
    axios.get(`/users/api/info/${userPath}`).then((res) => {
      let displayContactForm = document.getElementById('contactForm');

      const welcome = `
        <center>
          <h2 class="dashboard-text">${res.data.member.first_name}'s profile page</h2>

          <p>It's currently blank, but we plan on fixing that.</p>

          <p>In the meantime, you may contact ${res.data.member.first_name} using the button below.</p>

          <button class="btn btn-primary" onclick="openMessageComposer()" id="messageCta">Message</button>

          <div id="contactForm">
            <div class="form-group col-md-6 col-md-offset-3">
              <center>
                <label for="exampleTextarea">Contact ${res.data.member.first_name}</label>
                <textarea class="form-control" id="composeMessage" rows="5" cols="10"></textarea>
                <br />
                <button class="btn btn-danger" onclick="cancelSend()">Cancel</button>
                <button class="btn btn-primary" onclick="sendMessage()">Send</button>
              </center>
            </div>
          </div>
        </center>
      `;

      const htmlOutput = beginUserPageLayout + authenticated + endUserPageLayout + welcome
      document.getElementById('my-app').innerHTML = htmlOutput;
      document.getElementById('contactForm').style.display = "none";
    })
  } else if (url[1] === 'users' && url[3] === 'about') {
    axios.get(`/users/api/info/${userPath}`).then((res) => {
      console.log("res\n", res)
      const welcome = `
        <center>
          ${res.data}
        </center>
      `;
      const htmlOutput = beginUserPageLayout + notAuthenticated + endUserPageLayout + welcome
      document.getElementById('my-app').innerHTML = htmlOutput;
    })
  }
})
