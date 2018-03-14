window.addEventListener('load', () => {
  if (window.location.pathname === '/profile' && Cookies.get('token')) {
    axios.get('/api/profile-info').then(res => {
      const member = res.data.member
      const memberInfo = `
        <div class="container">
          <div class="row">
            <div class="col">
              <center>
                <h2 class="dashboard-text">Welcome, ${member.first_name}!</h2>

                <h4>Here is your basic info</h4>
                <div class="col-md-8">
                  <div class="col-md-8">
                    <div class="thumbnail" style="border-radius: 12px">
                      <p>Name: ${member.first_name} ${member.last_name}</p>
                      <p>email: ${member.email}</p>
                      <p>username: ${member.username}</p>
                      <p>gender: ${member.gender}</p>
                    </div>
                  </div>
                </div>
              </center>
            </div>
            <div class="col">
            File Upload
            ${res.msg ? res.msg : ''}
              <form action="/upload" method="post" enctype="multipart/form-data">
                <div class="inline-block" style="padding-bottom: 10px">
                  <label class="btn btn-default btn-file">
                    Upload Image<input name="faridsImage" type="file" style="display: none" />
                  </label>
                </div>
                <div class="inline-block">
                  <button type="submit" class="btn btn-success">Submit</button>
                </div>
              </form>
              <br />
              <img src=${typeof res.file != 'undefined' ? file : ''}>
            </div>
          </div>
        </div>
      `;

        conversationCount.then(res => {
          const fromUserId = []
          res.data.messages.map(message => {
            if (!fromUserId.includes(message.from_user_id)) {
              fromUserId.push(message.from_user_id)
            } else {
              return
            }
          })
          let htmlOutput = authenticatedNavArea(fromUserId.length) + memberInfo
          document.getElementById('my-app').innerHTML = htmlOutput;
        })
    })
  }
})
