const Welcome = () => {
  let htmlOutput;
  if (Cookies.get('token')) {
    htmlOutput = `
      <center>
        <h1>Welcome home, ${Cookies.get('name')}!</h1>
        <h3>All members on this site</h3>
      </center>
    `;

    axios.get('/api/all-members')
      .then(allMembers => {
        const getAllMembers = allMembers.data.all

        htmlOutput += `<div class="col-md-8 col-md-offset-2">`;

        getAllMembers.map((user) => {
          htmlOutput += `
            <a href="/users/${user._id}/about" style="text-decoration: none">
              <div class="col-md-6">
                <div class="thumbnail" style="border-radius: 12px">
                  <h3 style="margin: 20px 0px">${user.name}</h3>
                </div>
              </div>
            </a>
          `;
        })
        htmlOutput += `</div></center>`;
        document.getElementById('app').innerHTML += htmlOutput;
      })
  } else {
    htmlOutput = `
      <center>
        <h1>Welcome!</h1>
        <h4>Please log in or create a free account</h4>
      </center>
    `;
    document.getElementById('app').innerHTML += htmlOutput;
  }
}

export default Welcome;
