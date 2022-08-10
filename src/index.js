let addToy = false;

// Show and hide add new toy form
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Add a toy!
document.querySelector('.add-toy-form').addEventListener('submit', handleSubmit)

//event handler
function handleSubmit(e){
  e.preventDefault()
  // Construct a new toy object based on the form values
  let toyObj = {
    name:e.target.name.value,
    image:e.target.image.value,
    likes:0
  }
  buildToy(toyObj)
}

function renderOneToy(toy){
  let card = document.createElement('li')
  card.className = 'card'
  card.innerHTML = `
  <div class="card">
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes}</p>
    <button class="like-btn" id="toy-${toy.id}">Like ❤️</button>
  </div>`
  //Add toy card to DOM
  document.querySelector('#toy-collection').appendChild(card)
  // Get a handle on the like button + Add click event listener
  document.querySelector(`#toy-${toy.id}`).addEventListener('click', () => {
    let toyObj = {
    name: toy.name,
    image: toy.image,
    likes: toy.likes + 1
  }
    // Make a patch API to increase likes
    fetch(`http://localhost:3000/toys/${toy.id}`,{
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body:JSON.stringify(toyObj)
    })
    .then(res => res.json())
    .then(toyData => { 
      // TODO update likes without refreshing the page or re-arranging the cards
      card.innerHTML = ""
      card.innerHTML = `
        <div class="card">
          <h2>${toyObj.name}</h2>
          <img src="${toyObj.image}" class="toy-avatar" />
          <p>${toyObj.likes}</p>
          <button class="like-btn" id="toy-${toyObj.id}">Like ❤️</button>
        </div>`
      //Add toy card to DOM
      document.querySelector('#toy-collection').appendChild(card)
  
    })
  })
}

// Submit toyObj to the backend or db.json
function buildToy(toyObj){
  fetch('http://localhost:3000/toys',{
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
  },
    body:JSON.stringify(toyObj)
  })
  .then(res => res.json())
  .then(toyData => { 
    renderOneToy(toyData)
  })
}

//   Get fetch for all toys
function getAllToys(){
    fetch('http://localhost:3000/toys',{
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
  .then(res => res.json())
  .then(toyData => { 
    // TODO Remove later
    console.log(`We got toys back from the server ${JSON.stringify(toyData,null,2)}`);

    toyData.forEach(toy => renderOneToy(toy)) 
    })
}

// Run this first      
function initialize(){
  getAllToys()
}

initialize()