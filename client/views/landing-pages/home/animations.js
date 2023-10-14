const scrollToSection = id => {
  const element = getQuerySelectorById(id)

  element.scroll({
    top: 0,
    behavior: 'smooth',
  });
}
