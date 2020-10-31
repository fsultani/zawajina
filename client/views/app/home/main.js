// (async () => {
//   const loader = display => {
//     document.querySelector(".full-page-loading-spinner").style.display = display
//       ? "inline-block"
//       : "none";
//   };

//   loader(true);

//   const response = await axios.get("/api/all-members", {
//     headers: {
//       Authorization: Cookies.get("token"),
//     },
//   });
//   loader(false);

//   const { user, allUsers } = response.data;
//   const content = `
//     <div class="testimonials">
//       ${allUsers
//         .map(
//           user => `
//         <a href="/user/${user._id}" style="text-decoration: none">
//           <div class="testimonial-wrapper">
//             <div class="testimonial-image">
//               <img src="${
//                 user.photos.length > 0
//                   ? user.photos[0]
//                   : user.gender === "male"
//                   ? "https://my-match.s3.amazonaws.com/male.png"
//                   : "https://my-match.s3.amazonaws.com/female.png"
//               }" />
//             </div>
//             <div class="testimonial-body">
//               <div class="testimonial-name">${user.name}, ${user.age}</div>
//               <p class="location">${user.city}, ${user.state}</p>
//               <p class="country">${user.country}</p>
//             </div>
//           </div>
//         </a>
//       `
//         )
//         .join("")}
//     </div>
//   `;

//   document.querySelector("#allUsers").innerHTML = content;
//   document.querySelector("#profile").href = `/user/${user._id}`;
// })();
