export { handleFormSubmit, closePopup, zoomPicture }
import { popup, popupClose, popupContent, popupImage, popupCaption, placeName, placeLink, nameJob, job, jobInput, zoomImg, nameInput, name, addPlace, placesList, formElement} from "./index";
import { initialCards } from "./cards";
import { creatCard, deleteThisCard, cardLike } from "./card";

function handleFormSubmit(evt) {
  evt.preventDefault();
  job.textContent = jobInput.value;
  name.textContent = nameInput.value;
  popup[nameJob].classList.remove('popup_is-opened');
  if (evt.target === formElement[addPlace]) {
    initialCards.unshift({name: placeName.value, link: placeLink.value});
    placesList.insertBefore(creatCard(initialCards[0], { deleteCard : deleteThisCard, zoomCard : zoomPicture, like : cardLike }), placesList.firstChild);
    popup[addPlace].classList.remove('popup_is-opened');
    placeName.value = '';
    placeLink.value = '';
  }
}

function closePopup(popupType) {
  closeWithEsc(popupType);
  popupClose[popupType].addEventListener('click', (() => popup[popupType].classList.remove('popup_is-opened')));
  popupContent[popupType].addEventListener('click', (evt => evt.stopPropagation()));
  popup[popupType].addEventListener('click', (() => popup[popupType].classList.remove('popup_is-opened')));
}

function closeWithEsc(popupType) {
  document.addEventListener('keydown', (function keyDown(evt) {
  if (evt.key === 'Escape') {
    popup[popupType].classList.remove('popup_is-opened')
  }
  document.removeEventListener('keydown', keyDown);
}))}

function zoomPicture(card) {
  popup[zoomImg].classList.add('popup_is-opened');
  popupImage.src = card.src;
  popupImage.alt = card.alt;
  popupCaption.textContent = card.alt;
  closePopup(zoomImg);
}
