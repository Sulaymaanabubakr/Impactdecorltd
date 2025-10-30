// Projects Page JavaScript

async function loadProjectsPreviews() {
    if (!db) return;

    const imagesPreview = document.getElementById('images-preview');
    const videosPreview = document.getElementById('videos-preview');

    if (!imagesPreview && !videosPreview) return;

    try {
        // Load images preview
        if (imagesPreview) {
            const imagesSnapshot = await db.collection('media')
                .where('type', '==', 'image')
                .orderBy('uploadDate', 'desc')
                .limit(6)
                .get();

            if (imagesSnapshot.empty) {
                imagesPreview.innerHTML = '<p class="loading">No images available yet.</p>';
            } else {
                imagesPreview.innerHTML = '';
                imagesSnapshot.forEach(doc => {
                    const data = doc.data();
                    const card = createPreviewCard(data);
                    imagesPreview.appendChild(card);
                });
            }
        }

        // Load videos preview
        if (videosPreview) {
            const videosSnapshot = await db.collection('media')
                .where('type', '==', 'video')
                .orderBy('uploadDate', 'desc')
                .limit(6)
                .get();

            if (videosSnapshot.empty) {
                videosPreview.innerHTML = '<p class="loading">No videos available yet.</p>';
            } else {
                videosPreview.innerHTML = '';
                videosSnapshot.forEach(doc => {
                    const data = doc.data();
                    const card = createPreviewCard(data);
                    videosPreview.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error('Error loading projects preview:', error);
        if (imagesPreview) {
            imagesPreview.innerHTML = '<p class="loading">Error loading images.</p>';
        }
        if (videosPreview) {
            videosPreview.innerHTML = '<p class="loading">Error loading videos.</p>';
        }
    }
}

function createPreviewCard(data) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');

    if (data.type === 'image') {
        card.innerHTML = `
            <img src="${data.url}" alt="${data.title}" loading="lazy">
            <div class="project-info">
                <h3>${data.title}</h3>
                <p>${data.description.substring(0, 100)}${data.description.length > 100 ? '...' : ''}</p>
            </div>
        `;
    } else {
        card.innerHTML = `
            <video src="${data.url}" loading="lazy" muted></video>
            <div class="project-info">
                <h3>${data.title}</h3>
                <p>${data.description.substring(0, 100)}${data.description.length > 100 ? '...' : ''}</p>
            </div>
        `;
    }

    return card;
}

// Initialize projects page
loadProjectsPreviews();
