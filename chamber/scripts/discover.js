
import { places } from "../data/places.mjs";

// Select the elements from the Discover page
const discoverCards = document.querySelector("#discover-cards");
const visitMessage = document.querySelector("#visit-message");

// Display the visitor's last-visit message
function displayVisitMessage() {
    const lastVisit = localStorage.getItem("lastVisit");
    const currentVisit = Date.now();

    if (!lastVisit) {
        visitMessage.textContent =
            "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - Number(lastVisit);
        const oneDay = 24 * 60 * 60 * 1000;

        if (timeDifference < oneDay) {
            visitMessage.textContent =
                "Back so soon! Awesome!";
        } else {
            const daysAgo = Math.floor(timeDifference / oneDay);
            const dayWord = daysAgo === 1 ? "day" : "days";

            visitMessage.textContent =
                `You last visited ${daysAgo} ${dayWord} ago.`;
        }
    }

    // Save the current visit date
    localStorage.setItem("lastVisit", currentVisit);
}

// Create and display the eight place cards
function displayPlaces() {
    discoverCards.innerHTML = "";

    places.forEach((place) => {
        const card = document.createElement("article");
        card.classList.add("discover-card");

        const heading = document.createElement("h2");
        heading.textContent = place.name;

        const figure = document.createElement("figure");
        const image = document.createElement("img");

        image.src = `images/places/${place.id}.webp`;
        image.alt = `View of ${place.name}`;
        image.width = 300;
        image.height = 200;
        image.loading = "lazy";

        figure.appendChild(image);

        const address = document.createElement("address");
        address.textContent = place.address;

        const description = document.createElement("p");
        description.textContent = place.description;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Learn More";

        button.addEventListener("click", () => {
            const mapURL =
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;

            window.open(mapURL, "_blank", "noopener,noreferrer");
        });

        card.append(
            heading,
            figure,
            address,
            description,
            button
        );

        discoverCards.appendChild(card);
    });
}

// Run the page functions
displayVisitMessage();
displayPlaces();
