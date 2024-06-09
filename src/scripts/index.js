import '../pages/index.css';
import { createCard, deleteThisCard, cardLike, tempId } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { patchProfile, addCard, deleteCardByID, likeById, deleteLikeById, changeProfileAvatar, getCardsAndProfile } from './api.js'

const popupList = document.querySelectorAll('.popup');
const popupContentList = document.querySelectorAll('.popup__content');
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
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const zoomImgPopup = document.querySelector('.popup_type_image');
const changeAvatarPopup = document.querySelector('.popup_type_avatar');
const deleteConfirmationPopup = document.querySelector('.popup_type_delete');
const errorPopup = document.querySelector('.popup_type_error');
const errorPopupSubmit = document.querySelector(formElement);
const editProfileForm = editProfilePopup.querySelector(formElement);
const addCardForm = addCardPopup.querySelector(formElement);
const changeAvatarForm = changeAvatarPopup.querySelector(formElement);
const listOfFunctions = { zoomPicture, cardLike, likeById, deleteLikeById };
const validationConfig = { 
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  errorClass: '.popup__error_visible'
}

popupList.forEach(i => i.classList.add('popup_is-animated'))

avatar.addEventListener('click', () => {
  openPopup(changeAvatarPopup);
  avatarInput.value = '';
  avatarInput.focus();
  clearValidation(changeAvatarForm, validationConfig)
})

buttonEditProfile.addEventListener('click', (() => {
  openPopup(editProfilePopup);
  nameInput.value = defaultName.textContent;
  jobInput.value = defaultJob.textContent;
  nameInput.focus();
  clearValidation(editProfileForm, validationConfig)
}));

newCardBtn.addEventListener('click', (() => {
  openPopup(addCardPopup); 
  placeInputName.focus(); 
  clearValidation(addCardForm, validationConfig)
}));

const buttonLoaderOpen = (typeOfForm) => {
  typeOfForm.querySelector('.popup__button').textContent = '';
  typeOfForm.querySelector('.popup__button').classList.add('popup__button-loading');
}

const buttonLoaderClose = (typeOfForm) => {
  typeOfForm.querySelector('.popup__button').textContent = 'Сохранить';
  typeOfForm.querySelector('.popup__button').classList.remove('popup__button-loading')
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editProfileForm.querySelector('.popup__button').textContent = 'Сохранение...';
  patchProfile(nameInput, jobInput)
    .then(() => {
      defaultName.textContent = nameInput.value;
      defaultJob.textContent = jobInput.value;
      closePopup(editProfilePopup)
      editProfileForm.querySelector('.popup__button').textContent = 'Сохранить';
    })
    .catch((err)=> handleError(err))
}

editProfileForm.addEventListener('submit', (evt) => handleEditFormSubmit(evt));

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  buttonLoaderOpen(addCardForm)
  addCard(placeInputName, placeInputLink)
    .then((res) => {
      placesList.insertBefore(createCard(res, listOfFunctions, 0, res.owner._id), placesList.firstChild)
      placesList.querySelector('.card__delete-button').addEventListener('click', () => openPopup(deleteConfirmationPopup));
      closePopup(addCardPopup);
      placeInputName.value = '';
      placeInputLink.value = '';
      buttonLoaderClose(addCardForm);
    })
    .catch((err) => handleError(err))
}

addCardForm.addEventListener('submit', evt => handleAddFormSubmit(evt));

deleteCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    deleteCardByID(tempId)
      .then(() => {
          deleteThisCard(document.getElementById(tempId));
          closePopup(deleteConfirmationPopup);
        })
      .catch((err) => handleError(err))  
})

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  buttonLoaderOpen(changeAvatarForm);
  changeProfileAvatar(avatarInput.value)
    .then(() => {
      closePopup(changeAvatarPopup);
      buttonLoaderClose(changeAvatarForm);
      avatar.style.backgroundImage = `url(${avatarInput.value})`
    })
    .catch((err)=> handleError(err))
}

changeAvatarForm.addEventListener('submit', evt => handleEditAvatarSubmit(evt));

errorPopupSubmit.addEventListener('submit', evt => {
  evt.preventDefault();
  closePopup(errorPopup);
})

function zoomPicture(card) {
  openPopup(zoomImgPopup);
  popupImage.src = card.src;
  popupImage.alt = card.alt;
  popupCaption.textContent = card.alt;
}

popupContentList.forEach(i => i.addEventListener('click', evt => evt.stopPropagation()));
popupList.forEach(i => i.querySelector('.popup__close').addEventListener('click', () => closePopup(i)))

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
  errorPopup.querySelector('.popup__title').textContent = `Ошибка: ${err}`;
  openPopup(errorPopup);
}

getCardsAndProfile()
  .then(([cardsRes, profileRes]) => {
    cardsRes.forEach(card => placesList.append(createCard(card, listOfFunctions, card.likes.length, profileRes._id)));
    defaultName.textContent = profileRes.name;
    defaultJob.textContent = profileRes.about;
    avatar.style.backgroundImage = `url(${profileRes.avatar})`})
  .then(() => document.querySelectorAll('.card__delete-button').forEach(del => del.addEventListener('click', () => openPopup(deleteConfirmationPopup))))
  .catch(err => handleError(err))
