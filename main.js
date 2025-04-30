document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const productCards = document.querySelectorAll('.product-card');
  const productGrid = document.querySelector('.product-grid');
  const actionButtons = document.querySelectorAll('.add-to-cart'); // Added
  const confirmationPopup = document.createElement('div'); // Renamed to avoid conflict

  // Add green confirmation styling (used for filter/sort only)
  confirmationPopup.style.position = 'fixed';
  confirmationPopup.style.bottom = '20px';
  confirmationPopup.style.left = '20px';
  confirmationPopup.style.padding = '10px 20px';
  confirmationPopup.style.backgroundColor = 'green';
  confirmationPopup.style.color = 'white';
  confirmationPopup.style.borderRadius = '5px';
  confirmationPopup.style.display = 'none';
  document.body.appendChild(confirmationPopup);

  function showConfirmation(message) {
    confirmationPopup.textContent = message;
    confirmationPopup.style.display = 'block';
    setTimeout(() => {
      confirmationPopup.style.display = 'none';
    }, 2000);
  }

  function filterProducts() {
    const query = searchInput.value.toLowerCase();
    productCards.forEach(card => {
      const name = card.querySelector('h3').innerText.toLowerCase();
      const category = card.querySelector('.category').innerText.toLowerCase();

      if (name.includes(query) || category.includes(query)) {
        card.style.display = 'block';
        card.classList.add('small-card');
      } else {
        card.style.display = 'none';
      }
    });

    sortProducts(); // Maintain sort order even after filtering
    showConfirmation('Products filtered successfully!');
  }

  function sortProducts() {
    const sortBy = sortSelect.value;
    const visibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');
    let sortedCards = visibleCards;

    if (sortBy === 'name-asc') {
      sortedCards.sort((a, b) => a.querySelector('h3').innerText.localeCompare(b.querySelector('h3').innerText));
    } else if (sortBy === 'name-desc') {
      sortedCards.sort((a, b) => b.querySelector('h3').innerText.localeCompare(a.querySelector('h3').innerText));
    } else if (sortBy === 'price-asc') {
      sortedCards.sort((a, b) => parseFloat(a.querySelector('.price').innerText.replace('$', '')) - parseFloat(b.querySelector('.price').innerText.replace('$', '')));
    } else if (sortBy === 'price-desc') {
      sortedCards.sort((a, b) => parseFloat(b.querySelector('.price').innerText.replace('$', '')) - parseFloat(a.querySelector('.price').innerText.replace('$', '')));
    }

    productGrid.innerHTML = '';
    sortedCards.forEach(card => productGrid.appendChild(card));
    showConfirmation('Products sorted successfully!');
  }

  searchInput.addEventListener('input', filterProducts);
  sortSelect.addEventListener('change', sortProducts);

  // ✅ Add-to-cart logic
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const productName = this.getAttribute("data-name");
      const productPrice = this.getAttribute("data-price");
      const productImage = this.getAttribute("data-img");

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      };

      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));

      // Cart-specific confirmation message
      const cartMessage = document.getElementById("confirmation-message");
      cartMessage.style.display = "block";

      // Ripple effect
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      this.appendChild(circle);
      const d = Math.max(this.clientWidth, this.clientHeight);
      circle.style.width = circle.style.height = `${d}px`;
      circle.style.left = `${e.clientX - this.getBoundingClientRect().left - d / 2}px`;
      circle.style.top = `${e.clientY - this.getBoundingClientRect().top - d / 2}px`;
      setTimeout(() => circle.remove(), 600);

      setTimeout(() => {
        cartMessage.style.display = "none";
      }, 3000);
    });
  });

  // Close cart message
  const closeMessageButton = document.getElementById("closeMessage");
  if (closeMessageButton) {
    closeMessageButton.addEventListener("click", () => {
      const cartMessage = document.getElementById("confirmation-message");
      cartMessage.style.display = "none";
    });
  }
});
