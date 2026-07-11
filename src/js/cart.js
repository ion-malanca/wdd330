import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const colorName = item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : "";
  
  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${colorName}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.FinalPrice) || 0;
    const quantity = parseInt(item.Quantity) || 1;
    return total + (price * quantity);
  }, 0);
}

function showCartFooter(cartItems) {
  const footer = document.getElementById("cartFooter");
  const totalElement = document.getElementById("cartTotal");
  
  if (cartItems && cartItems.length > 0) {
    const total = calculateTotal(cartItems);
    totalElement.textContent = total.toFixed(2);
    footer.classList.remove("hide");
  } else {
    footer.classList.add("hide");
  }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list");
  
  if (cartItems.length === 0) {
    cartList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
    showCartFooter(cartItems);
    return;
  }
  
  renderListWithTemplate(cartItemTemplate, cartList, cartItems);
  showCartFooter(cartItems);
}

renderCartContents();