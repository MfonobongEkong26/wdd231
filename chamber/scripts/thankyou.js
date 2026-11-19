
// Display the current year in the footer
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Get submitted form information from the URL
const params = new URLSearchParams(window.location.search);

// Get the application details container
const applicationDetails = document.querySelector("#application-details");

// Required form information
const applicantInfo = [
    ["First Name", params.get("firstName")],
    ["Last Name", params.get("lastName")],
    ["Email Address", params.get("email")],
    ["Mobile Phone Number", params.get("phone")],
    ["Business/Organization Name", params.get("organization")],
    ["Application Date", params.get("timestamp")]
];

// Display the information
if (applicationDetails) {
    applicationDetails.innerHTML = "";

    applicantInfo.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        paragraph.appendChild(strong);

        if (label === "Application Date" && value) {
            const date = new Date(value);
            paragraph.appendChild(
                document.createTextNode(
                    Number.isNaN(date.getTime()) ? "Not provided" : date.toLocaleString()
                )
            );
        } else {
            paragraph.appendChild(
                document.createTextNode(value || "Not provided")
            );
        }

        applicationDetails.appendChild(paragraph);
    });
}


// Mobile navigation
function setupNavigation() {
    const menuButton = document.querySelector("#menu-button");
    const navigation = document.querySelector("#primary-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            navigation.classList.toggle("open");

            const isOpen = navigation.classList.contains("open");

            menuButton.setAttribute("aria-expanded", isOpen);
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });
    }
}

setupNavigation();
