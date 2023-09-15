const scrollToSection = id => {
  const element = getQuerySelectorById(id)
  const top = element.offsetTop;
  // window.scrollTo(0, top);

  element.scroll({
    top: 0,
    behavior: 'smooth',
  });
}