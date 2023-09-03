//Récupération des données du back end
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((listProducts) => {
    //affichage des données sur notre page
    for (let i of listProducts) {
      document.querySelector(
        ".items"
      ).innerHTML += `<a href="./product.html?id=${i._id}">
        <article>
        <img src="${i.imageUrl}" alt="${i.altTxt}">
        <h3 class="productName">${i.name}</h3>
            <p class="productDescription">${i.description}</p>
        </article>
        </a> `;
    }
  });
