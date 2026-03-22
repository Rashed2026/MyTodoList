// Milestone 1: Main page display with hardcoded todos
// Add button is non-functional for this milestone

// Update current time in status bar
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = `${hours}:${minutes} ${ampm}`;
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Update time immediately and every minute
updateTime();
setInterval(updateTime, 60000);

// Milestone 1: Add button click shows placeholder message
const addButton = document.getElementById('addButton');
if (addButton) {
    addButton.addEventListener('click', () => {
        // This is just a placeholder for Milestone 1
        // No actual functionality required yet
        console.log('Add button clicked - functionality coming in Milestone 2');
        alert('Add new todo functionality will be added in Milestone 2!');
    });
}

// Add smooth animations for todo items
const todoItems = document.querySelectorAll('.todo-item');
todoItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.transition = 'all 0.3s ease';
    }, index * 100);
});