document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const resultsGrid = document.getElementById('results-grid');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Drag and Drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }

    uploadArea.addEventListener('drop', handleDrop, false);
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }

    async function uploadFile(file) {
        // Show loading
        loadingOverlay.style.display = 'flex';
        resultsGrid.innerHTML = '';
        resultsGrid.classList.remove('visible');
        uploadArea.style.display = 'none';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            renderResults(data);

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the image.');
            uploadArea.style.display = 'flex';
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    function renderResults(data) {
        resultsGrid.innerHTML = '';

        // Create a container for the grid image
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-image-container';

        const gridImg = document.createElement('img');
        gridImg.src = data.grid_image;
        gridImg.alt = 'Decades through time grid';
        gridImg.className = 'grid-image';

        gridContainer.appendChild(gridImg);

        // Add decade labels overlay (4×4 grid)
        const labelsOverlay = document.createElement('div');
        labelsOverlay.className = 'age-labels-overlay';

        data.decades.forEach((decade, index) => {
            const label = document.createElement('div');
            label.className = 'age-label-grid';
            label.textContent = decade;

            // Position labels in 4×4 grid
            const row = Math.floor(index / 4);
            const col = index % 4;
            label.style.gridColumn = col + 1;
            label.style.gridRow = row + 1;

            labelsOverlay.appendChild(label);
        });

        gridContainer.appendChild(labelsOverlay);
        resultsGrid.appendChild(gridContainer);

        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download Image
        `;
        downloadBtn.onclick = () => downloadImage(data.grid_image, data.decades[0] || 'decades');
        resultsGrid.appendChild(downloadBtn);

        resultsGrid.classList.add('visible');
    }

    function downloadImage(imageDataUrl, decade) {
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = `decades-through-time-${decade}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
