const conversationId = window.location.pathname.split('/')[2]

const beginConversationPageLayout = `
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

// const authenticated = `
// <li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
// <li role="presentation"><a href="/messages">Messages</a></li>
// <li role="presentation"><a href="/profile">Profile</a></li>
// `;

// const notAuthenticated = `
// <li role="presentation"><a href="/login">Login</a></li>
// <li role="presentation"><a href="/register">Register</a></li>
// `;

const endConversationPageLayout = `</ul></nav></div></div></div></div>`;

window.addEventListener('load', () => {
  const url = window.location.pathname.split('/')
  if (url[1] === 'conversations' && url[2] === conversationId) {
    axios.get(`/users/api/info/${conversationId}`).then((res) => {
      let displayContactForm = document.getElementById('contactForm');

      const welcome = `
        
      `;

      const htmlOutput = beginUserPageLayout + authenticated + endUserPageLayout + welcome
      document.getElementById('my-app').innerHTML = htmlOutput;
    })
  } else if (url[1] === 'users' && url[3] === 'about') {
    // axios.get(`/users/api/info/${conversationId}`).then((res) => {
    //   console.log("res\n", res)
    //   const welcome = `
    //     <center>
    //       ${res.data}
    //     </center>
    //   `;
    //   const htmlOutput = beginUserPageLayout + notAuthenticated + endUserPageLayout + welcome
    //   document.getElementById('my-app').innerHTML = htmlOutput;
    // })
  }
})
