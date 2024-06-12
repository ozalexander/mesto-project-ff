export { getCards, getProfile, patchProfile, addCard, deleteCardByID, changeProfileAvatar, toggleLike }

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-15',
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    'Content-Type': 'application/json'
  }
}

function handleResponse(res) {
  if (res.ok) {
    return res.json(); 
  } 
  return res.json() 
  .then((error) => { 
    error.httpResponseCode = res.status; 
    return Promise.reject(error);
  })
}

const cardsUrl = '/cards/', usersUrl = '/users/me', likesUrl = cardsUrl+'/likes/', avatarUrl = usersUrl+'/avatar';

const getCards = () => fetch(config.baseUrl+cardsUrl, { headers: config.headers })
  .then(handleResponse)

const getProfile = () => fetch(config.baseUrl+usersUrl, { headers: config.headers })
  .then(handleResponse)

const patchProfile = (defaultName, defaultJob) => fetch(config.baseUrl+usersUrl, {
  method:'PATCH',
  headers: config.headers,
  body: JSON.stringify({
    name : defaultName.value,
    about : defaultJob.value,
  })
  })
  .then(handleResponse)

const addCard = (placeInputName, placeInputLink) => fetch(config.baseUrl+cardsUrl, {
  method:'POST',
  headers: config.headers,
  body: JSON.stringify({
    name : placeInputName.value,
    link : placeInputLink.value,
  })
})
  .then(handleResponse)

function deleteCardByID(cardId) {
  return fetch(config.baseUrl+cardsUrl+cardId, {
    method:'DELETE',
    headers: config.headers,
  })
  .then(handleResponse)
}

function toggleLike(cardId, status) {
  return fetch(config.baseUrl+likesUrl+cardId, {
    method: !status ? 'PUT' : 'DELETE',
    headers: config.headers,
  })
  .then(handleResponse)
}

const changeProfileAvatar = (input) => fetch(config.baseUrl+avatarUrl, {
  method:'PATCH',
  headers: config.headers,
  body: JSON.stringify({
    avatar : input
  })
})
  .then(handleResponse)