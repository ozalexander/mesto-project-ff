export { creatCard, deleteThisCard, cardLike }

function creatCard(item, { deleteCard, zoomCard, like }) {
  const cardsTemplate = document.querySelector('#card-template').content;
  const cardsElement = cardsTemplate.querySelector('.card').cloneNode(true);
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  const likeButton = cardsElement.querySelector('.card__like-button');
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  deleteButton.addEventListener('click', () => deleteCard(cardsElement));
  cardImage.addEventListener('click', () => zoomCard(cardImage));
  likeButton.addEventListener('click', () => like(likeButton));
  return cardsElement;
}

const deleteThisCard = (card) => card.remove();

const cardLike = (card) => card.classList.toggle('card__like-button_is-active');
