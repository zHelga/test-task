
const apiUrl = 'http://api.valantis.store:40000/';
const password = 'Valantis';
const productsPerPage = 50;
let currentPage = 1;
let nameFilter = '';
        let priceFilter = '';
        let brandFilter = '';

async function fetchData(url = '', data = {}) {
    const response = await fetch(url, {
        
        method: 'POST',
        headers: {
                
            'Content-Type': 'application/json',
            'X-Auth': generateAuthHeader(),
                
        },
        body: JSON.stringify(data),
    });
return response.json();
}

function generateAuthHeader() {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return md5(password + '_' + timestamp);
}

async function displayProducts(page) {
    try {
        const offset = (page - 1) * productsPerPage;
        const data = {
            action: 'get_ids',
            params: { offset, limit: productsPerPage }
        };
        const response = await fetchData(apiUrl, data);

        // Очищаем список товаров перед обновлением
        document.getElementById('product-list').innerHTML = '';

        // Выводим каждый товар
        response.result.forEach(productId => {
            displayProductInfo(productId);
        });

        // Обновляем пагинацию
        updatePagination(page);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayProductInfo(productId) {
    try {
        const data = {
            action: 'get_items',
            params: { ids: [productId] }
        };
        const response = await fetchData(apiUrl, data);
        console.log(response)
        // Отображаем информацию о товаре
        const product = response.result[0];
        if (
            (nameFilter === '' || product.product.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (priceFilter === '' || product.price.toString().includes(priceFilter)) &&
            (brandFilter === '' || (product.brand && product.brand.toLowerCase().includes(brandFilter.toLowerCase())))
        ) {
            // Отображаем информацию о товаре, если он проходит через фильтры
            const productElement = document.createElement('div');
            productElement.classList.add('product__item')
            productElement.innerHTML = `
            <p class="product__id"><strong>ID:</strong> ${product.id}</p>
            <p class="product__name"><strong>Название:</strong> ${product.product}</p>
            <p class="product__price"><strong>Цена:</strong> ${product.price}</p>
            <p class="product__brand"><strong>Бренд:</strong> ${product.brand || 'Неизвестно'}</p>
                    
            `;
            document.getElementById('product-list').appendChild(productElement);
        } 
        // const productElement = document.createElement('div');
        // productElement.classList.add('product__item')
        // productElement.innerHTML = `
        //     <p class="product__id"><strong>ID:</strong> ${product.id}</p>
        //     <p class="product__name"><strong>Название:</strong> ${product.product}</p>
        //     <p class="product__price"><strong>Цена:</strong> ${product.price}</p>
        //     <p class="product__brand"><strong>Бренд:</strong> ${product.brand || 'Неизвестно'}</p>
                    
        //     `;
        //     document.getElementById('product-list').appendChild(productElement);
    } catch (error) {
        console.error('Error:', error);
    }
}

        function updatePagination(currentPage) {
            const paginationElement = document.getElementById('pagination');
            paginationElement.innerHTML = '';

            // Кнопка "Предыдущая страница"
            const prevButton = document.createElement('button');
            prevButton.classList.add("btn");
            prevButton.classList.add("btn-prev");
            prevButton.textContent = 'Предыдущая страница';
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    displayProducts(currentPage - 1);
                }
            });
            paginationElement.appendChild(prevButton);

            // Кнопка "Следующая страница"
            const nextButton = document.createElement('button');
            nextButton.classList.add("btn");
            nextButton.classList.add("btn-next");
            nextButton.textContent = 'Следующая страница';
            nextButton.addEventListener('click', () => {
                displayProducts(currentPage + 1);
            });
            paginationElement.appendChild(nextButton);
        }
        function applyFilters() {
            nameFilter = document.getElementById('nameFilter').value.trim();
            priceFilter = document.getElementById('priceFilter').value.trim();
            brandFilter = document.getElementById('brandFilter').value.trim();
            currentPage = 1;
            displayProducts(currentPage);
        }

        function clearFilters() {
            document.getElementById('nameFilter').value = '';
            document.getElementById('priceFilter').value = '';
            document.getElementById('brandFilter').value = '';
            nameFilter = '';
            priceFilter = '';
            brandFilter = '';
            currentPage = 1;
            displayProducts(currentPage);
        }
        document.addEventListener('DOMContentLoaded', () => {
            // При загрузке страницы выводим первую страницу товаров
            displayProducts(currentPage);
        });