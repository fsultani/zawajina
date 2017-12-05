const messagesLayout = `
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
          <li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
          <li role="presentation"><a href="/messages">Messages</a></li>
          <li role="presentation"><a href="/profile">Profile</a></li>
          </ul></nav></div></div></div></div>
          `;

// <center>
//   <form method="post" action="/messages/{{member.id}}">
//     <div class="form-group col-md-6 col-md-offset-3">
//       <center>
//         <label for="exampleTextarea">Contact {{member.first_name}}</label>
//       </center>
//       <textarea class="form-control" name="message" rows="5" cols="10"></textarea>
//       <br>
//       <center>
//         <button type="submit" class="btn btn-primary">Send</button>
//       </center>
//     </div>
//   </form>
// </center>

window.addEventListener('load', () => {
  if (window.location.pathname === '/messages' && Cookies.get('token')) {
    
  }
})