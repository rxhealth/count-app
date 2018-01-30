(function () {
  const { app } = window.hyperapp
  const { div, span, button, footer, aside } = window.html

  const state = {
    a: 0,
    b: 0,
    op: '+',
    correct: 0,
    disabledAnswers: {},
    language: localStorage.getItem('language') || 'ру',
    rightAnswer: null
  }

  const switchLanguage = (language) =>
    language === 'ру' ? 'en' : 'ру'

  const heroMessage = (language) =>
    language === 'ру' ? 'счет' : 'count'

  const random = () => Math.floor(Math.random() * 10)

  const actions = {
    nextQuestion: () => state => ({
      a: random(),
      b: random(),
      disabledAnswers: {},
      rightAnswer: null
    }),
    answer: (answer) => (state, actions) => {
      if (state.a + state.b === answer) {
        setTimeout(actions.nextQuestion, 2000)
        return {
          correct: state.correct + 1,
          rightAnswer: answer
        }
      }

      const disabledAnswers = state.disabledAnswers
      disabledAnswers[String(answer)] = true

      return {disabledAnswers}
    },
    language: () => (state) => {
      language = switchLanguage(state.language)
      localStorage.setItem('language', language)
      return {language}
    }
  }

  const correctAnswers = (language, n) =>
    language === 'ру' ? `правильно ${n}` : `correct ${n}`

  const view = (state, actions) => {
    console.log(state.disabledAnswers)
    const answers = Array.from(Array(20)).map((x, k) => k)
      .map(k => {
        const attributes = {}
        if (state.disabledAnswers[String(k)]) {
          attributes.disabled = 'disabled'
        } else {
          attributes.onclick = actions.answer.bind(null, k)
        }
        return button(attributes, String(k))
      })

    const problem = [span({class: 'a-op-b'}, `${state.a}${state.op}${state.b}`)]

    let problemAttributes = {class: 'problem'}
    if (state.rightAnswer !== null) {
      problemAttributes = {class: 'problem right'}
      problem.push(span({}, ` = ${state.rightAnswer}`))
    }

    return div([
      div({class: 'hero'}, heroMessage(state.language)),
      div(problemAttributes, problem),
      div({class: 'answers'}, answers),
      footer({}, correctAnswers(state.language, state.correct)),
      aside({
        class: 'language',
        onclick: actions.language
      }, state.language)
    ])
  }

  app(state, actions, view, document.getElementById('app'))
}())