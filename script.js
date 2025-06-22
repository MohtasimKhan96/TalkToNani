const users = [
    { email: "user@example.com", password: "password123" },
];

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days*864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '');
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const foundUser = users.find(user => user.email === email && user.password === password);

    if(foundUser) {
        localStorage.setItem('loggedInUser', email);
        let userName = email.split('@')[0];
        setCookie('username', userName, 7);
        setCookie('trialCount', 0, 7);
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        document.getElementById('welcomeMessage').innerText = `Hello ${userName}! You have 3 trial chats.`;
    } else {
        document.getElementById('loginMessage').innerText = 'Invalid credentials!';
    }
}

function sendMessage() {
    let trialCount = parseInt(getCookie('trialCount')) || 0;
    if (trialCount >= 3) {
        document.getElementById('trialNotice').innerText = "Trial over! Please sign up for full access.";
        return;
    }

    const userInput = document.getElementById('userInput').value;
    const chatlog = document.getElementById('chatlog');
    chatlog.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    const response = getNanuResponse(userInput);
    chatlog.innerHTML += `<p><strong>Nanu:</strong> ${response}</p>`;

    trialCount++;
    setCookie('trialCount', trialCount, 7);

    const userName = getCookie('username');
    document.getElementById('welcomeMessage').innerText = `Hello ${userName}! You have ${3 - trialCount} trial chats left.`;
}

function getNanuResponse(input) {
    input = input.toLowerCase();
    if (input.includes('sad') || input.includes('depressed')) {
        return "I'm sorry to hear that. Take a deep breath — brighter days are ahead. Consider talking to a trusted friend or professional.";
    } else if (input.includes('career')) {
        return "Careers take patience and passion. Follow what excites you — fulfillment follows curiosity.";
    } else if (input.includes('relationship')) {
        return "Communication, trust, and patience are keys to relationships. Be open, but set boundaries.";
    } else {
        return "That's interesting! Stay positive and take life one step at a time.";
    }
}

window.onload = () => {
    const loggedIn = localStorage.getItem('loggedInUser');
    if(loggedIn) {
        const userName = loggedIn.split('@')[0];
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        document.getElementById('welcomeMessage').innerText = `Welcome back ${userName}!`;
    }
}
