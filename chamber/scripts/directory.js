// Mobile navigation menu
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
});

// Footer dates
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = new Date(document.lastModified).toLocaleString();

// Directory elements
const membersContainer = document.querySelector("#members-container");
const memberCount = document.querySelector("#member-count");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

// Load business information from JSON
async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Could not load members: ${response.status}`);
        }

        const members = await response.json();

        displayMembers(members);
    } catch (error) {
        console.error("Directory error:", error);
        membersContainer.innerHTML =
            "<p>Sorry, the business directory could not be loaded. Please try again.</p>";
        memberCount.textContent = "Directory unavailable";
    }
}

// Display the members
function displayMembers(members) {
    membersContainer.innerHTML = "";

    memberCount.textContent =
        `Showing ${members.length} business members`;

    members.forEach((member) => {
        const card = document.createElement("article");
        card.classList.add("member-card");

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} business logo`;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.src = "images/business-placeholder.svg";
        });

        const details = document.createElement("div");
        details.classList.add("member-details");

        const name = document.createElement("h3");
        name.textContent = member.name;

        const address = document.createElement("p");
        address.textContent = `Address: ${member.address}`;

        const phone = document.createElement("p");
        phone.textContent = `Phone: ${member.phone}`;

        const membership = document.createElement("span");
        membership.classList.add("membership");

        const membershipNames = {
            1: "Member",
            2: "Silver Member",
            3: "Gold Member"
        };

        membership.textContent =
            membershipNames[member.membershipLevel] || "Member";

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        details.append(
            name,
            address,
            phone,
            membership,
            document.createElement("br"),
            website
        );

        card.append(image, details);
        membersContainer.appendChild(card);
    });
}

// Change to grid view
gridButton.addEventListener("click", () => {
    membersContainer.classList.remove("members-list");
    membersContainer.classList.add("members-grid");

    gridButton.classList.add("active");
    listButton.classList.remove("active");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
});

// Change to list view
listButton.addEventListener("click", () => {
    membersContainer.classList.remove("members-grid");
    membersContainer.classList.add("members-list");

    listButton.classList.add("active");
    gridButton.classList.remove("active");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
});

// Start loading the directory
getMembers();