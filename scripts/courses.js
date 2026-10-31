
// WDD 231 - Course Information and Filtering

const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: true
    }
];

// Select HTML elements
const courseContainer = document.querySelector("#course-container");
const totalCredits = document.querySelector("#total-credits");
const courseCount = document.querySelector("#course-count");
const filterButtons = document.querySelectorAll(".filter-button");

// Display courses on the page
function displayCourses(courseList) {

    // Clear previous courses
    courseContainer.innerHTML = "";

    // Create a card for each course
    courseList.forEach((course) => {

        const card = document.createElement("article");

        card.classList.add("course-card");

        card.classList.add(
            course.completed ? "completed" : "not-completed"
        );

        const heading = document.createElement("h3");
        heading.textContent = `${course.subject} ${course.number}`;

        const courseTitle = document.createElement("p");
        courseTitle.textContent = course.title;

        const credits = document.createElement("p");
        credits.textContent = `${course.credits} Credits`;

        const status = document.createElement("p");
        status.classList.add("completion-status");

        status.textContent = course.completed
            ? "Completed"
            : "Not Completed";

        card.appendChild(heading);
        card.appendChild(courseTitle);
        card.appendChild(credits);
        card.appendChild(status);

        courseContainer.appendChild(card);
    });

    // Count displayed courses
    courseCount.textContent =
        `Showing ${courseList.length} course(s)`;

    // Calculate credits using reduce()
    const creditsTotal = courseList.reduce(
        (total, course) => total + course.credits,
        0
    );

    totalCredits.textContent = creditsTotal;
}

// Filter courses when a button is clicked
filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedFilter = button.dataset.filter;

        let filteredCourses;

        if (selectedFilter === "ALL") {
            filteredCourses = courses;
        } else {
            filteredCourses = courses.filter(
                (course) => course.subject === selectedFilter
            );
        }

        // Update active filter button
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove("active");
            filterButton.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        // Display filtered courses
        displayCourses(filteredCourses);
    });
});

// Display all courses when the page first loads
displayCourses(courses);
