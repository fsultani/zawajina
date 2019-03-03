const memberProfile = memberId => {
  // if (url[0] === '#users' && url[2] === 'about' && Cookies.get('token')) {
  if (Cookies.get('token')) {
    axios.get(`/users/api/info/${memberId}`).then((res) => {
      const htmlOutput = `
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

      document.getElementById('app').innerHTML += htmlOutput;
      document.getElementById('contactForm').style.display = "none";
    })
  }
}

export default memberProfile;
