window.addEventListener('load', () => {
  if (window.location.pathname.match(/^\/users\/*/)) {
    console.log("Member profile page")
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        console.log("this.responseText\n", this.responseText)
        // const response = JSON.parse(this.responseText);

        // const welcome = `
        //   <center>
        //     <h2 class="dashboard-text">{{member.first_name}}'s profile page</h2>

        //     <p>It's currently blank, but we plan on fixing that.</p>

        //     <p>In the meantime, you may contact {{member.first_name}} using the button below.</p>

        //     <a href="/messages/{{member._id}}" class="btn btn-primary">Message</a>
        //   </center>
        // `;
        // document.getElementById('my-app').innerHTML = htmlOutput;
      }
    }
    xhr.open('GET', '/users/info', true)
    // xhr.setRequestHeader('user-cookie', Cookies.get('token'))
    xhr.send(null);
  }
})
