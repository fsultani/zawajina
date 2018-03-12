window.addEventListener('load', () => {
  if (window.location.pathname === '/home' && Cookies.get('token')) {
    const welcome = `
      <center>
        <h1>Welcome home, ${Cookies.get('first_name')}!</h1>
        <h3>All members on this site</h3>
    `;
    axios.get('/api/all-members')
      .then(allMembers => {
        const getAllMembers = allMembers.data.all

        let output = `<div class="col-md-8 col-md-offset-2">`;

        getAllMembers.map((user) => {
          output += `
            <a href="/users/${user._id}/about" style="text-decoration: none">
              <div class="col-md-6">
                <div class="thumbnail" style="border-radius: 12px">
                  <h3 style="margin: 20px 0px">${user.first_name}</h3>
                </div>
              </div>
            </a>
          `;
        })

        output += `</div></center>`;

        conversationCount.then(res => {
          const fromUserId = []
          res.data.messages.map(message => {
            if (!fromUserId.includes(message.from_user_id)) {
              fromUserId.push(message.from_user_id)
            } else {
              return
            }
          })
          let htmlOutput = authenticatedNavArea(fromUserId.length) + welcome + output;
          document.getElementById('my-app').innerHTML = htmlOutput;
        })
      })
  } else if (window.location.pathname === '/home') {
    const welcome = `
      <center>
        <h1>Welcome!</h1>
        <h4>Please log in or create an account</h4>
      </center>
    `;

    const htmlOutput = layout + welcome;
    document.getElementById('my-app').innerHTML = htmlOutput;
    }
})