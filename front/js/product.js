//Récupération de l'id via paramètres de l'url
const productId = new URLSearchParams(window.location.search).get("id");

//Récupérer et afficher informations de nos produits
if (productId !== null) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((selectProduct) => {
      document.title = selectProduct.name;
      let productName = document.querySelector("#title");
      productName.innerHTML += selectProduct.name;
      document.querySelector(
        ".item__img"
      ).innerHTML += `<img src="${selectProduct.imageUrl}" alt="${selectProduct.altTxt}">`;
      document.getElementById("price").innerHTML += selectProduct.price;
      document.getElementById("description").innerHTML +=
        selectProduct.description;
      //
      for (let i = 0; i < selectProduct.colors.length; i++) {
        let color = document.createElement("option");
        color.setAttribute("value", selectProduct.colors[i]);
        color.innerHTML = selectProduct.colors[i];
        document.getElementById("colors").appendChild(color);
      }

      // Ajouté un article au panier
      let addToCartBtn = document.getElementById("addToCart");
      addToCartBtn.addEventListener("click", addToCart);
      function addToCart() {
        let produitDansLocalStorage = JSON.parse(
          localStorage.getItem("produit")
        );
        const colorChoice = document.querySelector("#colors").value;
        const quantityChoice = document.querySelector("#quantity").value;
        const image = document.querySelector(".item__img img");
        //Vérifier que les informations soient correctes
        if (colorChoice !== "" && quantityChoice > 0 && quantityChoice <= 100) {
          const productData = {
            id: productId,
            idColor: `${productId}-${colorChoice}`,
            color: colorChoice,
            name: productName.innerText,
            quantity: Number(quantityChoice),
            imageUrl: image.src,
            imageAltTxt: image.alt,
          };

          //ajouter les produits au localStorage
          const addProductLocalStorage = () => {
            let findProduct = produitDansLocalStorage.find((product) => {
              return (
                product.id === productData.id &&
                product.color === productData.color
              );
            });
            if (findProduct) {
              // si le produit existe déjà dans le localStorage
              const total = findProduct.quantity + productData.quantity;
              if (total <= 100) {
                findProduct.quantity =
                  Number(findProduct.quantity) + Number(productData.quantity);
                alert(
                  `La quantité du produit ${selectProduct.name} de couleur ${colorChoice} a bien été mise à jour.`
                );
              } else {
                alert("La quantité d'un article ne peut pas dépasser 100.");
              }
            } else {
              produitDansLocalStorage.push(productData);
            }
            localStorage.setItem(
              "produit",
              JSON.stringify(produitDansLocalStorage)
            );
          };

          if (produitDansLocalStorage) {
            addProductLocalStorage();
          } else {
            //Si le localStorage est vide
            produitDansLocalStorage = [];
            addProductLocalStorage();
            alert("Vous venez d'ajouter votre produit dans le panier!");
          }
        } else {
          alert("Veuillez vérifier les information sélectionnée");
        }
      }
    });
}
