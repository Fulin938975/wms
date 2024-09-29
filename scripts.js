// scripts.js
async function submitForm(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    const response = await fetch('https://script.google.com/macros/s/AKfycbwT8bR4l3QxUgmy24EkuDhL6IV6llZzFqckYcizh8zQOfjPv2wZMe3lYM3Ebj1FqlBq9w/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const result = await response.text();
    alert(result);
}

function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}