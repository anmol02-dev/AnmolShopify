let cart = JSON.parse(localStorage.getItem("cart")) || [];
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cart-items");
    let totalAmount = 0;
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        cartItems.innerHTML += `

            <tr>
                <td><img src="${item.imageUrl}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index},-1)">-</button>
                    ${item.quantity}
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index},1)">+</button>
                </td>
                <td>₹ ${itemTotal}</td>
                <td><button class="btn btn-danger btn-sm" onclick="changeQuantity(${index})">X</button></td>
            </tr>
        `;
    });
    document.getElementById("total-amount").innerText = totalAmount;
}

function addToCart(id, name, price, imageUrl) {
    console.log("Adding product to cart:", id, name, price, imageUrl);

    price = parseFloat(price);
    let itemIndex = cart.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    }
    else {
        cart.push({
            id: id,  // for easy tracking
            name: name,
            price: price,
            imageUrl: imageUrl,
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();

}


function updateCartCounter() {
    document.querySelector(".cart-badge").innerText = cart.length;
}


function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}

function removeFromCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}


document.addEventListener("DOMContentLoaded", loadCart);


let valueToPass = {
    name: "doreamon Kumarrrr",
    amount: 50000,
};

const checkOutHandler = async ({ name, amount }) => {
    try {
        const res = await fetch("https://paymentbackend-dig1.onrender.com/api/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                amount
            }),
        });

        const order = await res.json();
        console.log("order", order);


        var options = {
            key: "rzp_test_eEjLpvhY7wYV8w",
            amount: order.order.amount * 100, // amount in paise
            // amount: 7000,
            currency: order.order.currency,
            name: valueToPass.name,
            description: "Test Transaction",
            image: "https://your-image-url",
            order_id: order.order.id,
            callback_url: "https://paymentbackend-dig1.onrender.com/api/payment-verification",
            prefill: {
                name: 'avi',
                email: "avinash@example.com",
                contact: "+916239378916",
            },
            notes: {
                address: "Jalandhar, Punjab",
            },
            theme: {
                color: "#3399cc",
            },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    } catch (error) {
        console.log("got an error", error);
    }
};

const btnToCheckout = document.querySelector("#btnToCheckout");

btnToCheckout.addEventListener("click", () => checkOutHandler(valueToPass));
