const openMessageComposer = () => {
  document.getElementById('contactForm').style.display = "block";
  document.getElementById('messageCta').style.display = "none";
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
    const userPath = window.location.pathname.split('/')[2]
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        const response = JSON.parse(this.responseText);
        let displayContactForm = document.getElementById('contactForm');
        // displayContactForm.style.display = "none";

        const welcome = `
          <center>
            <h2 class="dashboard-text">${response.member.first_name}'s profile page</h2>

            <p>It's currently blank, but we plan on fixing that.</p>

            <p>In the meantime, you may contact ${response.member.first_name} using the button below.</p>

            <button class="btn btn-primary" onclick="openMessageComposer()" id="messageCta">Message</button>

            <div id="contactForm">
              <center>
                <form>
                  <div class="form-group col-md-6 col-md-offset-3">
                    <center>
                      <label for="exampleTextarea">Contact ${response.member.first_name}</label>
                    </center>
                    <textarea class="form-control" name="message" rows="5" cols="10"></textarea>
                    <br>
                    <center>
                      <button type="submit" class="btn btn-danger">Cancel</button>
                      <button type="submit" class="btn btn-primary">Send</button>
                    </center>
                  </div>
                </form>
              </center>
            </div>
          </center>
        `;

        const htmlOutput = beginUserPageLayout + authenticated + endUserPageLayout + welcome
        document.getElementById('my-app').innerHTML = htmlOutput;
        document.getElementById('contactForm').style.display = "none";
      }
    }
    xhr.open('GET', '/users/api/info/' + userPath, true)
    xhr.setRequestHeader('user-cookie', Cookies.get('token'))
    xhr.send();
  } else if (url[1] === 'users' && url[3] === 'about') {
    const userPath = window.location.pathname.split('/')[2]
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        const response = this.responseText;
        const welcome = `
          <center>
            ${response}
          </center>
        `;
        const htmlOutput = beginUserPageLayout + notAuthenticated + endUserPageLayout + welcome
        document.getElementById('my-app').innerHTML = htmlOutput;
      }
    }
    xhr.open('GET', '/users/api/info/' + userPath, true)
    xhr.send(null);
  }
})
