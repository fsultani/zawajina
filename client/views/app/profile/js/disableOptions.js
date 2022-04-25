const disableOptions = () => {
  const blockReportUserDropdown = getQuerySelector('.block-report-user-dropdown');
  blockReportUserDropdown.style.cssText = `display: none;`

  const contactWrapper = getQuerySelector('.contact-wrapper');
  contactWrapper.style.cssText = `
    pointer-events: none;
  `;
}
