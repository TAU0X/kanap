//Récupérer et afficher le order id
const orderId = new URLSearchParams(window.location.search).get("orderId");
document.getElementById("orderId").innerHTML += orderId;
