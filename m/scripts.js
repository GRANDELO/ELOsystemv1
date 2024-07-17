document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: 1, name: 'Smartphone', description: 'Latest smartphone with 5G', price: '$499', image: 'smartphone.jpg' },
        { id: 2, name: 'Laptop', description: 'High performance laptop', price: '$999', image: 'laptop.jpg' },
        { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones', price: '$199', image: 'headphones.jpg' },
    ];

    const productContainer = document.getElementById('product-list');

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4', 'product-card');

        productCard.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>${product.price}</strong></p>
                    <button class="btn btn-primary" onclick="showProductDetails(${product.id})">View Details</button>
                    <a href="#" class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</a>
                </div>
            </div>
        `;

        productContainer.appendChild(productCard);
    });

    window.showProductDetails = function(productId) {
        const product = products.find(p => p.id === productId);
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalPrice').textContent = product.price;
        $('#productModal').modal('show');
    }
});

let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
}

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('list-group-item');
        cartItem.textContent = `${item.name} - ${item.price}`;
        cartContainer.appendChild(cartItem);
    });
    document.getElementById('cart-count').textContent = cart.length;
}

// Add Cart Modal
document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cartModalLabel">Shopping Cart</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul id="cart-items" class="list-group">
              <!-- Cart items will be inserted here -->
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Checkout</button>
          </div>
        </div>
      </div>
    </div>
`);

// Add Cart Button to Navbar
const cartButton = document.createElement('button');
cartButton.classList.add('btn', 'btn-primary', 'ml-3');
cartButton.innerHTML = `Cart (<span id="cart-count">0</span>)`;
cartButton.setAttribute('data-toggle', 'modal');
cartButton.setAttribute('data-target', '#cartModal');
document.querySelector('.navbar-nav').appendChild(cartButton);


document.querySelectorAll('.list-group-item').forEach(item => {
    item.addEventListener('click', function() {
        const category = this.textContent;
        filterProductsByCategory(category);
    });
});

function filterProductsByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    renderProducts(filteredProducts);
}

function renderProducts(productsToRender) {
    productContainer.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4', 'product-card');

        productCard.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>${product.price}</strong></p>
                    <button class="btn btn-primary" onclick="showProductDetails(${product.id})">View Details</button>
                    <a href="#" class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</a>
                </div>
            </div>
        `;

        productContainer.appendChild(productCard);
    });
}

renderProducts(products); // Initial render of all products

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}
