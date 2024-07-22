document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/api/images/upload', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        alert('Image uploaded successfully!');
        fetchImages();
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
    }
});

async function fetchImages() {
    try {
        const response = await fetch('/api/images/files');
        const images = await response.json();
        const imageList = document.getElementById('imageList');
        imageList.innerHTML = '';
        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `https://elosystemv1.onrender.com/api/images/file/${image.filename}`;
            imageList.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Fetch images on page load
fetchImages();
