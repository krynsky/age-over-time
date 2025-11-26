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
        uploadArea.style.display = 'none'; // Optional: hide upload area or move it

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
            renderResults(data.results);

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the image.');
            uploadArea.style.display = 'flex'; // Show upload area again on error
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    function renderResults(results) {
        resultsGrid.innerHTML = '';
        
        results.forEach((item, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.style.animationDelay = `${index * 100}ms`;
            
            gridItem.innerHTML = `
                <img src="${item.image}" alt="Age ${item.age}">
                <div class="age-label">Age ${item.age}</div>
            `;
            
            resultsGrid.appendChild(gridItem);
        });

        resultsGrid.classList.add('visible');
        
        // Add a "Try Again" button or similar if desired
        // For now, we can just leave the grid visible
    }
});
