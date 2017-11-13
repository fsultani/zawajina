if (window.location.pathname === '/home' && Cookies.get('token')) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/home-test')
  // xmlHttp.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    console.log("xhr.readyState\n", xhr.readyState)
    // if (this.status == 200) {
    //   const response = JSON.parse(this.responseText);

    //   const layout = `
    //     <div class="container">
    //       <div class="row">
    //         <div class="header clearfix">
    //           <nav style="padding-top: 10px">
    //             <ul class="nav nav-pills pull-left">
    //               <li role="presentation">
    //                 <a href="/"><h3>My App</h3></a>
    //               </li>
    //             </ul>
    //             <ul class="nav nav-pills pull-right">
    //               <li role="presentation"><a href="/logout">Log Out</a></li>
    //               <li role="presentation"><a href="/messages">Messages</a></li>
    //               <li role="presentation"><a href="/users/member">Profile</a></li>
    //             </ul>
    //           </nav>
    //         </div>
    //         </div>
    //       </div>
    //     </div>
    //   `;

    //   const welcome = `
    //     <center>
    //       <h1>Welcome home!</h1>
    //       <h3>All members on this site</h3>
    //   `;

    //   let output = `<div class="col-md-8 col-md-offset-2">`;

    //   response.map((user) => {
    //     output += `
    //       <a href="/users/${user.username}" style="text-decoration: none">
    //         <div class="col-md-6">
    //           <div class="thumbnail" style="border-radius: 12px">
    //             <h3 style="margin: 20px 0px">${user.first_name}</h3>
    //           </div>
    //         </div>
    //       </a>
    //     `;
    //   })
    //   output += `</div></center>`;
    //   const htmlOutput = layout + welcome + output;
    //   document.getElementById('my-app').innerHTML = htmlOutput;
    // }
  }
  xhr.send()
}

// window.addEventListener('load', () => {
//   if (window.location.pathname === '/home') {
//     var xhr = new XMLHttpRequest();

//     xhr.open('GET', '/home-test', true)
//     xhr.onload = function() {
//       if (this.status == 200) {
//         const response = JSON.parse(this.responseText);

//         const layout = `
//           <div class="container">
//             <div class="row">
//               <div class="header clearfix">
//                 <nav style="padding-top: 10px">
//                   <ul class="nav nav-pills pull-left">
//                     <li role="presentation">
//                       <a href="/"><h3>My App</h3></a>
//                     </li>
//                   </ul>
//                   <ul class="nav nav-pills pull-right">
//                     <li role="presentation"><a href="/logout">Log Out</a></li>
//                     <li role="presentation"><a href="/messages">Messages</a></li>
//                     <li role="presentation"><a href="/users/member">Profile</a></li>
//                   </ul>
//                 </nav>
//               </div>
//               </div>
//             </div>
//           </div>
//         `;

//         const welcome = `
//           <center>
//             <h1>Welcome home!</h1>
//             <h3>All members on this site</h3>
//         `;

//         let output = `<div class="col-md-8 col-md-offset-2">`;

//         response.map((user) => {
//           output += `
//             <a href="/users/${user.username}" style="text-decoration: none">
//               <div class="col-md-6">
//                 <div class="thumbnail" style="border-radius: 12px">
//                   <h3 style="margin: 20px 0px">${user.first_name}</h3>
//                 </div>
//               </div>
//             </a>
//           `;
//         })
//         output += `</div></center>`;
//         const htmlOutput = layout + welcome + output;
//         document.getElementById('my-app').innerHTML = htmlOutput;
//       }
//     }
//     xhr.send()
//   }
// })