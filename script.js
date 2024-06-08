const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const paymentMethodSelect = document.getElementById("payment-method");
const paymentWarn = document.getElementById("payment-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCartModal();
    updateCartCounter();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function updateCartCounter() {
    const distinctItems = cart.length;
    cartCounter.textContent = distinctItems;
}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
        updateCartCounter();
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

paymentMethodSelect.addEventListener("change", function (event) {
    let selectedValue = event.target.value;
    if (selectedValue !== "") {
        paymentMethodSelect.classList.remove("border-red-500");
        paymentWarn.classList.add("hidden");
    }
});

checkoutBtn.addEventListener("click", function (event) {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Loja Fechada • Abre às 18:00",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    let valid = true;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        valid = false;
    }

    const paymentMethod = paymentMethodSelect.value;
    if (paymentMethod === "") {
        paymentWarn.classList.remove("hidden");
        paymentMethodSelect.classList.add("border-red-500");
        valid = false;
    }

    if (!valid) return;

    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade (${item.quantity}) Preço: R$ ${item.price.toFixed(2)} |`;
    }).join("");

    const message = encodeURI(cartItems);
    const phone = "1981979935";
    const fullMessage = `${message} Endereço: ${addressInput.value} Forma de Pagamento: ${paymentMethod}`;

    window.open(`https://wa.me/${phone}?text=${fullMessage}`, "_blank");
    cart = [];
    addressInput.value = "";
    paymentMethodSelect.value = "";
    updateCartModal();
});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("datespan");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.textContent = "Loja aberta • 18:00 às 23:00";
    spanItem.style.backgroundColor = "#10B981";
} else {
    spanItem.textContent = "Loja fechada • Abre às 18:00";
    spanItem.style.backgroundColor = "#EF4444";
}
