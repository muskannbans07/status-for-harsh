// ----------------- Local Storage Helpers -----------------

function saveQuickLink(link) {
    let links = JSON.parse(localStorage.getItem("quick-links")) || [];
    links.push(link);
    localStorage.setItem("quick-links", JSON.stringify(links));
}

function getQuickLinks() {
    return JSON.parse(localStorage.getItem("quick-links")) || [];
}

  function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
  }
  
  function getCourses() {
    return JSON.parse(localStorage.getItem('courses')) || [];
  }
  
  function saveEvent(eventName, eventDate) {
    let events = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    const event = { name: eventName, date: eventDate, alerted: false };
    events.push(event);
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }
  
  function getEvents() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || [];
  }
  // ----------------- Calendar and Notes Setup -----------------
  
  document.addEventListener('DOMContentLoaded', function() {
    // Setup Calendar
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function(info) {
            var eventName = prompt("Enter event name:");
            if (eventName) {
                calendar.addEvent({
                    title: eventName,
                    start: info.dateStr,
                    allDay: true
                });
                saveEvent(eventName, info.dateStr);
            }
        },
        eventClick: function(info) {
            if (confirm(`Delete event: "${info.event.title}"?`)) {
                info.event.remove();
                let events = getEvents();
                events = events.filter(event => !(event.name === info.event.title && event.date === info.event.startStr));
                localStorage.setItem("calendarEvents", JSON.stringify(events));
            }
        },
        eventDidMount: function(info) {
            info.el.classList.add('custom-event');
        }
    });
  
    var savedEvents = getEvents();
    savedEvents.forEach(function(event) {
        calendar.addEvent({
            title: event.name,
            start: event.date,
            allDay: true
        });
    });
  
    calendar.render();

  
    // Setup Countdown Timer
    const originalDate = new Date("2025-05-17");
    let holidayDate = new Date(originalDate);
  
    function updateDaysLeft() {
        const now = new Date();
        const timeDiff = holidayDate - now;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const daysLeftElement = document.getElementById("daysLeft");
        const semesterHeading = document.getElementById("semesterHeading");
  
        daysLeftElement.textContent = daysLeft;
        semesterHeading.textContent = daysLeft <= 0 ? "Enjoy Your Break!" : "Days Until Break :";
  
        if (daysLeft <= 0) {
            launchPastelConfetti();
        }
    }
  
    window.adjustDays = function(amount) {
        holidayDate.setDate(holidayDate.getDate() + amount);
        updateDaysLeft();
    }
  
    document.addEventListener('DOMContentLoaded', function() {
        updateDaysLeft(); // Ensure this is called on page load
    });
  
    function launchPastelConfetti() {
        confetti({
            particleCount: 900,
            spread: 100,
            startVelocity: 50,
            origin: { y: 0.6 },
            colors: ['#ffb3c6', '#ffc9de', '#bff0d4', '#f9f3a9', '#bae1ff'],
            scalar: 1.2
        });
    }
  });

// ----------------- Course Page Setup -----------------

let courses = getCourses(); // Get the courses from local storage or initialize empty array.

if (courses.length === 0) {
    courses = [
        { title: "Data Structures", code: "BIOL 101", image: "Unknown-2 copy.jpg" },
        { title: "Discrete Mathematics", code: "CHEM 105", image: "Unknown-2 copy.jpg" },
        { title: "System Programming", code: "MATH 120", image: "Unknown-2 copy.jpg" }
    ];
    saveCourses();
}

// Render courses function
function renderCourses() {
    const coursesGrid = document.querySelector('.courses-grid');
    coursesGrid.innerHTML = ''; // Clear existing courses

    courses.forEach((course, index) => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="course-info">
                <h2>${course.title}</h2>
                <p>${course.code}</p>
            </div>
            <button class="edit-button" data-index="${index}">Edit</button>
            <div class="dropdown" id="dropdown-${index}">
                <button class="dropdown-toggle"></button>
                <div class="dropdown-menu">
                    <button class="rename-course" data-index="${index}">Change Course Name</button>
                    <button class="change-code" data-index="${index}">Change Course Code</button>
                    <button class="delete-course" data-index="${index}">Delete Course</button>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openCourseModal(course.title, course.code, course.image));
        coursesGrid.appendChild(card);
    });

    // Attach edit button functionality
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent triggering card click
            const index = this.getAttribute('data-index');
            const dropdown = document.getElementById(`dropdown-${index}`);
            dropdown.classList.toggle('show');
        });
    });

    // Attach rename, change code, and delete functionality
    document.querySelectorAll('.rename-course').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop modal from opening
            const index = this.getAttribute('data-index');
            const newName = prompt('Enter new course name:', courses[index].title);
            if (newName) {
                courses[index].title = newName;
                saveCourses();
                renderCourses();
            }
        });
    });

    document.querySelectorAll('.change-code').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop modal from opening
            const index = this.getAttribute('data-index');
            const newCode = prompt('Enter new course code:', courses[index].code);
            if (newCode) {
                courses[index].code = newCode;
                saveCourses();
                renderCourses();
            }
        });
    });

    document.querySelectorAll('.delete-course').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop modal from opening
            const index = this.getAttribute('data-index');
            if (confirm('Are you sure you want to delete this course permanently?')) {
                courses.splice(index, 1);
                saveCourses();
                renderCourses();
            }
        });
    });
}

// Add New Course
document.getElementById('newPageBtn').addEventListener('click', function() {
    const newCourse = { title: "New Course", code: "NEW 123", image: "Unknown-2 copy.jpg" };
    courses.push(newCourse);
    saveCourses();
    renderCourses(); // Re-render after adding the course
});

// Modal for Course Info
const modal = document.getElementById('courseModal');
const modalTitle = document.getElementById('modalTitle');
const modalCode = document.getElementById('modalCode');
const modalImage = document.getElementById('modalImage');
const closeButton = document.querySelector('.close-button');

// Open Course Modal
function openCourseModal(title, code, imageSrc) {
    modalTitle.innerText = title;
    modalCode.innerText = code;
    modalImage.src = imageSrc || 'header-icon.jpg';
    modal.style.display = 'block';
}

// Close Modal
closeButton.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Initial render of courses
renderCourses();
  
  // ----------------- Assignment Setup -----------------
  
  let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
  
  function saveAssignments() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }
  
  function renderAssignments() {
    const list = document.getElementById('assignmentList');
    list.innerHTML = '';
  
    if (assignments.length === 0) {
        list.innerHTML = "<p style='text-align: center; font-size: 18px; color: #fff; font-family: Plus Jakarta Sans;'>No assignments yet!</p>";
        return;
    }
  
    assignments.forEach((a, index) => {
        const assignmentDiv = document.createElement('div');
        assignmentDiv.classList.add('assignment-card');
        assignmentDiv.style.position = 'relative';
  
        assignmentDiv.innerHTML = `
            <div style="padding-right: 60px;">
                <h4>${a.name}</h4>
                <p><strong>Due:</strong> ${new Date(a.deadline).toLocaleDateString()}</p>
                <p>Status: <span class="status-toggle ${a.completed ? 'completed' : 'not-completed'}" data-index="${index}">
                    ${a.completed ? 'Completed' : 'Not Completed'}
                </span></p>
            </div>
            <button class="delete-assignment" data-index="${index}">✖</button>
        `;
  
        list.appendChild(assignmentDiv);
    });
  
    document.querySelectorAll('.status-toggle').forEach(span => {
        span.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            assignments[index].completed = !assignments[index].completed;
            saveAssignments();
            renderAssignments();
        });
    });
  
    document.querySelectorAll('.delete-assignment').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            assignments.splice(index, 1);
            saveAssignments();
            renderAssignments();
        });
    });
  }
  
  document.getElementById('addAssignmentBtn').addEventListener('click', function() {
    const name = document.getElementById('assignmentName').value.trim();
    const deadline = document.getElementById('assignmentDeadline').value;
    const completed = document.getElementById('assignmentCompleted').checked;
  
    if (name && deadline) {
        const assignment = { name, deadline, completed };
        assignments.push(assignment);
        saveAssignments();
        renderAssignments();
  
        document.getElementById('assignmentName').value = '';
        document.getElementById('assignmentDeadline').value = '';
        document.getElementById('assignmentCompleted').checked = false;
    } else {
        alert('Please fill out both name and deadline!');
    }
  });
  
  renderAssignments();

  const table = document.getElementById('class-timetable');
  const STORAGE_KEY = 'myClassTimetable';


  // Load from localStorage
  function loadTimetable() {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const cells = table.querySelectorAll('tbody td[contenteditable]');
    cells.forEach((cell, index) => {
      if (savedData[index]) cell.innerText = savedData[index];
    });
  }

  // Save to localStorage
  function saveTimetable() {
    const cells = table.querySelectorAll('tbody td[contenteditable]');
    const data = Array.from(cells).map(cell => cell.innerText.trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // On page load
  window.addEventListener('DOMContentLoaded', () => {
    applyAlternatingColors();
    loadTimetable();
    table.querySelectorAll('td[contenteditable]').forEach(cell => {
      cell.addEventListener('input', saveTimetable);
    });
  });

  const todoInputs = document.querySelectorAll('.todo-text');
  const todoCheckboxes = document.querySelectorAll('.todo-list input[type="checkbox"]');

  // Load from localStorage
  window.addEventListener('DOMContentLoaded', () => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];

    savedTodos.forEach((todo, index) => {
      if (todoInputs[index]) {
        todoInputs[index].value = todo.text || '';
      }
      if (todoCheckboxes[index]) {
        todoCheckboxes[index].checked = todo.checked || false;
      }
    });
  });

  // Save to localStorage on change
  function saveTodos() {
    const todos = [];
    todoInputs.forEach((input, index) => {
      todos.push({
        text: input.value,
        checked: todoCheckboxes[index].checked
      });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  todoInputs.forEach(input => input.addEventListener('input', saveTodos));
  todoCheckboxes.forEach(box => box.addEventListener('change', saveTodos));


  window.addEventListener('DOMContentLoaded', () => {
    // Remove hash from URL on load to prevent auto-scroll to anchors
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  
    applyAlternatingColors();
    loadTimetable();
    table.querySelectorAll('td[contenteditable]').forEach(cell => {
      cell.addEventListener('input', saveTimetable);
    });
  
    // Load todos
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach((todo, index) => {
      if (todoInputs[index]) {
        todoInputs[index].value = todo.text || '';
      }
      if (todoCheckboxes[index]) {
        todoCheckboxes[index].checked = todo.checked || false;
      }
    });
  
    renderCourses();
    renderAssignments();
  });


  function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      // Remove focus from link (optional visual polish)
      if (event.target && typeof event.target.blur === 'function') {
        event.target.blur();
      }
      
      // Scroll smoothly
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  
      // Remove hash from URL to avoid anchor jump on reload
      history.pushState(null, null, ' ');
    } else {
      console.warn('Section not found:', sectionId);
    }
  }

