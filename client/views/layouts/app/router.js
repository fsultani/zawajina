console.log(`router`);

document.getElementById("app").innerHTML = `
  {{> app-nav }}
  <div style="margin-top: 75px;">
    {{{ body }}}
  </div>`