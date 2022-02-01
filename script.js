import { firstPageData } from "./firstPageData.js";

const firstPageDataArray = firstPageData();
const apiURL = "https://api.lyrics.ovh";
const serchSection = document.querySelector(".search")
const firstPageSection = document.querySelector(".first-page");
const firstPageH1 = document.querySelector("#first-page");
const resultSection = document.querySelector(".result");
const resultH1 = document.querySelector("#result");
const btnPrev = document.querySelector("#prevBtn");
const btnNext = document.querySelector("#nextBtn");
const btnNextPrevSection = document.querySelector(".btn");
const oneSongSection = document.querySelector(".one-song")
const showLyricsSection = document.querySelector("#showLyrics")
// need to wrap in function
const firstPageCard = document.createElement("div");
firstPageCard.className = "flex";
firstPageCard.innerHTML = `${firstPageDataArray.map(el => `
        <div class="card" style="background-image:url('${el.imgURL}');">
            <h3 class="artistName">${el.name}</h3>
            </div>
        `).join('')}`
firstPageSection.appendChild(firstPageCard)

// get search value
document.querySelector("#searchBtn").addEventListener("click", e => {
    e.preventDefault();
    const searchVal = document.querySelector("#searchInput").value;
    console.log(searchVal)
    beginSearch(searchVal);
})
// get search value from img category
firstPageSection.addEventListener("click", e => {
    const clickedElement = e.target.innerText;
    console.log(clickedElement)
    beginSearch(clickedElement);
})
// Search function/  greate searched Array from Data
async function beginSearch(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();
    const data1 = data.data.slice(0, 4)
    const lengthData = data.data.length
    console.log(data)
    let num = 0;
    displayData(data1, num, lengthData, searchValue);
    if (data.data.length > 5) {
        btnNextPrevSection.style.display = "block";
        btnPrev.style.display = 'none';
        btnNext.style.display = 'inline-block';
    }
    btnNext.addEventListener('click', () => {
        num = num + 4;
        btnPrev.style.display = 'inline-block';
        const data1 = data.data.slice(num, num + 4)
        displayData(data1, num, lengthData, searchValue);
        if (data.data.length <= num + 4) {
            btnNext.style.display = 'none';
        } else {
            btnNext.style.display = 'inline-block';
        }
    })
    btnPrev.addEventListener('click', () => {
        num = num - 4;
        const data1 = data.data.slice(num, num + 4)
        btnNext.style.display = 'inline-block';
        displayData(data1, num, lengthData, searchValue);
        if (num === 0) {
            btnPrev.style.display = 'none';
        }
    })

}
// display Next button

// Display Searched Array  
function displayData(data, num, lengthData, searchValue) {
    firstPageSection.style.display = "none";
    firstPageH1.style.display = "none";
    // resultH1.style.display = "block";
    // btnNextPrevSection.style.display = "block";
    resultSection.innerHTML = ' ';
    showLyricsSection.innerHTML = ' ';
    const resultCard = document.createElement("div");
    resultCard.innerHTML = ` 
    <h1>All Songs with the word: "${searchValue}"</h1>
    <h1>${num} - ${num+4} out of ${lengthData} songs</h1><div class="container">
    ${data.map(el => `
    <div class="slide" style="background-image:url('${el.artist.picture_big}');">
        <div class="info">
            <h3 class="artistName">${el.artist.name}</h3>
            <h3 class="titleName">${el.title}</h3>
            <h3 class="titleName">Albom: ${el.album.title}</h3>
        </div>
        <div class="middle">
            <div class="bar bar3"></div>
            <div class="bar bar1"></div>
            <div class="bar bar2"></div>
            <div class="bar bar5"></div>
            <div class="bar bar4"></div>
            <div class="bar bar7"></div>
            <div class="bar bar8"></div>
            <div class="bar bar6"></div>
        </div>
        <div class="playInfo">
            <audio controls>
                <source src="${el.preview}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <button class="getlyricsBtn" data-artist="${el.artist.name}" data-songtitle="${el.title}">Get lyrics</button>
        </div>
   </div>`).join('')}</div>`;
    console.log(resultCard);
    resultSection.appendChild(resultCard);
    // adding ACTIVE class to slide
    const slides = document.querySelectorAll('.slide');
    slides[1].classList.add('active');
    for (const slide of slides) {
        slide.addEventListener('click', () => {
            clearActiveClasses()
            showLyricsSection.innerHTML = "";
            slide.classList.add('active')
        })
    }
    function clearActiveClasses() {
        slides.forEach((slide) => {
            slide.classList.remove('active');
        })
    }

    // click btn "get Lyrics"
    const getlyrics = document.querySelectorAll(".getlyricsBtn");
    for (const btn of getlyrics) {
        btn.addEventListener("click", e => {
            const clickedElement = e.target;
            const artist = clickedElement.getAttribute('data-artist');
            const songTitle = clickedElement.getAttribute('data-songtitle');
            getLyrics(artist, songTitle)
        })
    }
    // get Lyrics from Data and display
    async function getLyrics(artist, songTitle) {
        showLyricsSection.innerHTML = "";
        showLyricsSection.style.display = "block";
        const lyricsS = document.createElement("div");
        lyricsS.className = "showLyrics";
        const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            const lyrics1 = data.lyrics.replace(/(\n\n\n\n)/g, '<br><br>');
            const lyrics = lyrics1.replace(/(\r\n|\r|\n)/g, '</p> <p>');
            lyricsS.innerHTML = `
            <span class="closeBtn">&times;</span><p>
            ${lyrics}</p>`
            showLyricsSection.appendChild(lyricsS);
        } else {
            showLyricsSection.innerHTML = "";
            lyricsS.innerHTML = `
            <span class="closeBtn">&times;</span>
            <h1 style="color:red;" >Lyrics Not Found</h1>`;
            showLyricsSection.appendChild(lyricsS);
        }
        document.querySelector(".closeBtn").addEventListener("click", ()=>{
        showLyricsSection.style.display = "none";

        })
    }
}


