const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("hidden");

    if (mobileMenu.classList.contains("hidden")) {
        menuIcon.innerHTML = `
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
            />
        `;
    } else {
        menuIcon.innerHTML = `
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
        `;
    }
});




const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const newContainer = document.getElementById("newsContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");


const homeLink = document.getElementById("homeLink");
const sportsLink = document.getElementById("sportsLink");
const technologyLink = document.getElementById("technologyLink");
const businessLink = document.getElementById("businessLink");

const NewsApiKey = CONFIG.NEWS_API_KEY;

let currentPage = 1;




async function fetchNews(loadMore = false) {

    try {

        
        if (!loadMore) {

            currentPage = 1;

            newContainer.innerHTML =
                '<p class="text-gray-400">Loading...</p>';

            loadMoreBtn.style.display = "inline-block";
            loadMoreBtn.textContent = "Load More";
            loadMoreBtn.disabled = false;
        }

        
        else {

            currentPage++;

            loadMoreBtn.textContent = "Loading...";
            loadMoreBtn.disabled = true;
        }


           const response = await fetch(`https://api.currentsapi.services/v1/latest-news?apiKey=${NewsApiKey}&language=en`);
           


        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }


        const data = await response.json();

        console.log(data);


        if (!loadMore) {
            newContainer.innerHTML = "";
        }


    
        if (data.news && data.news.length > 0) {

            data.news.forEach(article => {

                const card = document.createElement("div");

                card.classList.add(
                    "bg-white",
                    "rounded-lg",
                    "shadow-md",
                    "mb-4",
                    "overflow-hidden"
                );


                card.innerHTML = `
                    <img
                        src="${
                            article.image ||
                            "https://via.placeholder.com/400x200/cccccc/ffffff?text=No+Image"
                        }"
                        alt="${article.title || "News"}"
                        class="w-full h-48 object-cover"
                    >

                    <div class="p-4">

                        <h2 class="text-xl font-bold text-gray-900 mb-2">
                            ${article.title || "No title available"}
                        </h2>

                        <p class="text-gray-700 mb-3">
                            ${
                                article.description ||
                                "No description available"
                            }
                        </p>

                        <a
                            href="${article.url}"
                            target="_blank"
                            class="text-blue-600 hover:underline font-medium"
                        >
                            Read More →
                        </a>

                    </div>
                `;


               
                newContainer.appendChild(card);

            });


           
            loadMoreBtn.textContent = "Load More";
            loadMoreBtn.disabled = false;
            loadMoreBtn.style.display = "inline-block";

        }


       
        else {

            if (!loadMore) {

                newContainer.innerHTML = `
                    <p class="text-gray-400 text-center">
                        No results found
                    </p>
                `;

            }

         
            loadMoreBtn.style.display = "none";
        }

    }


    catch (error) {

        console.error("Error fetching news:", error);

        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.disabled = false;

        if (!loadMore) {

            newContainer.innerHTML = `
                <p class="text-red-500 text-center">
                    Failed to load news. Please try again.
                </p>
            `;

        }

    }

}




async function searchNews(query) {

    try {

        newContainer.innerHTML = `
            <p class="text-gray-400 text-center">
                Searching...
            </p>
        `;

        loadMoreBtn.style.display = "none";


        const response = await fetch(
            `https://api.currentsapi.services/v1/search?apiKey=${NewsApiKey}&language=en&keywords=${encodeURIComponent(query)}`
        );


        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }


        const data = await response.json();

        console.log(data);

        newContainer.innerHTML = "";


        if (data.news && data.news.length > 0) {

            data.news.forEach(article => {

                const card = document.createElement("div");

                card.classList.add(
                    "bg-white",
                    "rounded-lg",
                    "shadow-md",
                    "mb-4",
                    "overflow-hidden"
                );


                card.innerHTML = `
                    <img
                        src="${
                            article.image ||
                            "https://via.placeholder.com/400x200/cccccc/ffffff?text=No+Image"
                        }"
                        alt="${article.title || "News"}"
                        class="w-full h-48 object-cover"
                    >

                    <div class="p-4">

                        <h2 class="text-xl font-bold text-gray-900 mb-2">
                            ${article.title || "No title available"}
                        </h2>

                        <p class="text-gray-700 mb-3">
                            ${
                                article.description ||
                                "No description available"
                            }
                        </p>

                        <a
                            href="${article.url}"
                            target="_blank"
                            class="text-blue-600 hover:underline font-medium"
                        >
                            Read More →
                        </a>

                    </div>
                `;


                newContainer.appendChild(card);

            });

        }

        else {

            newContainer.innerHTML = `
                <p class="text-gray-400 text-center">
                    No results found
                </p>
            `;

        }

    }


    catch (error) {

        console.error("Error searching news:", error);

        newContainer.innerHTML = `
            <p class="text-red-500 text-center">
                Failed to search news.
            </p>
        `;

    }

}




searchBtn.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query) {

        searchNews(query);

    } else {

        fetchNews();

    }

});





searchInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});





async function newsByCategory(category) {

    try {

        newContainer.innerHTML = `
            <p class="text-gray-400 text-center">
                Loading ${category} news...
            </p>
        `;


        loadMoreBtn.style.display = "none";


        const response = await fetch(
            `https://api.currentsapi.services/v1/latest-news?apiKey=${NewsApiKey}&language=en&category=${category.toLowerCase()}`
        );


        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }


        const data = await response.json();

        console.log(data);

        newContainer.innerHTML = "";


        if (data.news && data.news.length > 0) {

            data.news.forEach(article => {

                const card = document.createElement("div");

                card.classList.add(
                    "bg-white",
                    "rounded-lg",
                    "shadow-md",
                    "mb-4",
                    "overflow-hidden"
                );


                card.innerHTML = `
                    <img
                        src="${
                            article.image ||
                            "https://via.placeholder.com/400x200/cccccc/ffffff?text=No+Image"
                        }"
                        alt="${article.title || "News"}"
                        class="w-full h-48 object-cover"
                    >

                    <div class="p-4">

                        <h2 class="text-xl font-bold text-gray-900 mb-2">
                            ${article.title || "No title available"}
                        </h2>

                        <p class="text-gray-700 mb-3">
                            ${
                                article.description ||
                                "No description available"
                            }
                        </p>

                        <a
                            href="${article.url}"
                            target="_blank"
                            class="text-blue-600 hover:underline font-medium"
                        >
                            Read More →
                        </a>

                    </div>
                `;


                newContainer.appendChild(card);

            });

        }

        else {

            newContainer.innerHTML = `
                <p class="text-gray-400 text-center">
                    No news found in this category
                </p>
            `;

        }

    }


    catch (error) {

        console.error(
            "Error fetching news by category:",
            error
        );

        newContainer.innerHTML = `
            <p class="text-red-500 text-center">
                Failed to load category news.
            </p>
        `;

    }

}




const categoryButtons =
    document.querySelectorAll(
        ".px-5.py-2.rounded-full"
    );


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category =
            button.textContent.trim();


       
        categoryButtons.forEach(btn => {

            btn.className =
                "px-5 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition";

        });


        
        button.className =
            "px-5 py-2 rounded-full bg-blue-600 text-white font-medium";


        if (category === "All") {

            fetchNews();

        } else {

            newsByCategory(category);

        }

    });

});

homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    fetchNews();
});

sportsLink.addEventListener("click", (e) => {
    e.preventDefault();
    newsByCategory("sports");
});

technologyLink.addEventListener("click", (e) => {
    e.preventDefault();
    newsByCategory("technology");
});

businessLink.addEventListener("click", (e) => {
    e.preventDefault();
    newsByCategory("business");
});






loadMoreBtn.addEventListener("click", () => {

    fetchNews(true);

});





fetchNews();