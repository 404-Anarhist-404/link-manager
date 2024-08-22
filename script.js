async function fetchLinks() {
    const response = await fetch('links.json');
    return await response.json();
}

async function saveLink(id, url) {
    const links = await fetchLinks();
    links[id] = url;

    // Убедитесь, что этот URL указывает на серверный скрипт для обновления JSON
    await fetch('https://yourserver.com/update-links', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(links),
    });
}

document.getElementById('linkForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const linkId = document.getElementById('linkId').value.trim();
    const linkUrl = document.getElementById('linkUrl').value.trim();
    const linksList = document.getElementById('linksList');

    if (!linkId || !linkUrl) {
        alert('Please provide both ID and URL.');
        return;
    }

    // Add the new link to the list
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="${linkUrl}" target="_blank">${linkId}</a>`;
    linksList.appendChild(listItem);

    // Save to JSON file
    await saveLink(linkId, linkUrl);

    // Clear the form fields
    document.getElementById('linkId').value = '';
    document.getElementById('linkUrl').value = '';
});

document.getElementById('download-btn').addEventListener('click', async function(event) {
    event.preventDefault();

    const linkId = document.getElementById('linkIdInput').value.trim();
    const links = await fetchLinks();
    const linkUrl = links[linkId];

    if (!linkUrl) {
        alert('Link not found.');
        return;
    }

    const timer = document.getElementById('timer');
    const timerMessage = document.getElementById('timer-message');
    const downloadBtn = document.getElementById('download-btn');
    let width = 0;

    downloadBtn.disabled = true;

    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            timer.style.display = 'none';
            timerMessage.style.display = 'none';
            downloadBtn.disabled = false;
            // Pереход по уникальной ссылке
            setTimeout(() => {
                window.location.href = linkUrl;
            }, 1000); // Задержка 1 секунда
        } else {
            width++;
            timer.style.width = width + '%';
            timer.style.background = `linear-gradient(90deg, rgba(255,105,180, ${width / 100}), rgba(0,250,154, ${width / 100}))`;
        }
    }, 50); // 5 секунд / 100 шагов = 50 миллисекунд на шаг
});

