const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const res = await fetch('https://webappvercel.azurewebsites.net/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    const result = await res.json();
    alert(result.message);
    if (res.ok) window.location.href = 'dashboard.html';
});