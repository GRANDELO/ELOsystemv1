document.addEventListener('DOMContentLoaded', function() {
    let products = []; // Initialize empty array for products
    let cart = []; // Initialize empty array for cart items

    // Fetch products from an API or backend
    async function fetchProducts() {
        try {
            const response = await axios.get('https://api.example.com/products'); // Replace with your API endpoint
            products = response.data; // Assuming API returns an array of products
            renderProducts(products); // Render products once fetched
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Render products in the UI
    function renderProducts(productsToRender) {
        const productContainer = document.getElementById('product-list');
        productContainer.innerHTML = ''; // Clear existing content

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
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `;

            productContainer.appendChild(productCard);
        });
    }

    // Show product details in modal
    window.showProductDetails = function(productId) {
        const product = products.find(p => p.id === productId);
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalPrice').textContent = product.price;
        $('#productModal').modal('show');
    }

    // Add product to cart
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        cart.push(product);
        updateCart();
    }

    // Update cart UI
    function updateCart() {
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''; // Clear existing cart items

        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.classList.add('list-group-item');
            cartItem.textContent = `${item.name} - ${item.price}`;
            cartContainer.appendChild(cartItem);
        });

        document.getElementById('cart-count').textContent = cart.length; // Update cart count
    }

    // Clear cart
    window.clearCart = function() {
        cart = [];
        updateCart();
    }

    // Checkout process
    window.checkout = function() {
        // Example: Redirect to checkout page or handle payment process
        alert('Redirecting to checkout...');
        // Additional logic can be added here, such as clearing cart after successful checkout
    }

    // Filter products by category
    window.filterProductsByCategory = function(category) {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }

    // Search products
    window.searchProducts = function() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }

    // Initialize: Fetch products from API
    fetchProducts();
});
