const cardsTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

initialCards.forEach((card) => {
  const cardsElement = cardsTemplate.cloneNode(true);
  const deleteButton = cardsElement.querySelector('.card__delete-button');

  cardsElement.querySelector('.card__title').textContent = card.name;
  cardsElement.querySelector('.card__image').alt = 'Фотография';
  cardsElement.querySelector('.card__image').src = card.link;

  deleteButton.addEventListener('click', evt => evt.target.parentElement.style.display='none');

  placesList.append(cardsElement);
})
