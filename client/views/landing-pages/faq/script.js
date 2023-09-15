const listOfFaq = [
  {
    question: `How is this site different from the rest?`,
    answer: `Most sites don't show mutual matches.&nbsp;&nbsp;Our algorithm takes into account what you are looking for, as well as the other person, and matches you based on your individual preferences.&nbsp;&nbsp;This saves you lots of time, and allows you to find meaningful and quality matches.`,
  },
  {
    question: `How much do you charge?`,
    answer: `We are free for now.&nbsp;&nbsp;Enjoy!`,
  },
  {
    question: `How do I search for users?`,
    answer: `Just head to the search page from the navigation bar at the top.&nbsp;&nbsp;Set whatever search preferences you want, and click "Search".<br /><br />It's important to note that each preference you set works as a deal-breaker.&nbsp;&nbsp;For example, if you specify an age range, then you will only be shown users within that age range, and the users that are shown to you are interested in someone your age.`,
  },
  {
    question: `How do I block someone?`,
    answer: `You may block someone from their profile page.&nbsp;&nbsp;Click the three vertical dots next to their name, and choose "Block".&nbsp;&nbsp;You may also report users for inappropriate behavior.`,
  },
  {
    question: `How do I delete my account?`,
    answer: `You may delete your account from your settings page.`,
  },
];

const accordion = getQuerySelector('.accordion')
listOfFaq.map(({ question, answer }) => {
  accordion.innerHTML += `
    <div class="container">
      <p class="label">${question}</p>
      <p class="content">${answer}</p>
    </div>
  `
})

const container = document.getElementsByClassName('container');
for (i = 0; i < container.length; i++) {
  container[i].addEventListener('click', event => {
    event.currentTarget.classList.toggle('active');
  })
}
