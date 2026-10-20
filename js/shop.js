document.addEventListener("DOMContentLoaded", () => {
    const products = {
        daisies: {
            name: "Ромашки",
            image: "images/daisies.svg",
            price: "1 200 ₽",
            description: "Лёгкий и нежный букет для тёплого настроения."
        },
        orchid: {
            name: "Орхидея",
            image: "images/orchid.svg",
            price: "2 100 ₽",
            description: "Элегантное растение для дома или рабочего места."
        },
        peony: {
            name: "Пионы",
            image: "images/peony.svg",
            price: "2 800 ₽",
            description: "Пышные цветы для подарка и праздничного оформления."
        },
        roses: {
            name: "Розы",
            image: "images/roses.svg",
            price: "2 500 ₽",
            description: "Классический букет, который подходит для разных событий."
        },
        succulents: {
            name: "Суккуленты",
            image: "images/succulents.svg",
            price: "900 ₽",
            description: "Неприхотливые растения для уютного интерьера."
        },
        tulips: {
            name: "Тюльпаны",
            image: "images/tulips.svg",
            price: "1 800 ₽",
            description: "Яркий букет, который подарит весеннее настроение."
        }
    };

    const params = new URLSearchParams(window.location.search);
    const selectedProduct = params.get("product");
    const validProduct = selectedProduct && products[selectedProduct]
        ? selectedProduct
        : null;

    // Фильтрация карточек в каталоге.
    const filterButtons = document.querySelectorAll("[data-filter]");
    const productCards = document.querySelectorAll("[data-product-card]");
    const emptyMessage = document.querySelector("#filterEmpty");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.filter;
            let visibleCount = 0;

            productCards.forEach((card) => {
                const matches =
                    category === "all" || card.dataset.category === category;

                card.classList.toggle("d-none", !matches);

                if (matches) {
                    visibleCount++;
                }
            });

            filterButtons.forEach((item) => {
                const isActive = item === button;

                item.classList.toggle("btn-shop", isActive);
                item.classList.toggle("btn-outline-shop", !isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            if (emptyMessage) {
                emptyMessage.classList.toggle("d-none", visibleCount > 0);
            }
        });
    });

    // Запоминаем выбранный товар при открытии модального окна.
    const orderModal = document.querySelector("#orderModal");
    const modalOrderLink = document.querySelector("#modalOrderLink");

    if (orderModal && modalOrderLink) {
        orderModal.addEventListener("show.bs.modal", (event) => {
            const trigger = event.relatedTarget;
            const productId = trigger?.dataset.product;

            if (productId && products[productId]) {
                modalOrderLink.href =
                    `order.html?product=${encodeURIComponent(productId)}`;
            } else {
                modalOrderLink.href = "order.html";
            }
        });
    }

    // Автоматически выбираем товар в форме заказа.
    const productSelect = document.querySelector("#orderProduct");

    if (validProduct && productSelect) {
        const matchingOption = Array.from(productSelect.options).find(
            (option) => option.value === validProduct
        );

        if (matchingOption) {
            productSelect.value = validProduct;
        }
    }

    // Подставляем сведения о товаре на странице product.html.
    if (validProduct) {
        const product = products[validProduct];

        const title = document.querySelector("#productTitle");
        const image = document.querySelector("#productImage");
        const price = document.querySelector("#productPrice");
        const description = document.querySelector("#productDescription");
        const orderLink = document.querySelector("#productOrderLink");

        if (title) title.textContent = product.name;

        if (image) {
            image.src = product.image;
            image.alt = product.name;
        }

        if (price) price.textContent = product.price;

        if (description) {
            description.textContent = product.description;
        }

        if (orderLink) {
            orderLink.href =
                `order.html?product=${encodeURIComponent(validProduct)}`;
        }

        document.title = `${product.name} — FloraShop`;
    }

    // Демонстрационная проверка формы заказа.
    const orderForm = document.querySelector("#orderForm");
    const successMessage = document.querySelector("#orderSuccess");

    if (orderForm && successMessage) {
        orderForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!orderForm.checkValidity()) {
                orderForm.reportValidity();
                return;
            }

            successMessage.classList.remove("d-none");
            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }
});