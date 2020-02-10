const Body = () => {
  const bodyStyles = document.createElement('link');
  bodyStyles.rel = "stylesheet"
  bodyStyles.href = '/static/client/app/body-styles.css';

  document.head.appendChild(bodyStyles);

  axios.get("/api/user-details").then(res => {
    const { name } = res.data;
    const Content = `
      <div class="container">
        <h1>Welcome home, ${name}!</h1>
      </div>
    `;
    document.getElementById('main-app').innerHTML = Content;
  })
}

export default Body;
