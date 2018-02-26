window.addEventListener('load', () => {
  if (window.location.pathname === '/profile' && Cookies.get('token')) {
    axios.get('/api/profile-info').then(res => {
      const member = res.data.member
      const memberInfo = `
          <center>
            <h2 class="dashboard-text">Welcome, ${member.first_name}!</h2>

            <h4>Here is your basic info</h4>
            <div class="col-md-8 col-md-offset-4">
              <div class="col-md-6">
                <div class="thumbnail" style="border-radius: 12px">
                  <p>Name: ${member.first_name} ${member.last_name}</p>
                  <p>email: ${member.email}</p>
                  <p>username: ${member.username}</p>
                  <p>gender: ${member.gender}</p>
                </div>
              </div>
            </div>
          </center>
        `;

        conversationCount.then(res => {
          let htmlOutput = authenticatedNavArea(res.data.conversationTotal) + memberInfo
          document.getElementById('my-app').innerHTML = htmlOutput;
        })

        // const htmlOutput = navArea + memberInfo
        // document.getElementById('my-app').innerHTML = htmlOutput
    })
  }
})
