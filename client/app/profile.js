const Profile = () => {
  axios.get("/api/all-members", {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(res => {
    const content = `
      <div>
        <h2 class="testimonials-header">Profile</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor urna nunc id cursus metus aliquam eleifend mi. Porttitor eget dolor morbi non arcu risus quis. Ac auctor augue mauris augue neque gravida in fermentum et. Mauris augue neque gravida in. Odio ut enim blandit volutpat. Nisl nunc mi ipsum faucibus vitae. Auctor neque vitae tempus quam pellentesque nec nam aliquam. Sed sed risus pretium quam. Urna duis convallis convallis tellus id. Neque vitae tempus quam pellentesque.

        Euismod quis viverra nibh cras pulvinar mattis nunc. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Venenatis cras sed felis eget velit aliquet. Interdum varius sit amet mattis. Proin libero nunc consequat interdum varius sit. Dolor purus non enim praesent. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Consectetur libero id faucibus nisl tincidunt eget. Cras ornare arcu dui vivamus arcu felis. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Sed euismod nisi porta lorem mollis aliquam. In metus vulputate eu scelerisque felis imperdiet proin. Nunc id cursus metus aliquam eleifend mi in nulla posuere. Venenatis cras sed felis eget velit.

        Feugiat pretium nibh ipsum consequat. Enim praesent elementum facilisis leo vel fringilla est. Ac auctor augue mauris augue neque gravida in fermentum et. Nullam vehicula ipsum a arcu cursus vitae. Bibendum at varius vel pharetra vel turpis nunc. Magna sit amet purus gravida quis. Egestas maecenas pharetra convallis posuere morbi leo urna molestie at. Faucibus purus in massa tempor nec feugiat nisl. Id neque aliquam vestibulum morbi blandit cursus. Volutpat est velit egestas dui id ornare arcu odio ut. Quis eleifend quam adipiscing vitae. Sit amet consectetur adipiscing elit.

        Est ante in nibh mauris cursus. Sit amet porttitor eget dolor morbi non arcu risus quis. A scelerisque purus semper eget duis at tellus at. Amet justo donec enim diam vulputate ut pharetra sit. Ullamcorper sit amet risus nullam eget felis eget nunc lobortis. Gravida cum sociis natoque penatibus et magnis dis parturient. Id diam maecenas ultricies mi eget mauris pharetra et ultrices. Cras pulvinar mattis nunc sed. Egestas maecenas pharetra convallis posuere. Amet consectetur adipiscing elit duis. Etiam non quam lacus suspendisse faucibus interdum posuere. Amet massa vitae tortor condimentum lacinia. Mauris vitae ultricies leo integer malesuada nunc vel. Nibh praesent tristique magna sit amet purus. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Egestas dui id ornare arcu odio. Tincidunt praesent semper feugiat nibh sed pulvinar proin.

        Mollis nunc sed id semper risus. At tellus at urna condimentum. Cursus sit amet dictum sit amet justo. Aenean sed adipiscing diam donec adipiscing tristique. Turpis egestas pretium aenean pharetra magna ac. Sed blandit libero volutpat sed cras ornare arcu dui. Sit amet dictum sit amet justo donec enim diam vulputate. Pellentesque id nibh tortor id. Tortor dignissim convallis aenean et tortor. Nunc congue nisi vitae suscipit tellus mauris a. Augue interdum velit euismod in. Laoreet id donec ultrices tincidunt arcu non sodales neque. Feugiat vivamus at augue eget. Justo eget magna fermentum iaculis eu non. Imperdiet proin fermentum leo vel orci porta non pulvinar neque. Bibendum enim facilisis gravida neque convallis a. Aliquam sem et tortor consequat id porta nibh venenatis. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien. In massa tempor nec feugiat nisl pretium fusce id.
      </div>
    `;

    document.querySelector('#app').innerHTML = content;
  }).catch(err => {
    console.error("err.response\n", err.response);
    Cookies.remove('token');
    window.location.pathname = '/login';
  })
};

const About = () => {
  axios.get("/api/all-members", {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(res => {
    const content = `
      <div>
        <h2 class="testimonials-header">About</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor urna nunc id cursus metus aliquam eleifend mi. Porttitor eget dolor morbi non arcu risus quis. Ac auctor augue mauris augue neque gravida in fermentum et. Mauris augue neque gravida in. Odio ut enim blandit volutpat. Nisl nunc mi ipsum faucibus vitae. Auctor neque vitae tempus quam pellentesque nec nam aliquam. Sed sed risus pretium quam. Urna duis convallis convallis tellus id. Neque vitae tempus quam pellentesque.

        Euismod quis viverra nibh cras pulvinar mattis nunc. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Venenatis cras sed felis eget velit aliquet. Interdum varius sit amet mattis. Proin libero nunc consequat interdum varius sit. Dolor purus non enim praesent. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Consectetur libero id faucibus nisl tincidunt eget. Cras ornare arcu dui vivamus arcu felis. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Sed euismod nisi porta lorem mollis aliquam. In metus vulputate eu scelerisque felis imperdiet proin. Nunc id cursus metus aliquam eleifend mi in nulla posuere. Venenatis cras sed felis eget velit.

        Feugiat pretium nibh ipsum consequat. Enim praesent elementum facilisis leo vel fringilla est. Ac auctor augue mauris augue neque gravida in fermentum et. Nullam vehicula ipsum a arcu cursus vitae. Bibendum at varius vel pharetra vel turpis nunc. Magna sit amet purus gravida quis. Egestas maecenas pharetra convallis posuere morbi leo urna molestie at. Faucibus purus in massa tempor nec feugiat nisl. Id neque aliquam vestibulum morbi blandit cursus. Volutpat est velit egestas dui id ornare arcu odio ut. Quis eleifend quam adipiscing vitae. Sit amet consectetur adipiscing elit.

        Est ante in nibh mauris cursus. Sit amet porttitor eget dolor morbi non arcu risus quis. A scelerisque purus semper eget duis at tellus at. Amet justo donec enim diam vulputate ut pharetra sit. Ullamcorper sit amet risus nullam eget felis eget nunc lobortis. Gravida cum sociis natoque penatibus et magnis dis parturient. Id diam maecenas ultricies mi eget mauris pharetra et ultrices. Cras pulvinar mattis nunc sed. Egestas maecenas pharetra convallis posuere. Amet consectetur adipiscing elit duis. Etiam non quam lacus suspendisse faucibus interdum posuere. Amet massa vitae tortor condimentum lacinia. Mauris vitae ultricies leo integer malesuada nunc vel. Nibh praesent tristique magna sit amet purus. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Egestas dui id ornare arcu odio. Tincidunt praesent semper feugiat nibh sed pulvinar proin.

        Mollis nunc sed id semper risus. At tellus at urna condimentum. Cursus sit amet dictum sit amet justo. Aenean sed adipiscing diam donec adipiscing tristique. Turpis egestas pretium aenean pharetra magna ac. Sed blandit libero volutpat sed cras ornare arcu dui. Sit amet dictum sit amet justo donec enim diam vulputate. Pellentesque id nibh tortor id. Tortor dignissim convallis aenean et tortor. Nunc congue nisi vitae suscipit tellus mauris a. Augue interdum velit euismod in. Laoreet id donec ultrices tincidunt arcu non sodales neque. Feugiat vivamus at augue eget. Justo eget magna fermentum iaculis eu non. Imperdiet proin fermentum leo vel orci porta non pulvinar neque. Bibendum enim facilisis gravida neque convallis a. Aliquam sem et tortor consequat id porta nibh venenatis. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien. In massa tempor nec feugiat nisl pretium fusce id.
      </div>
    `;

    document.querySelector('#app').innerHTML = content;
  }).catch(err => {
    console.error("err.response\n", err.response);
    Cookies.remove('token');
    window.location.pathname = '/login';
  })
};

const Contact = () => {
  document.querySelector('#app').innerHTML = `<h1>Contact page</h1>`;
}

const Search = () => {
  document.querySelector('#app').innerHTML = `<h1>Search page</h1>`;
}

export { Profile, About, Contact, Search };
