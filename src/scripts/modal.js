export { openPopup, closePopup }

const closeByEsc = (evt, popup, classOpen) => {if (evt.key === 'Escape') {closePopup(popup, classOpen)}}
const closeByOuterClick = (popup, classOpen) => closePopup(popup, classOpen);

function openPopup(popup, classOpen) {
  const closeByEscEvt = (evt) => closeByEsc(evt, popup, classOpen);
  const closeByOuterClickEvt = () => closeByOuterClick(popup, classOpen);
  popup.classList.add(classOpen);
  popup.addEventListener('click', closeByOuterClickEvt);
  document.addEventListener('keydown', closeByEscEvt);
  popup.closeByOuterClickEvt = closeByOuterClickEvt;
  popup.closeByEscEvt = closeByEscEvt;
}

function closePopup(popup, classOpen) {
  popup.classList.remove(classOpen);
  popup.removeEventListener('click', popup.closeByOuterClickEvt);
  document.removeEventListener('keydown', popup.closeByEscEvt);
}
