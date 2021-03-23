import  { addCustomStyleTag }         from './src/_styles.js'
// import  { elementScrollJump }         from './src/_wasd-scroll.js'
import  { modalBlockId
        , getMainModalElement
        , createModalBlock
        , createCollapsibleSectionContainer
        } from './src/_draggable-modal.js'

import { selectors }          from './src/selectors.js'

const noDisplayString = "display:none;"

const elementSelector
  = { expandCollapseButtonName: '.ghx-swimlane .aui-button[role="button"]'
    , expandCollapseButtonParentNodeCount: 3
    , buttonContainerParentNodeCount: 1
    // I'm not sure which containers are completely re-rendered,
    // which would remove any MutationObserver I create
    // So I've opted to use the very highlevel selection of 'section#content'
    // which contains basically the whole page
    // , mainContainerForAllTickets:  '.ghx-work#ghx-work'
    // , mainContainerForAllTickets:  'section#content'
    , mainContainerForAllTickets:  'div#content'
    }

const hideButtonAttributes
  = { specialId: "custom-hide-button"
    , hideLabel: "Disable Filters"
    , showLabel: "Enable Filters"
    , hideClass: "hide-button" // This option can invert the active/inactive
    , showClass: "live-button" // behavior compared to other buttons
    , localStorageBooleanLabel: "isHidingPosts"
    , singlePost: "" }

const extraFieldsButtonAttributes
  = { specialId: "custom-hide-button-extra-fields"
    , hideLabel: "Show Extra Fields"
    , showLabel: "Hide Extra Fields"
    , localStorageBooleanLabel: "hideExtraFields"
    , singlePost: ".ghx-issue-content .ghx-extra-fields" }

const epicButtonAttributes
  = { specialId: "custom-hide-button-epic"
    , hideLabel: "Show Epics"
    , showLabel: "Hide Epics"
    , localStorageBooleanLabel: "hideEpics"
    , singlePost: ".ghx-highlighted-fields" }

const footerButtonAttributes
  = { specialId: "custom-hide-button-footer"
    , hideLabel: "Show Card Footers"
    , showLabel: "Hide Card Footers"
    , localStorageBooleanLabel: "hideFooters"
    , singlePost: ".ghx-card-footer > :not(.ghx-avatar)" }

addCustomStyleTag()
createModalBlock()
hidePieces()
const bod = document.querySelector('body')
// bod.addEventListener("keydown", elementScrollJump)

setTimeout(
  () => {
    // console.log('Running the setTimeout function!')
    putMutationObserverOnMainElement(bod, hidePieces)
    hidePieces()
    createButtonsToRemoveKanbanSections()
    createActiveDeveloperCheckboxes()
  }
, 1500)

// ===========================================================================
// Begin support functions
// Nothing invoked beneath this point
// ===========================================================================

function getHideStatus (string) {
  const rawJSON = localStorage.getItem(string || 'isHidingPosts') || 'false'
  return JSON.parse(rawJSON)
}

function getNameFromDevIcon (el) {
  const res
    = { visible: "NO_NAME"
      , id: "NO_ID" }
  if (el.dataset && el.dataset.tooltip) {
    res.visible = el.dataset.tooltip.split(':')[1].trim()
    res.id = res.visible.replace(/[^a-zA-Z]+/, '').toLowerCase()
  }
  return res
}

function getActiveDevelopers () {
  const rawJSON = localStorage.getItem('activeDevelopers') || '{}'
  const activeDevelopers = JSON.parse(rawJSON)

  const imgElements = document.querySelectorAll(selectors.singlePost)
  if (!imgElements) return activeDevelopers

  imgElements.forEach(el => {
    const nameObj = getNameFromDevIcon(el)
    activeDevelopers[nameObj.id] = activeDevelopers[nameObj.id] || {}
    const curDev = activeDevelopers[nameObj.id]
    curDev.label = nameObj.visible
    curDev.active = curDev.active === undefined ? true : curDev.active

  }); // end forEach imgElement

  return activeDevelopers
}

function hidePieces (buttonAttributes) {
  // each through all selectors collections
  const mainModalElement = getMainModalElement()
  const hideBadPosts = getHideStatus()
  hideBadPosts
    ? mainModalElement.classList.remove('deactivated-filters')
    : mainModalElement.classList.add('deactivated-filters')
  // console.log(`${hideBadPosts ? 'Hiding' : 'Revealing'} those posts...`)

  const collectionList
    = buttonAttributes
      ? [ buttonAttributes ]
      : [ hideButtonAttributes
        , extraFieldsButtonAttributes
        , epicButtonAttributes
        , footerButtonAttributes ]

  collectionList.forEach(buttonAttributesX => {
    createHideButton(buttonAttributesX)
    if (!buttonAttributesX.singlePost) return
    const postElements = document.querySelectorAll(buttonAttributesX.singlePost)
    if (!postElements) return

    postElements.forEach((el) => {
      let targetEl = el
      const isHidden = getHideStatus(buttonAttributesX.localStorageBooleanLabel)
      if (isHidden && hideBadPosts) {
        targetEl.style = noDisplayString
      } else {
        targetEl.style = ""
        // (targetEl.style || '').replace("display:none;", "")
      }
    }) // end postElements forEach

  }) // end forEach collectionList

  updateActiveDevelopers()
  const activeDevelopers = getActiveDevelopers()
  // console.log(JSON.stringify(activeDevelopers, null, 2));

  const cardElements = document.querySelectorAll(selectors.singlePost)
  if (!cardElements) return
  cardElements.forEach(el => {
    let targetEl = el
    for (let i = 0; i < selectors.parentNodeCount; i++) {targetEl = targetEl.parentNode}
    const nameObj = getNameFromDevIcon(el)

    const isHidden = !(nameObj && nameObj.id && activeDevelopers && activeDevelopers[nameObj.id] && activeDevelopers[nameObj.id]['active'])
    if (isHidden && hideBadPosts) {
      targetEl.style = noDisplayString
    } else {
      targetEl.style = ""
      // (targetEl.style || '').replace("display:none;", "")
    }

  }); // end cardElements forEach


} // end hidePieces function

function createHideFunction(string) {
  return () => {
    localStorage.setItem((string || 'isHidingPosts'), JSON.stringify(!getHideStatus(string || 'isHidingPosts')));
    hidePieces()
  } // end callback function
} // end createHideFunction

function createHideButton (buttonAttributes) {
  buttonAttributes = buttonAttributes || hideButtonAttributes
  const buttonContainerElement = getMainModalElement()
  if (!buttonContainerElement) {
    console.log('well shit')
    return
  }

  if (!buttonAttributes.specialId) return

  let hideButtonElement = buttonContainerElement.querySelector(`#${buttonAttributes.specialId}`)
  const buttonJustCreated = !hideButtonElement
  if (!hideButtonElement) {
    console.log("creating hide button...")
    hideButtonElement     = document.createElement('button')
    hideButtonElement.id  = buttonAttributes.specialId
    hideButtonElement.addEventListener('click', createHideFunction(buttonAttributes.localStorageBooleanLabel))
  }

  hideButtonElement.innerText
    = getHideStatus(buttonAttributes.localStorageBooleanLabel)
      ? buttonAttributes.hideLabel
      : buttonAttributes.showLabel
  hideButtonElement.className
    = getHideStatus(buttonAttributes.localStorageBooleanLabel)
      ? `modal-button ${buttonAttributes.hideClass || 'hide-button'}`
      : `modal-button ${buttonAttributes.showClass || 'live-button'}`

  if (buttonJustCreated) buttonContainerElement.append(hideButtonElement)

} // end createHideButton


function createButtonsToRemoveKanbanSections () {
  const buttonList
    = document.querySelectorAll(elementSelector.expandCollapseButtonName)

  if (buttonList.length === 0) {
    console.log("Unable to add buttons for Kanban section removal");
    return
  }

  buttonList.forEach(button => {
    let buttonContainerDiv = button
    for (let i = 0; i < elementSelector.buttonContainerParentNodeCount; i++) {
      buttonContainerDiv = button.parentNode
    }
    let newButton = buttonContainerDiv.querySelector(`#${hideButtonAttributes.specialId}`)
    if (!newButton) {
      const newButton = document.createElement('button')
      newButton.id          = hideButtonAttributes.specialId
      newButton.innerHTML   = "Hide Section" // hideButtonAttributes.hideLabel
      newButton.addEventListener('click', createSectionHiderFunction(buttonContainerDiv))
      buttonContainerDiv.appendChild(newButton)
    } // end if statement
  })
}

function createSectionHiderFunction (sectionDiv) {
  return () => {
    sectionDiv.style = "display: none;"
  }
}

function putMutationObserverOnMainElement (el, callback) {
  let mainElementTarget
    = document.querySelector(elementSelector.mainContainerForAllTickets)

  // configuration of the observer:
  const mainElementConfig
    = { childList: true
      , subtree: true
      }

  // create an observer instance
  const mainElementObserver
    = new MutationObserver(callback) // end MutationObserver

  // pass in the target node, as well as the observer options
  mainElementObserver.observe(mainElementTarget, mainElementConfig)
} // end putMutationObserverOnMainElement


function createActiveDeveloperCheckboxes () {
  const activeDevContainerDiv = createCollapsibleSectionContainer("Active Developers", "active-dev")

  let inputListContainer = document.querySelector('.modal-input-list.developers')
  const inputIsNew = !inputListContainer
  if (!inputListContainer) {
    inputListContainer = document.createElement('ul')
  }
  inputListContainer.innerHTML = ''
  inputListContainer.setAttribute('class','modal-input-list developers')
  inputListContainer.onclick="event.stopPropagation()"
  inputListContainer.onmousedown="event.stopPropagation()"

  const activeDevelopers = getActiveDevelopers()
  const sortedKeys = Object.keys(activeDevelopers)
  sortedKeys.sort()
  sortedKeys.forEach(key => {
    const newListItem = document.createElement('li')

    let newInput = document.querySelector(`#modal-checkbox-${key}`)
    if (newInput) return // don't create duplicates
    newInput = document.createElement('input')
    newInput.setAttribute('class',`input-modal-checkbox`)
    newInput.setAttribute('id',`modal-checkbox-${key}`)
    newInput.setAttribute('type',`checkbox`)
    // newInput.setAttribute('data-diff-selector',`${devList[key]}`)
    newInput.oninput = function(e) {
      this.setAttribute('value', newInput.checked)
    }

    newInput.checked = !!activeDevelopers[key]['active']

    const newLabel = document.createElement('label')
    newLabel.innerText = activeDevelopers[key]['label']
    // newListItem.append(newCount)
    newListItem.append(newInput)
    newListItem.append(newLabel)
    inputListContainer.append(newListItem)
  }) // end for each

  if (inputIsNew) {
    putMutationObserverOnInputList(inputListContainer, hidePieces)
    activeDevContainerDiv.append(inputListContainer)
  }
} // end createDifficultyCheckboxes

function putMutationObserverOnInputList (el, callback) {
  let inputEl = el
  if (!inputEl) return

  // configuration of the observer:
  const inputElConfig
    = { attributes: true
      , characterData: true
      , subtree: true
      }

  // create an observer instance
  const mainElementObserver
    = new MutationObserver(mutations => {callback()}) // end MutationObserver

  // pass in the target node, as well as the observer options
  mainElementObserver.observe(inputEl, inputElConfig)
} // end createActiveDeveloperCheckboxes

function updateActiveDevelopers () {
  const listInputElements = document.querySelectorAll('.modal-input-list.developers input[type="checkbox"]')
  if (!listInputElements) return

  const activeDevelopers = getActiveDevelopers()

  listInputElements.forEach(el => {
    const key = el.id.replace("modal-checkbox-", '')
    if (activeDevelopers[key]) {
      activeDevelopers[key]['active'] = !!el.checked
    }
  });

  localStorage.setItem('activeDevelopers', JSON.stringify(activeDevelopers))
}
