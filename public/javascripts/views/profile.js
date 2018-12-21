const onclickUploadPicture = () => {
  const myFormData = new FormData()
  const file = document.getElementById('fileUpload').files[0]
  myFormData.append('image', file)

  fetch('/api/upload', {
    body: myFormData,
    method: 'POST'
  }).then(function(res) {
    return res.json()
  }).then(function(myJson) {
    axios.put('/api/profile-info', {
      data: myJson.file
    }).then(res => {
      console.log('res\n', res)
    })

    const profileImage = `<img src="${myJson.file}">`
    document.getElementById('profilePicture').innerHTML = profileImage
  })
}

window.addEventListener('load', () => {
  if (window.location.pathname === '/profile' && Cookies.get('token')) {
    axios.get('/api/profile-info').then(res => {
      const member = res.data.member
      const memberInfo = `
        <div class="container" align="center">
          <h2 class="dashboard-text">Welcome, ${member.name}!</h2>
          <div class="row">
            <div class="col-sm-6">
              <h4>Here is your basic info</h4>
              <div class="thumbnail" style="border-radius: 12px">
                <p>Name: ${member.name}</p>
                <p>Email: ${member.email}</p>
                <p>Username: ${member.username}</p>
                <p>Gender: ${member.gender}</p>
                <p>About: ${member.aboutUserLines}</p>
              </div>
              <label class="btn btn-primary btn-file">
                Browse <input type="file" id="fileUpload" style="display: none;" name="faridsImage">
              </label>
              <button class="btn btn-success" onclick="onclickUploadPicture()">
                Submit
              </button>
            </div>
            ${member.profilePicture ? `<div class="col-sm-6"><img src='${member.profilePicture}'</div>` : `<div class="col-sm-6">Placeholder</div>`}
            <div class="col-sm-6" id="profilePicture"></div>
          </div>
        </div>
      `;
      const htmlOutput = authenticatedNavArea(Cookies.get('conversationCount')) + memberInfo
      document.getElementById('my-app').innerHTML = htmlOutput;
    })
  }
})
