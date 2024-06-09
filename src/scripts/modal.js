export { openPopup, closePopup }

const openedPopup = 'popup_is-opened'

const closeByEsc = (evt) => {if (evt.key === 'Escape') closePopup(document.querySelector(`.${openedPopup}`))}

const closeByOuterClick = () => closePopup(document.querySelector(`.${openedPopup}`))

function openPopup(popup) {
  popup.classList.add(openedPopup);
  popup.addEventListener('click', closeByOuterClick);
  document.addEventListener('keydown', closeByEsc);
}

function closePopup(popup) {
  popup.classList.remove(openedPopup);
  document.removeEventListener('keydown', closeByEsc);
}
