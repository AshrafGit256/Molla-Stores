// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const productCards = document.querySelectorAll('.product-card');
  const productGrid = document.querySelector('.product-grid');
  const confirmationMessage = document.createElement('div');
  
  // Add confirmation message styling
  confirmationMessage.style.position = 'fixed';
  confirmationMessage.style.bottom = '20px';
  confirmationMessage.style.left = '20px';
  confirmationMessage.style.padding = '10px 20px';
  confirmationMessage.style.backgroundColor = 'green';
  confirmationMessage.style.color = 'white';
  confirmationMessage.style.borderRadius = '5px';
  confirmationMessage.style.display = 'none';  // Hidden by default
  
  document.body.appendChild(confirmationMessage);

  // Function to show the confirmation message
  function showConfirmation(message) {
    confirmationMessage.textContent = message;
    confirmationMessage.style.display = 'block';
    
    // Hide the message after 2 seconds
    setTimeout(() => {
      confirmationMessage.style.display = 'none';
    }, 2000);
  }

  // Function to filter products based on search
  function filterProducts() {
    const query = searchInput.value.toLowerCase();
  
    productCards.forEach(card => {
      const name = card.querySelector('h3').innerText.toLowerCase();
      const category = card.querySelector('.category').innerText.toLowerCase();
  
      // Check if the product name or category includes the query
      if (name.includes(query) || category.includes(query)) {
        card.style.display = 'block';  // Show the card
        card.classList.add('small-card'); // Ensure it shows as a small card
      } else {
        card.style.display = 'none';  // Hide the card if it doesn't match
      }
    });

    // Re-apply sorting after filtering
    sortProducts();
    showConfirmation('Products filtered successfully!');
  }
  
  // Function to sort products
  function sortProducts() {
    const sortBy = sortSelect.value;
    const cards = Array.from(productCards).filter(card => card.style.display !== 'none'); // Only sorted cards that are visible

    let sortedCards;

    if (sortBy === 'name-asc') {
      sortedCards = cards.sort((a, b) => {
        const nameA = a.querySelector('h3').innerText.toLowerCase();
        const nameB = b.querySelector('h3').innerText.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === 'name-desc') {
      sortedCards = cards.sort((a, b) => {
        const nameA = a.querySelector('h3').innerText.toLowerCase();
        const nameB = b.querySelector('h3').innerText.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    } else if (sortBy === 'price-asc') {
      sortedCards = cards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').innerText.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.price').innerText.replace('$', ''));
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      sortedCards = cards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').innerText.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.price').innerText.replace('$', ''));
        return priceB - priceA;
      });
    } else {
      sortedCards = cards;
    }

    // Clear and re-append sorted cards
    productGrid.innerHTML = '';
    sortedCards.forEach(card => {
      productGrid.appendChild(card);
    });

    // Show confirmation message after sorting
    showConfirmation('Products sorted successfully!');
  }
  
  // Events
  searchInput.addEventListener('input', filterProducts);
  sortSelect.addEventListener('change', sortProducts);
});


// Show confirmation message after adding an item to the cart
buttons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const productName = this.getAttribute("data-name");
    const productPrice = this.getAttribute("data-price");
    const productImage = this.getAttribute("data-img");

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Create product object
    const product = {
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1, // default quantity of 1
    };

    // Add the product to the cart
    cart.push(product);

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Display confirmation message
    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.style.display = "block"; // Show the message

    // Feedback effect on button click (ripple effect)
    const circle = document.createElement("span");
    circle.classList.add("ripple");
    this.appendChild(circle);
    const d = Math.max(this.clientWidth, this.clientHeight);
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${
      e.clientX - this.getBoundingClientRect().left - d / 2
    }px`;
    circle.style.top = `${
      e.clientY - this.getBoundingClientRect().top - d / 2
    }px`;
    setTimeout(() => circle.remove(), 600);

    // Auto-hide confirmation message after 3 seconds
    setTimeout(() => {
      confirmationMessage.style.display = "none";
    }, 3000);
  });
});

// Close confirmation message when clicking "Close" button
const closeMessageButton = document.getElementById("closeMessage");
if (closeMessageButton) {
  closeMessageButton.addEventListener("click", () => {
    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.style.display = "none"; // Hide the message
  });
}

