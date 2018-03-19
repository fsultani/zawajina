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
    axios.post(`/api/profile-picture/${Cookies.get('id')}`, {
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
          <h2 class="dashboard-text">Welcome, ${member.first_name}!</h2>
          <div class="row">
            <div class="col-sm-6">
              <h4>Here is your basic info</h4>
              <div class="thumbnail" style="border-radius: 12px">
                <p>Name: ${member.first_name} ${member.last_name}</p>
                <p>email: ${member.email}</p>
                <p>username: ${member.username}</p>
                <p>gender: ${member.gender}</p>
              </div>
              <label class="btn btn-primary btn-file">
                Browse <input type="file" id="fileUpload" style="display: none;" name="faridsImage">
              </label>
              <button class="btn btn-success" onclick="onclickUploadPicture()">
                Submit
              </button>
            </div>
            <div class="col-sm-6" id="profilePicture"></div>
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

// const data = FD.entries().next()

// myFormData.append('action', 'ADD')
// myFormData.append('param', 0)
// myFormData.append('secondParam', 0)
// myFormData.append('file', new Blob({ type: 'text/csv' }))

// const onChangeUploadPicture = () => {
//   console.log("Got it")
//   const myFormData = new FormData()
//   myFormData.append('faridsImage', document.getElementById('fileUpload').files[0])

//   var xhr = new XMLHttpRequest()
//   xhr.open('POST', '/api/upload', true)
//   xhr.setRequestHeader('Content-Type', 'multipart/form-data')
//   xhr.onload = function () {
//     if (xhr.readyState === xhr.DONE && xhr.status === 200) {
//       console.log('xhr.responseText\n', xhr.responseText)
//     }
//   };
//   xhr.send(myFormData);
// }