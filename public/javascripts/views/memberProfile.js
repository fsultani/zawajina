const memberId = window.location.pathname.split('/')[2]

const openMessageComposer = () => {
  axios.get(`/conversation/api/exists/${memberId}/${Cookies.get('id')}`).then(res => {
    if (res.data.conversation && res.data.conversation.users.includes(memberId)) {
      window.location.pathname = `/conversation/${res.data.conversation._id}`
    } else {
      $("#messageCta").hide()
      $("#contactForm").fadeTo("medium", 1)
    }
  })
}

const sendMessage = () => {
  const message = document.getElementById("composeMessage").value
  axios.post('/messages/api/new-message', {
    memberId: memberId,
    message: message
  })
  .then(function(res) {
    window.location.pathname = `/conversation/${res.data.conversation._id}`
  })
}

const cancelSend = () => {
  $("#contactForm").fadeOut("medium", () => {})
  $("#messageCta").show()
}

window.addEventListener('load', () => {
  const url = window.location.pathname.split('/')
  if (url[1] === 'users' && url[3] === 'about' && Cookies.get('token')) {
    axios.get(`/users/api/info/${memberId}`).then((res) => {
      let displayContactForm = document.getElementById('contactForm');

      const welcome = `
        <center>
          <h2 class="dashboard-text">${res.data.member.name}'s profile page</h2>

          <p>It's currently blank, but we plan on fixing that.</p>

          <p>In the meantime, you may contact ${res.data.member.name} using the button below.</p>

          <button class="btn btn-primary" onclick="openMessageComposer()" id="messageCta">Message</button>

          <div id="contactForm">
            <div class="form-group col-md-6 col-md-offset-3">
              <center>
                <label for="exampleTextarea">Contact ${res.data.member.name}</label>
                <textarea class="form-control" id="composeMessage" rows="5" cols="10"></textarea>
                <br />
                <button class="btn btn-danger" onclick="cancelSend()">Cancel</button>
                <button class="btn btn-primary" onclick="sendMessage()">Send</button>
              </center>
            </div>
          </div>
        </center>
      `;

      const htmlOutput = authenticatedNavArea(Cookies.get('conversationCount')) + welcome
      document.getElementById('my-app').innerHTML = htmlOutput;
      document.getElementById('contactForm').style.display = "none";
    })
  } else if (url[1] === 'users' && url[3] === 'about') {
    axios.get(`/users/api/info/${memberId}`).then((res) => {
      console.log("res\n", res)
      const welcome = `
        <center>
          ${res.data}
        </center>
      `;
      let htmlOutput = authenticatedNavArea(Cookies.get('conversationCount')) + welcome
      document.getElementById('my-app').innerHTML = htmlOutput;
    })
  }
})
