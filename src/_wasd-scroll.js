import { selectors } from './selectors.js'

function elementIsHidden(el) {
  return (el.offsetParent === null)
}

function getCurrentElement (elementList) {
  if (!elementList) return
  const positionArray = []
  elementList.forEach(e => positionArray.push(e.getBoundingClientRect().top))

  let targetIndex = positionArray.findIndex(e => e > -10)
  if (targetIndex === -1) return
  return elementList[targetIndex]
} // end of scrollToPreviousElement

function screenIsScrolledToTop () {
  const body = document.querySelector('body')

  return body
    ? (body.getBoundingClientRect().top > -10) // within 10 pixels of the top
    : undefined
}

function screenIsScrolledToBottom () {
  const html = document.querySelector('html')
  const body = document.querySelector('body')

  // html.clientHeight is the height of the visible window
  // body.clientHeight is the height of all elements combined

  return (html && body)
    ? ((body.clientHeight + body.getBoundingClientRect().top) < (html.clientHeight + 5))
    : undefined
}

export function elementScrollJump (ev) {
  if (document.activeElement.tagName === "INPUT") return
  if (document.activeElement.tagName === "TEXTAREA") return

  const upList
    = [ 38 // up arrow
      , 87 // w key
      ]
  const downList
    = [ 40 // down arrow
      , 83 // s key
      ]
  const clickList
    = [ 39 // right arrow
      , 68 // d key
      ]

  const activeKeyCode = ev.keyCode

  if  (!activeKeyCode
      || [...upList, ...downList, ...clickList].indexOf(activeKeyCode) === -1
      ) { return }

  const postList = []
  const postElements = document.querySelectorAll(selectors.singlePost)
  postElements.forEach(e => {if (!elementIsHidden(e)) {postList.push(e)}})

  if (clickList.indexOf(activeKeyCode) !== -1 && selectors.linkSelector) {
    const targetEl = getCurrentElement(postList)
    let linkElement = targetEl.querySelector(selectors.linkSelector).parentNode
    if (!linkElement) return
    linkElement.setAttribute('target', '_blank')
    linkElement.click()
    return
  }

  ev.preventDefault()

  if (upList.indexOf(activeKeyCode) !== -1) {
    // console.log("Scrolling to previous element...")
    scrollToPreviousElement(postList)
  } else if (downList.indexOf(activeKeyCode) !== -1) {
    // console.log("Scrolling to next element...")
    scrollToNextElement(postList)
  }

} // end of elementScrollJump

function scrollToPreviousElement (elementList) {
  if (!elementList) return
  const positionArray = []
  let targetIndex = elementList.length - 1

  // if you're at the very top (within 10 pixels), go the very bottom
  if (screenIsScrolledToTop()) {
    window.scrollTo(0,document.body.scrollHeight)
  } else if (screenIsScrolledToBottom()) {
    // if you're at the very bottom (within 5 pixels), go to last element (or the very top)
    elementList[elementList.length - 1]
      ? elementList[elementList.length - 1].scrollIntoView()
      : window.scrollTo(0,0)
  } else {
    elementList.forEach(e => positionArray.push(e.getBoundingClientRect().top))
    targetIndex = positionArray.findIndex(e => e > -10)

    if (targetIndex === 0) {
      window.scrollTo(0,0)
    } else if (targetIndex >= 1) {
      elementList[targetIndex - 1].scrollIntoView()
    }
  } // end else

  return elementList[targetIndex]
} // end of scrollToPreviousElement

function scrollToNextElement (elementList) {
  if (!elementList) return

  const positionArray = []
  let targetIndex = 0

  // if you're at the very bottom (within 5 pixels), go the very top
  if (screenIsScrolledToBottom()) {
    window.scrollTo(0,0)
  } else if (screenIsScrolledToTop()) {
    // if you're at the very top (within 10 pixels), go the first element (or the very bottom)
    elementList[0]
      ? elementList[0].scrollIntoView()
      : window.scrollTo(0,document.body.scrollHeight)
  } else {
    elementList.forEach(e => positionArray.push(e.getBoundingClientRect().top))
    targetIndex = positionArray.findIndex(e => e > 10)
    if (targetIndex === -1) {
      window.scrollTo(0,document.body.scrollHeight)
    } else {
      elementList[targetIndex].scrollIntoView()
    }

  } // end else

  return elementList[targetIndex]
} // end of scrollToNextElement
