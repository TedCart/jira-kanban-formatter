// import { addCustomModalStyleTag } from "./_styles.js"

export const modalBlockId = "draggable-modal-block"

const collapsingArrowSvg
  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="17px" height="17px">
      <g fill="none" fill-rule="evenodd">
        <path d="M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z" fill="#FFFFFF">
        </path>
      </g>
    </svg>`

export function getMainModalElement () {
  return document.querySelector(`#${modalBlockId}`)
}

export function createModalBlock () {

  addCustomModalStyleTag()
  const modalBlock = document.createElement('div')
  modalBlock.setAttribute('id', modalBlockId)
  // modalBlock.setAttribute('title', "Click and hold to drag...")

  document.querySelector('body').prepend(modalBlock)

  modalBlock.onmousedown = moveModalContainer
  modalBlock.ondragstart = () => false

  // This function came from https://javascript.info/mouse-drag-and-drop
  function moveModalContainer (event) {

    if (event.target.tagName === "INPUT") return
    if (event.target.tagName === "BUTTON") return
    if (event.target.tagName === "SPAN") return
    if (event.target.tagName === "SECTION") return
    if (event.target.tagName === "LABEL") return
    if (event.target.tagName === "SVG") return
    if (event.target.tagName === "G") return
    if (event.target.tagName === "PATH") return
    // if (event.target.tagName === "LI") return

    // const modalBlock = document.querySelector(`#${modalBlockId}`)
    // if (!modalBlock) return

    const top = document.querySelector('html').scrollTop

    let shiftX = event.clientX - modalBlock.getBoundingClientRect().left;
    let shiftY = event.clientY - modalBlock.getBoundingClientRect().top;
    modalBlock.style.position = 'fixed';
    modalBlock.style.zIndex = 1000;
    document.body.append(modalBlock);

    moveAt(event.pageX, event.pageY);

    // moves the modalBlock at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      modalBlock.style.left = pageX - shiftX + 'px';
      modalBlock.style.top = (pageY - top) - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the modalBlock on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the modalBlock, remove unneeded handlers
    modalBlock.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      modalBlock.onmouseup = null;
    };

  }; // end moveModalContainer

  // return modalBlock
}

export function createCollapsibleSectionContainer (sectionTitle, idPrefix) {
  const el = getMainModalElement()
  if (!el) return

  const firstAttempt = el.querySelector(`#${idPrefix}-filter-container`)
  if (firstAttempt) return firstAttempt

  function toggleSectionVisibility (ev) {
    const clickableDiv = ev.target.closest(`#${idPrefix}-filter-container > .section-header`)
    if (!clickableDiv) return;
    ev.preventDefault()
    const containerDiv = document.querySelector(`#${idPrefix}-filter-container`)
    const isOpen = /open/.test(containerDiv.className)

    if (isOpen) {
      containerDiv.classList.remove('open')
      localStorage.setItem(`${idPrefix}IsHidden`, 'true')
    } else {
      containerDiv.classList.add('open')
      localStorage.setItem(`${idPrefix}IsHidden`, 'false')
    }
  } // end toggleSectionVisibility

  // Putting this click listener on the document is (ironically) better for performance
  // https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/
  document.addEventListener('click', toggleSectionVisibility)

  const sectionContainerDiv = document.createElement('section')
  sectionContainerDiv.setAttribute('id',`${idPrefix}-filter-container`)
  if (!JSON.parse(localStorage.getItem(`${idPrefix}IsHidden`) || 'false')) {
    sectionContainerDiv.setAttribute('class','open')
  }

  const sectionHeaderDiv = document.createElement('section')
  sectionHeaderDiv.setAttribute('class','section-header')

  const toggleArrowDiv = document.createElement('section')
  toggleArrowDiv.setAttribute('class','toggle-arrow')
  toggleArrowDiv.innerHTML = collapsingArrowSvg
  sectionHeaderDiv.append(toggleArrowDiv)

  const sectionHeaderText = document.createElement('span')
  sectionHeaderText.setAttribute('class','modal-section-header')
  sectionHeaderText.innerText = sectionTitle
  sectionHeaderDiv.append(sectionHeaderText)

  sectionContainerDiv.append(sectionHeaderDiv)
  el.append(sectionContainerDiv)

  return sectionContainerDiv
} // end createCollapsibleSectionContainer

function addCustomModalStyleTag () {
  const newStyle = document.createElement("style")
  newStyle.setAttribute('type', 'text/css')
  // classToColor background, color, padding, margin
  newStyle.innerHTML = `
    svg { pointer-events: none; }
    .modal-button {
      text-align: center;
      margin:auto;
      display: block;
      min-width: 7em;
      border: 1px solid #777;
      padding: 3px 5px;
      border-radius: 5px;
    }
    .modal-section-header {
      display: inline-block;
      cursor: pointer;
      font-size: 1.2em;
    }
    .hide-button {
      margin-bottom:5px;
      /* background: #DDD; */
      /* color:#222; */
      border: 1px solid #777;
      border-radius: 2px;
      padding: 3px;
    }
    .live-button {
      margin-bottom:5px;
      font-weight: 800;
      font-size: 107%;
      border: 1px solid #777;
      border-radius: 3px;
      padding: 3px;
      color: #EEE;
      background: #2762a6;
    }
    .modal-input-list-button {
      background: #000;
      color: #DDD;
    }
    #draggable-modal-block {
      position: fixed;
      top: 40px;
      left: 10px;
      padding: 15px 5px;
      min-height: 20px;
      min-width: 20px;
      background: #333333BB;
      color: #DDD;
      z-index: 1000;
      border: solid transparent 1px;
      border-radius: 8px;
      transition: 500ms;
      opacity: .3;
    }
    #draggable-modal-block:hover {
      background: #333333BB;
      transition: 0ms;
      opacity: 1;
    }
    .deactivated-filters#draggable-modal-block button,
    .deactivated-filters#draggable-modal-block section {
      display: none;
    }
    .deactivated-filters#draggable-modal-block button:nth-child(1) {
      display: block;
    }
    .input-modal-checkbox {
      display:inline-block;
      margin-left: 25px;
    }

    .modal-input-list label {
      display: inline-block;
      margin: 0 0 0 8px;
      font-size: 1em;
    }
    .modal-input-list li { margin: 0; }

    section.section-header {
      display: flex;
    }

    .toggle-arrow {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 25px;
      width:  25px;
      border-radius: 2px;
      margin: 0;
      transition: 300 ms;
      cursor: pointer;
      /* transform: rotate(-90deg); */
      opacity: .8;
    }
    .toggle-arrow:hover {
      opacity: 1;
      background: black;
    }

    .toggle-arrow svg       { transform: rotate(-90deg); transition: 300ms; }
    .open .toggle-arrow svg { transform: rotate(0deg); }

    .modal-input-list {
      opacity: 0;
      display: none;
      visibility: hidden;
      transition: visibility 0s lineaer 0.1s, opacity 0.3s ease;
      padding: 0;
      margin: 0;
    }
    .open .modal-input-list {
      display: block;
      visibility: visible;
      opacity: 1;
      transition-delay: 0s;
    }
    .modal-input-list li {
      display: block;
    }
  `
  document.head.appendChild(newStyle)
}
