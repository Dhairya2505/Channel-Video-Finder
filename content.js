// Function to check if the current URL matches the target pattern (YouTube Channel Videos Page)
function isVideosPage() {
    const urlPattern = /^https:\/\/www\.youtube\.com\/@[^/]+\/videos$/;
    return urlPattern.test(window.location.href);
}

// Create the container for the input box and button
const container = document.createElement('div');
container.id = "containerInputButton"
container.style.position = 'fixed';
container.style.bottom = '20px';
container.style.right = '20px';
container.style.display = 'flex';
container.style.gap = '10px';
container.style.zIndex = '1000';

// Create the input box
const inputBox = document.createElement('input');
inputBox.type = 'text';
inputBox.placeholder = 'Type a keyword...';
inputBox.style.padding = '10px';
inputBox.style.border = '1px solid #ccc';
inputBox.style.borderRadius = '4px';
inputBox.style.fontSize = '14px';

// Create the search button
const button = document.createElement('button');
button.textContent = 'Search';
button.style.padding = '10px 15px';
button.style.backgroundColor = '#007BFF';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '4px';
button.style.cursor = 'pointer';
button.style.fontSize = '14px';

// Function to filter videos based on the keyword
function filterVideo(videoElement, keyword) {
    const titleElement = videoElement.querySelector('#video-title');
    if (titleElement) {
        const titleText = titleElement.textContent.trim().toLowerCase();
        videoElement.style.display = titleText.includes(keyword) ? 'block' : 'none';
    }
}

// Function to handle the search functionality
button.addEventListener('click', () => {
    const keyword = inputBox.value.trim().toLowerCase();

    if (!keyword) {
        alert('Please enter a keyword!');
        return;
    }

    // Get the container for videos
    const videoContainer = document.querySelector('#contents');
    if (!videoContainer) {
        alert('Video container not found!');
        return;
    }

    // Initial filtering of already-loaded videos
    const videos = videoContainer.querySelectorAll('ytd-rich-item-renderer');
    videos.forEach((video) => filterVideo(video, keyword));

    // Create a MutationObserver to handle newly added videos
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((newNode) => {
                    if (newNode.nodeType === 1 && newNode.matches('ytd-rich-item-renderer')) {
                        filterVideo(newNode, keyword);
                    }
                });
            }
        });
    });

    // Observe for newly added videos
    observer.observe(videoContainer, { childList: true, subtree: true });
});

// Function to handle the dynamic addition and removal of input box based on page URL
function handlePageChanges() {
    console.log(window.location.href)
    if (isVideosPage()) {
        // Check if the input box already exists to prevent duplicates
        if (!document.getElementById('containerInputButton')) {
            // Append the input box and button to the body if on the correct page
            container.appendChild(inputBox);
            container.appendChild(button);
            document.body.appendChild(container);
        }
    } else {
        // If the user navigates away, remove the input box and button
        const existingcontainer = document.getElementById('containerInputButton');
        if (existingcontainer) existingcontainer.remove();
    }
}

// Listen to changes in the page URL dynamically using MutationObserver
let lastUrl = window.location.href;
const pageChangeObserver = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        handlePageChanges(); // Handle changes in the page
    }
});
pageChangeObserver.observe(document.body, { childList: true, subtree: true });

// Initial check when the script runs
handlePageChanges();
