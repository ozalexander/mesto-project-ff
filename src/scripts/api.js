export { getCards, getProfile, patchProfile, addCard, deleteCardByID, likeById, deleteLikeById, changeProfileAvatar, getCardsAndProfile, handleResponse }

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-15',
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    'Content-Type': 'application/json'
  }
}

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
    }
  return Promise.reject(res.status)
}

const cardsUrl = '/cards/', usersUrl = '/users/me', likesUrl = cardsUrl+'/likes/', avatarUrl = usersUrl+'/avatar';

const getCards = () => fetch(config.baseUrl+cardsUrl, { headers: config.headers })

const getProfile = () => fetch(config.baseUrl+usersUrl, { headers: config.headers })

const patchProfile = (defaultName, defaultJob) => fetch(config.baseUrl+usersUrl, {
  method:'PATCH',
  headers: config.headers,
  body: JSON.stringify({
    name : defaultName.value,
    about : defaultJob.value,
  })
  })
  .then((res) => handleResponse(res))

const addCard = (placeInputName, placeInputLink) => fetch(config.baseUrl+cardsUrl, {
  method:'POST',
  headers: config.headers,
  body: JSON.stringify({
    name : placeInputName.value,
    link : placeInputLink.value,
  })
})
  .then((res) => handleResponse(res))

function deleteCardByID(cardId) {
  return fetch(`${config.baseUrl}${cardsUrl}${cardId}`, {
    method:'DELETE',
    headers: config.headers,
  })
  .then((res) => handleResponse(res))
}

function likeById(cardId) {
  return fetch(`${config.baseUrl}${likesUrl}${cardId}`, {
    method:'PUT',
    headers: config.headers,
  })
  .then((res) => handleResponse(res))
}

function deleteLikeById(cardId) {
  return fetch(`${config.baseUrl}${likesUrl}${cardId}`, {
    method:'DELETE',
    headers: config.headers,
  })
  .then((res) => handleResponse(res))
}

const changeProfileAvatar = (input) => fetch(config.baseUrl+avatarUrl, {
  method:'PATCH',
  headers: config.headers,
  body: JSON.stringify({
    avatar : input
  })
})
  .then((res) => {
    if (res.ok) {
      return res;
      }
    return Promise.reject(res.status)
  })

const getCardsAndProfile = () => {
  return Promise.all([getCards(), getProfile()])
  .then(([getCardsRes, getProfileRes]) => {
    return Promise.all([handleResponse(getCardsRes), handleResponse(getProfileRes)])
  })
}