async function loadUser() {
    const res = await fetch("https://webappvercel.azurewebsites.net/api/dashboard", {
        method: "GET",
        credentials: "include"
    });

    const data = await res.json();
    document.getElementById("userInfo").innerHTML = `
          <p>Username: ${data.user.username}</p>
    `;
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('https://webappvercel.azurewebsites.net/api/logout', {
        method: 'POST',
        credentials: 'include'
    });
    alert("Logged out");
    window.location.href = 'login.html';
});

loadUser();