export { createCard, deleteThisCard, changeLike }

function createCard(item, { zoomPicture, deleteCard, handleLikes }, myId) {
  const cardsTemplate = document.querySelector('#card-template').content;
  const cardsElement = cardsTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const likeButton = cardsElement.querySelector('.card__like-button');
  const likeCount = cardsElement.querySelector('.card__like-button-counter');
  const activeLike = 'card__like-button_is-active';
  const likeElements = { like:likeButton, count:likeCount };
  const likeStatus = () => likeButton.classList.contains(activeLike);
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  likeCount.textContent = item.likes.length;
  if (item.likes.some(like => like._id === myId)) {likeButton.classList.add(activeLike)}
  item.owner._id === myId ? deleteButton.addEventListener('click', () => deleteCard(item._id, cardsElement)) : deleteButton.remove();
  likeButton.addEventListener('click', () => handleLikes(item._id, likeElements, likeStatus()));
  cardImage.addEventListener('click', () => zoomPicture(cardImage));
  return cardsElement;
}

const deleteThisCard = (card) => card.remove()

const changeLike = (obj, fetchedLikes) => {
  obj.count.textContent = fetchedLikes;
  obj.count.classList.toggle('card__like-button-counter-change')
  obj.like.classList.toggle('card__like-button_is-active');
}
