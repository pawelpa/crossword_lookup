import './style.css'

const clearBtn = document.querySelector('input[type=button]')
const lookupForm = document.querySelector('#crosswordForm')
const results = document.querySelector("#results")
const length = document.querySelector('#length')
const inputs = document.querySelector('#inputs')

const maxLength = 16

function focusOnFirstElement() {
  const firstInput = document.querySelector('input[name="1"]')
  firstInput.focus()
}

function createInputs(num) {

  inputs.innerHTML = ''

  for(let i = 3; i < 3 + num; i++ ) {
    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('maxlength','1')
    input.setAttribute('name', `${i-2}`)
    inputs.appendChild(input)
  }
  focusOnFirstElement()
  bindEventToInput()
}

function fillSelectOption() {
  for( let i = 3; i <= maxLength; i++) {
    const option = document.createElement('option')
    option.setAttribute('value', i)
    option.innerText = i
    length.appendChild(option)
  }
  createInputs(3)
}

fillSelectOption()

function bindEventToInput() {
  const text_inputs = document.querySelectorAll('input[type=text]')

  text_inputs.forEach(input => {
    input.addEventListener('keydown', e => {
      const event = window.event ? window.event : e
      if(event.keyCode == 39 && e.target.nextElementSibling)
        e.target.nextElementSibling.focus()
      if(event.keyCode == 37 && e.target.previousElementSibling)
        e.target.previousElementSibling.focus()
    })
  })

  text_inputs.forEach( input => {
    input.addEventListener('keyup', e => {
      const event = window.event ? window.event : e
      if( e.target.nextElementSibling && 
          event.keyCode != 39 &&
          event.keyCode != 37 &&
          event.keyCode != 8 &&
          event.keyCode != 46
          )
        e.target.nextElementSibling.focus()
    })
    
  })
}

length.addEventListener('change', e => {
  createInputs(+length.value)
})

clearBtn.addEventListener('click', e => {
const text_inputs = document.querySelectorAll("input[type=text]")

  text_inputs.forEach( input => {
    input.value = '';
    results.innerHTML = ''
  })
  focusOnFirstElement()
})


lookupForm.addEventListener('submit', async  e => {
  e.preventDefault()

  const formJson = {}

  const data = new FormData(lookupForm)

  data.forEach((value, key) => {
    if( key != 'length') {
      formJson[key] = value
    }
  })

  const headers = new Headers();

  headers.append('Content-Type', 'application/json')

  const response = await fetch('https://crossword-lookup-server.vercel.app/api/crossword',
    {
      headers,
      method: 'POST',
      body: JSON.stringify(formJson)
    })

    if(response.ok) {
      showResults(await response.json())
    }
})

const showResults = (data) => {

  results.innerHTML = ''

  if(data.length === 0) {
    const p = document.createElement('p')
    p.innerText = 'No words found'
    results.appendChild(p)
  } else {
    data.forEach(element => {
      const p = document.createElement('p')
      p.innerText = element.word
      results.appendChild(p)
    })
  }


} 




