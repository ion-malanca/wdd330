import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  renderListWithTemplate,
} from "./utils.mjs";

loadHeaderFooter();

function cartItemTemplate(item) {
  const colorName =
    item.Colors && item.Colors.length > 0
      ? item.Colors[0].ColorName
      : "";

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
    <div class="cart-card__quantity">
      <label for="qty-${item.Id}">Qty:</label>
      <input 
        type="number"
        id="qty-${item.Id}"
        class="quantity-input"
        data-id="${item.Id}"
        value="${item.Quantity || 1}"
        min="1"
      />
  </div>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.FinalPrice) || 0;
    const quantity = parseInt(item.Quantity) || 1;
    return total + price * quantity;
  }, 0);
}

function showCartFooter(cartItems) {
  const footer = document.getElementById("cartFooter");
  const totalElement = document.getElementById("cartTotal");

  if (cartItems.length > 0) {
    totalElement.textContent = calculateTotal(cartItems).toFixed(2);
    footer.classList.remove("hide");
  } else {
    footer.classList.add("hide");
  }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    cartList.innerHTML = `<li class="empty-cart">Your cart is empty</li>`;
  } else {
    renderListWithTemplate(cartItemTemplate, cartList, cartItems);
  }

  showCartFooter(cartItems);
}

function updateQuantity(event) {
  const id = event.target.dataset.id;
  const quantity = parseInt(event.target.value);

  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.map((item) => {
    if (item.Id === id) {
      item.Quantity = quantity;
    }
    return item;
  });

  setLocalStorage("so-cart", cartItems);

  showCartFooter(cartItems);
}

renderCartContents();

document.querySelector(".product-list").addEventListener(
  "change",
  (event) => {
    if (event.target.classList.contains("quantity-input")) {
      updateQuantity(event);
    }
  }
);