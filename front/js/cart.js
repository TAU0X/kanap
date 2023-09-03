document.title = "Votre panier";
let productLocalStorage = JSON.parse(localStorage.getItem("produit"));
let deleteBtn = document.querySelector(".deleteItem");
let totalQuantity = 0;
let totalPrice = 0;
let orderButton = document.getElementById("order");
//trouver les éléments par leur id
const findProduct = (id, arr) => arr.find((val) => val._id === id);
const findItem = (id, arr) => arr.find((val) => val.idColor === id);

//Si le localStorage est vide
if (!productLocalStorage || productLocalStorage.length == 0) {
  document.querySelector("#cartAndFormContainer h1").innerHTML += " est vide";
  document.querySelector("#totalPrice").innerHTML = totalPrice;
  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  orderButton.addEventListener("click", (e) => {
    e.preventDefault;
    alert("Vous ne pouvez pas continuer votre panier est vide ");
  });
} else {
  //Récupération des informations des produits du localStorage
  fetch(`http://localhost:3000/api/products`)
    .then((res) => res.json())
    .then((listProducts) => {
      //afficher les informations des produits du localStorage
      for (let i = 0; i < productLocalStorage.length; i++) {
        let getPrice = findProduct(
          productLocalStorage[i].id,
          listProducts
        ).price;
        let xprice = getPrice * productLocalStorage[i].quantity;
        document.getElementById(
          "cart__items"
        ).innerHTML += `<article class="cart__item" data-id="${productLocalStorage[i].idColor}" data-color="${productLocalStorage[i].color}">
    <div class="cart__item__img">
    <img src="${productLocalStorage[i].imageUrl}" alt="${productLocalStorage[i].imagrAltTxt}">
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
        <h2>${productLocalStorage[i].name}</h2>
        <p>${productLocalStorage[i].color}</p>
        <p>${getPrice}€</p>
    </div>
    <div class="cart__item__content__settings">
    <p>Qté : </p>
    <input type="number" class="itemQuantity "  name="itemQuantity" min="1" max="100" value="${productLocalStorage[i].quantity}">
    
        <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
        </div>
    </div>
    </div>
</article>`;

        document.querySelectorAll(".itemQuantity").forEach((item) => {
          //Gérer la modification de la quantitéde des produits dans le panier
          item.addEventListener("input", () => {
            let parentItem = item.parentElement.parentElement.parentElement;
            let myItem = findItem(parentItem.dataset.id, productLocalStorage);
            myItem.quantity = item.value;

            const productData = JSON.stringify(productLocalStorage);
            localStorage.setItem("produit", productData);
            productLocalStorage = JSON.parse(localStorage.getItem("produit"));

            window.location.reload();
          });
        });
        //Gérer la suppression des produits dans le panier
        document.querySelectorAll(".deleteItem").forEach((x) => {
          x.addEventListener("click", () => {
            let parentItem =
              x.parentElement.parentElement.parentElement.parentElement;
            let getItem = findItem(parentItem.dataset.id, productLocalStorage);

            let productToRemove = productLocalStorage.indexOf(getItem);
            productLocalStorage.splice(productToRemove, 1);
            const productData = JSON.stringify(productLocalStorage);
            localStorage.setItem("produit", productData);
            productLocalStorage = JSON.parse(localStorage.getItem("produit"));
            window.location.reload();
          });
        });
        //afficher la quantité et le prix total des produits
        totalQuantity += Number(productLocalStorage[i].quantity);
        totalPrice += Number(xprice);

        document.querySelector("#totalPrice").innerHTML = totalPrice;
        document.getElementById("totalQuantity").innerHTML = totalQuantity;
        //Gérer la commande
        orderButton.addEventListener("click", (e) => {
          e.preventDefault();

          // déclaration des element
          const firstNameErr = document.querySelector("#firstNameErrorMsg");
          const lastNameErr = document.querySelector("#lastNameErrorMsg");
          const adressErr = document.querySelector("#addressErrorMsg");
          const cityErr = document.querySelector("#cityErrorMsg");
          const emailErr = document.querySelector("#emailErrorMsg");
          const firstName = document.getElementById("firstName");
          const lastName = document.getElementById("lastName");
          const adress = document.getElementById("address");
          const city = document.getElementById("city");
          const email = document.getElementById("email");
          const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
          const regexLastName = regexFirstName;
          const regexAdress = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/;
          const regexCity = regexFirstName;
          const regexEmail =
            /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
          let checkFirstName = firstName.value;
          let checkLastName = lastName.value;
          let checkAdress = adress.value;
          let checkCity = city.value;
          let checkEmail = email.value;

          //Vérifiez les informations pour la commande et un message d'erreur si besoin
          function orderValidation() {
            if (
              regexFirstName.test(checkFirstName) == false ||
              checkFirstName === null
            ) {
              firstNameErr.innerHTML = "Merci de renseigner un prénom valide";
              return false;
            } else if (
              regexLastName.test(checkLastName) == false ||
              checkLastName === null
            ) {
              lastNameErr.innerHTML =
                "Merci de renseigner un nom de famille valide";
              return false;
            } else if (
              regexAdress.test(checkAdress) == false ||
              checkAdress === null
            ) {
              adressErr.innerHTML =
                "Merci de renseigner une adresse valide (Numéro, voie, nom de la voie, code postal)";
              return false;
            } else if (
              regexCity.test(checkCity) == false ||
              checkCity === null
            ) {
              cityErr.innerHTML = "Merci de renseigner un nom de ville valide";
              return false;
            } else if (
              regexEmail.test(checkEmail) == false ||
              checkEmail === null
            ) {
              emailErr.innerHTML =
                "Merci de renseigner une adresse email valide";
              return false;
            } else {
              //Si les informations sont correctes on passe la commande
              let idProducts = [];
              for (let i = 0; i < productLocalStorage.length; i++) {
                idProducts.push(productLocalStorage[i].id);
                console.log(idProducts);
              }
              const order = {
                contact: {
                  firstName: firstName,
                  lastName: lastName,
                  address: adress,
                  city: city,
                  email: email,
                },
                products: idProducts,
              };
              //l'envoi de la commande et rediriger vers la page confirmation
              fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                body: JSON.stringify(order),
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              })
                .then((res) => res.json())
                .then(
                  (data) =>
                    (window.location.href = `confirmation.html?orderId=${data.orderId}`)
                );

              console.log(order);
            }
          }
          orderValidation();
          localStorage.clear();
        });
      }
    });
}
