const categoryBtnArea = document.getElementById('category-btn-area');
const videoArea = document.getElementById('video-area');
const spinner = document.getElementById('spinner');
let curVideos = [];



// Load Categories
const loadCategories = async () => {
    try {
        const response = await fetch("https://openapi.programming-hero.com/api/videos/categories");
        const data = await response.json();
    
        showCategoryBtn(data.data);
        loadVideos(data.data[0].category_id);
    }
    catch {
        (err) => console.log(err);
    }
}

// Load Videos
const loadVideos = async (catId) => {
    videoArea.innerHTML = '';
    catBtndec(catId);
    spinner.style.display = 'block';
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${catId}`);
        const data = await response.json();
        curVideos = [...data.data];
        showVideos();
    }
    catch {
        (err) => console.log(err);
    }
}

// Show Category Btn
const showCategoryBtn = (data) => {
    data.forEach(category => {
        const btn = document.createElement('button');
        btn.id = category.category_id;
        btn.classList.add('category-btn');
        btn.setAttribute('onclick', `loadVideos(${category.category_id})`);
        btn.innerText = `${category.category}`;
        categoryBtnArea.appendChild(btn);
    });
}

// Convert Time
const convertTime = (data) => {
    const hours = parseInt(data / 3600);
    const remain = data % 3600;
    const mins = parseInt(remain / 60);
    const time = `${hours} hrs ${mins} mins ago`;
    if (hours || mins) return time;
    else return null;
}

// Show Videos 
const showVideos = () => {
    videoArea.innerHTML = '';
    spinner.style.display = 'none';
    if (curVideos.length > 0) {
        document.getElementById('sort-btn').style.display = 'block';
        curVideos.forEach(video => {
            const vid = document.createElement('div');
            vid.classList.add('col-md-4', 'col-lg-3');
            vid.innerHTML = `
                <div class="video-wrapper">
                    <div class="thumb-wrapper position-relative">
                        <img src=${video?.thumbnail} alt=${video.title} class="thumb w-100">
                        ${convertTime(video?.others?.posted_date) ? `<span class="upload-time">${convertTime(video?.others?.posted_date)}</span>` : ''}
                    </div>
                    <div class="d-flex align-items-start mt-2">
                        <img src=${video?.authors[0]?.profile_picture} alt=${video.authors[0]?.profile_name} class="img-fluid rounded-circle channel-logo me-2">
                        <div class="video-info">
                            <h4 class="video-title">${video?.title}</h4>
                            <div class="d-flex">
                                <p class="channel-name me-2">${video?.authors[0]?.profile_name}</p>
                                ${video?.authors[0]?.verified ? '<img src="./assets/verified.svg" alt="" class="verified-icon img-fluid">' : ''}
                            </div>
                            <p class="veiws">${video?.others?.views} views</p>
                        </div>
                    </div>
                </div>
            `;
            videoArea.appendChild(vid);
        });
    }
    else {
        document.getElementById('sort-btn').style.display = 'none';
        const noVideo = document.createElement('div');
        noVideo.classList.add('no-video', 'text-center', 'mt-5');
        noVideo.innerHTML = `
            <img src="./assets/Icon.png" alt="No Video" class="img-fluid no-video-icon">
            <h3 class="text-center fw-bold w-75 mx-auto mt-4">Oops!! Sorry, There is no content here.</h3>

        `
        videoArea.appendChild(noVideo);
    }
}


// Category Button Decoration
const catBtndec = (catId) => {
    const btns = document.querySelectorAll('.category-btn');
    btns.forEach(btn => {
        btn.classList.remove("bg-red");
    });

    const catBtn = document.getElementById(catId);
    catBtn.classList.add('bg-red');
}

// Sort Videos By Views
const sortByViews = async () => {
    curVideos.sort((vid1, vid2) => {
        return parseInt(vid2.others.views) - parseInt(vid1.others.views);
    })
    showVideos();
}

loadCategories();


