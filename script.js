document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-form').addEventListener('submit', handleFormSubmit);

    let resultDiv; // Declare resultDiv variable
    let currentIndex = 0; // Declare currentIndex variable

    function handleFormSubmit(event) {
        event.preventDefault();

        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value;
        console.log('The search term is:', searchTerm);

        displaySearchResults(searchTerm);
    }

    function displaySearchResults(searchTerm) {
        const options = {
            method: 'GET',
            headers: {
                'X-BingApis-SDK': 'true',
                'Accept-Language': 'EN',
                'X-RapidAPI-Key': '8091602d46mshf99e8ea64c4cfb5p1e8025jsnf2f259281391',
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
            },
        };

        fetch(
            `https://bing-news-search1.p.rapidapi.com/news/search?q=${searchTerm}&count=50&originalImg=true&textDecorations=true&freshness=Day&textFormat=Html`,
            options
        )
            .then((response) => response.json())
            .then((response) => {
                const searchResults = response.value;

                function displayNews() {
                    const result = searchResults[currentIndex];

                    const title = result.name;
                    const description = result.description;
                    const url = result.url;
                    const imageUrl = result.image?.thumbnail?.contentUrl;

                    resultDiv = document.createElement('div'); // Assign the created element to resultDiv variable
                    resultDiv.classList.add('result');
                    resultDiv.innerHTML = `
                        <div class="image-container">
                            <img src="${imageUrl}" alt="${title}">
                        </div>
                        <div class="details-container">
                            <a href="${url}" target="_blank">
                                <h2>${title}</h2>
                            </a>
                            <p>${description}</p>
                        </div>
                    `;

                    const searchResultsContainer = document.getElementById('search-results');
                    searchResultsContainer.innerHTML = '';
                    searchResultsContainer.appendChild(resultDiv);

                    updateButtonVisibility();

                    // Apply slide-in transition
                    resultDiv.classList.add('slide-in');
                    if (currentIndex === 0) {
                        resultDiv.classList.add('slide-in-right');
                    } else if (currentIndex === searchResults.length - 1) {
                        resultDiv.classList.add('slide-in-left');
                    }
                }

                function showPreviousNews() {
                    if (currentIndex > 0) {
                        currentIndex--;
                        displayNews();
                    }
                }

                function showNextNews() {
                    if (currentIndex < searchResults.length - 1) {
                        currentIndex++;
                        displayNews();
                    }
                }

                function updateButtonVisibility() {
                    const previousIcon = document.getElementById('previous-button');
                    const nextIcon = document.getElementById('next-button');

                    if (previousIcon && nextIcon) {
                        previousIcon.style.display = currentIndex === 0 ? 'none' : 'inline-block';
                        nextIcon.style.display = currentIndex === searchResults.length - 1 ? 'none' : 'inline-block';
                    }
                }

                displayNews();

                document.addEventListener('keydown', handleArrowKey);

                function handleArrowKey(event) {
                    if (event.keyCode === 37) { // Left arrow key
                        event.preventDefault();
                        showPreviousNews();
                        resultDiv.classList.add('slide-in-left');
                        resultDiv.classList.remove('slide-in-right');
                    } else if (event.keyCode === 39) { // Right arrow key
                        event.preventDefault();
                        showNextNews();
                        resultDiv.classList.add('slide-in-right');
                        resultDiv.classList.remove('slide-in-left');
                    }
                }
            })
            .catch((err) => console.error(err));
    }
});


