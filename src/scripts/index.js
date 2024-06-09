import '../pages/index.css';
import { createCard, deleteThisCard, cardLike, tempId } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { patchProfile, addCard, deleteCardByID, likeById, deleteLikeById, changeProfileAvatar, getCardsAndProfile, handleResponse } from './api.js'

const popup = document.querySelectorAll('.popup');
const buttonClose = document.querySelectorAll('.popup__close');
const popupContent = document.querySelectorAll('.popup__content');
const formElement = '.popup__form';
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const placeInputName = document.querySelector('.popup__input_type_card-name');
const placeInputLink = document.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');
const buttonEditProfile = document.querySelector('.profile__edit-button');
const defaultName = document.querySelector('.profile__title');
const defaultJob = document.querySelector('.profile__description');
const avatar = document.querySelector('.profile__image');
const avatarInput = document.querySelector('.popup__input_avatar');
const deleteCardForm = document.getElementsByName('confirm-delete')[0];
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const newCardBtn = document.querySelector('.profile__add-button');
const errorPopupEl = document.querySelector('.popup_type_error');
const popupOpened = 'popup_is-opened';
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const zoomImgPopup = document.querySelector('.popup__content_image');
const changeAvatarPopup = document.querySelector('.popup_type_avatar');
const deleteConfirmationPopup = document.querySelector('.popup_type_delete');
const editProfileForm = editProfilePopup.querySelector(formElement);
const addCardForm = addCardPopup.querySelector(formElement);
const zoomImgForm = zoomImgPopup.querySelector(formElement);
const changeAvatarForm = changeAvatarPopup.querySelector(formElement);
const deleteConfirmationForm = deleteConfirmationPopup.querySelector(formElement);
const formEditProfile = 0, formAddCard = 1, imgZoom = 2, avatarEdit = 3, deletePopup = 4, errorPopup = 5;
const listOfFunctions = { zoomPicture, cardLike, likeById, deleteLikeById, openPopup };
const validationConfig = { 
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  errorClass: '.popup__error_visible'
}
const openPopupShort = (typeOfForm) => openPopup(popup[typeOfForm], popupOpened);
const closePopupShort = (typeOfForm) => closePopup(popup[typeOfForm], popupOpened);

popup.forEach(i => i.classList.add('popup_is-animated'))

avatar.addEventListener('click', () => {
  openPopupShort(avatarEdit);
  avatarInput.value = '';
  avatarInput.focus();
  clearValidation(formElement[avatarEdit-1], validationConfig)
})

buttonEditProfile.addEventListener('click', (() => {
  openPopupShort(formEditProfile);
  nameInput.value = defaultName.textContent;
  jobInput.value = defaultJob.textContent;
  nameInput.focus();
  clearValidation(formElement[formEditProfile], validationConfig)
}));

newCardBtn.addEventListener('click', (() => {
  openPopupShort(formAddCard); 
  placeInputName.focus(); 
  clearValidation(formElement[formAddCard], validationConfig)
}));

const buttonLoaderOpen = (typeOfForm) => {
  formElement[typeOfForm].querySelector('.popup__button').textContent = '';
  formElement[typeOfForm].querySelector('.popup__button').classList.add('popup__button-loading');
}

const buttonLoaderClose = (typeOfForm) => {
  formElement[typeOfForm].querySelector('.popup__button').textContent = 'Сохранить';
  formElement[typeOfForm].querySelector('.popup__button').classList.remove('popup__button-loading')
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  buttonLoaderOpen(formEditProfile)
  patchProfile(nameInput, jobInput)
    .then(() => {
      defaultName.textContent = nameInput.value;
      defaultJob.textContent = jobInput.value;
      closePopupShort(formEditProfile)
      buttonLoaderClose(formEditProfile)
    })
    .catch((err)=> handleError(err))
    .finally(() => buttonLoaderClose(formEditProfile))
}

formElement[formEditProfile].addEventListener('submit', (evt) => handleEditFormSubmit(evt));

function reset() {
  placeInputName.value = '';
  placeInputLink.value = '';
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  buttonLoaderOpen(formAddCard)
  addCard(placeInputName, placeInputLink)
    .then((res) => {
      placesList.insertBefore(createCard(res, listOfFunctions, 0, res.owner._id), placesList.firstChild)
      placesList.querySelector('.card__delete-button').addEventListener('click', () => openPopupShort(deletePopup));
      closePopupShort(formAddCard);
      reset();
      buttonLoaderClose(formAddCard);
    })
    .catch((err) => handleError(err))
}

formElement[formAddCard].addEventListener('submit', (evt) => handleAddFormSubmit(evt));

deleteCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    deleteCardByID(tempId)
      .then(() => {
          deleteThisCard(document.getElementById(tempId));
          closePopupShort(deletePopup);
        })
      .catch((err) => handleError(err))  
})

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  buttonLoaderOpen(avatarEdit-1);
  changeProfileAvatar(avatarInput)
    .then(() => {
      closePopupShort(avatarEdit);
      buttonLoaderClose(avatarEdit-1);
      avatar.style.backgroundImage = `url(${avatarInput.value})`
    })
    .catch((err)=> handleError(err))
  }

formElement[avatarEdit-1].addEventListener('submit', (evt) => handleEditAvatarSubmit(evt));

errorPopupEl.addEventListener('submit', (evt) => {
  evt.preventDefault();
  closePopupShort(errorPopup);
})

function zoomPicture(card) {
  openPopupShort(imgZoom);
  popupImage.src = card.src;
  popupImage.alt = card.alt;
  popupCaption.textContent = card.alt;
}

function closePopupButtonNoBubbling(popupType) {
  popupContent[popupType].addEventListener('click', (evt) => evt.stopPropagation());
  buttonClose[popupType].addEventListener('click', () => closePopupShort(popupType));
}

for (let i = 0; i < popup.length; i++) { closePopupButtonNoBubbling(i) };

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

const handleError = (err) => {
  console.log(err)
  popup[errorPopup].querySelector('.popup__title').textContent = `Ошибка: ${err}`;
  openPopupShort(errorPopup);
}

getCardsAndProfile()
  .then(([cardsRes, profileRes]) => {
    cardsRes.forEach(card => placesList.append(createCard(card, listOfFunctions, card.likes.length, profileRes._id)));
    defaultName.textContent = profileRes.name;
    defaultJob.textContent = profileRes.about;
    avatar.style.backgroundImage = `url(${profileRes.avatar})`})
  .then(() => document.querySelectorAll('.card__delete-button').forEach(del => del.addEventListener('click', () => openPopupShort(deletePopup))))
  .catch((err) => handleError(err))
