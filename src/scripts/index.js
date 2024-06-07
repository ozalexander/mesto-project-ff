import '../pages/index.css';
import { createCard, deleteThisCard, cardLike } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getCards, getProfile, patchProfile, addCard, deleteCardByID, likeById, deleteLikeById, changeProfileAvatar } from './api.js'

const popup = document.querySelectorAll('.popup');
const buttonClose = document.querySelectorAll('.popup__close');
const popupContent = document.querySelectorAll('.popup__content');
const formElement = document.querySelectorAll('.popup__form');
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
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const newCardBtn = document.querySelector('.profile__add-button');
const errorPopupEl = document.querySelector('.popup_type_error');
const popupOpened = 'popup_is-opened';
const formEditProfile = 0, formAddCard = 1, imgZoom = 2, avatarEdit = 3, deleteCardConfirm = 4, errorPopup = 5;
const listOfFunctions = { deleteThisCard, zoomPicture, cardLike, deleteCardByID, likeById, deleteLikeById, openPopup };
const openPopupShort = (typeOfForm) => openPopup(popup[typeOfForm], popupOpened);
const closePopupShort = (typeOfForm) => closePopup(popup[typeOfForm], popupOpened);

for (let i = 0; i < popup.length; i++) { popup[i].classList.add('popup_is-animated') }

avatar.addEventListener('click', () => {
  openPopupShort(avatarEdit);
  avatarInput.focus();
  clearValidation(formElement[avatarEdit-1], { 
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    errorClass: '.popup__error_visible'
  })
})

buttonEditProfile.addEventListener('click', (() => {
  openPopupShort(formEditProfile);
  nameInput.focus();
  clearValidation(formElement[formEditProfile], { 
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    errorClass: '.popup__error_visible'
  })
}));

newCardBtn.addEventListener('click', (() => {
  openPopupShort(formAddCard); 
  placeInputName.focus(); 
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
    .then((res) => {
      if (res.ok) {
        setTimeout(() => { 
          defaultName.textContent = nameInput.value;
          defaultJob.textContent = jobInput.value;
        }, 500)
      } else {
        handleError(res)
      }
    })
    .catch((err)=> console.log(err))
    .finally(()=> {
      setTimeout(() => {closePopupShort(formEditProfile)}, 500);
      setTimeout(() => {
        buttonLoaderClose(formEditProfile)
      }, 1200)
    })
}

formElement[formEditProfile].addEventListener('submit', (evt) => handleEditFormSubmit(evt));

function reset() {
  placeInputName.value = '';
  placeInputLink.value = '';
  clearValidation(formElement[formAddCard], { 
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    errorClass: '.popup__error_visible'
  })
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  if (placeInputName.value==='' && placeInputLink.value===''){
    closePopupShort(formAddCard);
  } else {
    buttonLoaderOpen(formAddCard)
    addCard(placeInputName, placeInputLink)
      .then((res) => {
        if (res.ok) {
          getCards()
          .then((res) => handleResponse(res))
          .then((res) => setTimeout(() => {placesList.insertBefore(createCard(res[0], listOfFunctions, 0), placesList.firstChild)}, 1000))
          .catch((err) => console.log(err))
        } else {
          handleError(res)
        }
      })
      .catch((err)=> console.log(err))
      .finally(()=> {
        setTimeout(() => {closePopupShort(formAddCard)}, 1000)
          setTimeout(() => {
            reset(); 
            buttonLoaderClose(formAddCard)
        }, 1800)
      })
  }
}

formElement[formAddCard].addEventListener('submit', (evt) => handleAddFormSubmit(evt));

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  buttonLoaderOpen(avatarEdit-1);
  changeProfileAvatar(avatarInput)
    .then((res) => {
     if (res.ok) {
        setTimeout(() => {avatar.style.backgroundImage = `url(${avatarInput.value})`}, 1000)
      } else {
        handleError(res)
      }
    })
    .catch((err)=> console.log(err))
    .finally(()=> {
      setTimeout(() => {
        closePopupShort(avatarEdit)
      }, 1000)
      setTimeout(() => {
        buttonLoaderClose(avatarEdit-1);
      }, 1700)
    })
  }

formElement[avatarEdit-1].addEventListener('submit', (evt) => handleEditAvatarSubmit(evt));

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  closePopupShort(deleteCardConfirm);
}

formElement[deleteCardConfirm-1].addEventListener('submit', (evt) => handleDeleteCardSubmit(evt));

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

const handleError = (res) => {
  popup[errorPopup].querySelector('.popup__title').textContent = `Ошибка: ${res.status}`;
  openPopupShort(errorPopup);
  return Promise.reject(`Ошибка: ${res.status}`)
}

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
    }
  handleError(res)
}

Promise.all([getCards(), getProfile()])
  .then(([getCardsRes, getProfileRes]) => {
    return Promise.all([handleResponse(getCardsRes), handleResponse(getProfileRes)])
  })
  .then(([cardsRes, profileRes]) => {
    cardsRes.forEach(card => placesList.append(createCard(card, listOfFunctions, card.likes.length)));
    defaultName.textContent = profileRes.name;
    defaultJob.textContent = profileRes.about;
    nameInput.value = defaultName.textContent;
    jobInput.value = defaultJob.textContent;
    avatar.style.backgroundImage = `url(${profileRes.avatar})`})
  .catch((err) => console.log(err))
