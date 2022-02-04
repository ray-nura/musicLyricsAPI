import { firstPageData } from "./firstPageData.js";
import { musicIMG } from "./musicIMG.js";

const firstPageDataArray = firstPageData();
const musicIMGArray = musicIMG();
const apiURL = "https://api.lyrics.ovh";
const searchVal = document.querySelector("#searchInput")
const firstPageSection = document.querySelector(".first-page");
const firstPageH1 = document.querySelector("#first-page");
const resultSection = document.querySelector(".result");
const btnPrev = document.querySelector("#prevBtn");
const btnNext = document.querySelector("#nextBtn");
const home = document.querySelector("#home");
const btnNextPrevSection = document.querySelector(".btn");
const showLyricsSection = document.querySelector("#showLyrics")
const favoriteSongs = document.querySelector(".favorite-songs")
const favoriteSongsBtn = document.querySelector("#myList")
const favoritelyricsBtn = document.querySelector("#getlyrics")

const listOfLyrics = [];


// ----------------- first page function-----------------
function firstStart(impData) {
    const firstPageCard = document.createElement("div");
    firstPageCard.className = "flex";
    firstPageCard.innerHTML = `${impData.map(el => `
    <div class="card" style="background-image:url('${el.imgURL}');">
    <h3 class="artistName">${el.name}</h3>
    </div> `).join('')}`
    firstPageSection.appendChild(firstPageCard)
}
// ----------call start function !!! -----------------
firstStart(firstPageDataArray);
// firstStart(musicIMGArray);
home.addEventListener("click", firstStart)
// --------- get search value ----------------------
document.querySelector("#searchBtn").addEventListener("click", e => {
    // e.preventDefault();
    beginSearch(searchVal.value);
})
searchVal.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        beginSearch(searchVal.value);
    }
})
// get search value from img category -----------------
firstPageSection.addEventListener("click", e => {
    const clickedElement = e.target.innerText;
    beginSearch(clickedElement);
})
// Search function/  greate searched Array from Data -----------------
async function beginSearch(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();
    const data1 = data.data.slice(0, 4);
    const lengthData = data.data.length;
    console.log(data)
    let num = 0;
    displayData(data1, num, lengthData, searchValue);
    // display Next button
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
//----------------- Display Searched Array-----------------
function displayData(data, num, lengthData, searchValue) {
    firstPageSection.style.display = "none";
    firstPageH1.style.display = "none";
    resultSection.innerHTML = ' ';
    showLyricsSection.innerHTML = ' ';
    const resultCard = document.createElement("div");
    resultCard.innerHTML = ` 
    <h1>All Songs with the word: "${searchValue}"</h1>
    <h1>${num} - ${num + 4} out of ${lengthData} songs</h1><div class="container">
    ${data.map(el => `
    <div class="slide" style="background-image:url('${el.artist.picture_big}');">
        <div class="info">
            <h4 class="artistName">${el.artist.name}</h4>
            <h3 class="titleName">${el.title}</h3>
            <h5 class="titleName">Albom: ${el.album.title}</h5>
        </div>
        <div class="middle">
            <div class="bar bar3"></div> <div class="bar bar2"></div>
            <div class="bar bar5"></div><div class="bar bar1"></div>
            <div class="bar bar4"></div><div class="bar bar8"></div>
            <div class="bar bar7"></div><div class="bar bar6"></div>
            <div class="bar bar1"></div><div class="bar bar3"></div>
            <div class="bar bar5"></div><div class="bar bar2"></div>
            <div class="bar bar8"></div><div class="bar bar4"></div>
            <div class="bar bar7"></div><div class="bar bar6"></div>
        </div>
        <div class="playInfo">
            <audio controls>
                <source src="${el.preview}" type="audio/mpeg">Your browser does not support the audio element.
            </audio>
            <button class="getlyricsBtn" data-img="${el.artist.picture_big}" data-mp3="${el.preview}" data-artist="${el.artist.name}" data-songtitle="${el.title}">Get lyrics</button>
        </div>
   </div>`).join('')}</div>`;
    console.log(resultCard);
    resultSection.appendChild(resultCard);
    // adding ACTIVE class to slide
    const slides = document.querySelectorAll('.slide');
    slides[0].classList.add('active');
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
    // -----------------click btn "get Lyrics" -----------------
    const getlyrics = document.querySelectorAll(".getlyricsBtn");
    for (const btn of getlyrics) {
        btn.addEventListener("click", e => {
            const clickedElement = e.target;
            const artist = clickedElement.getAttribute('data-artist');
            const songTitle = clickedElement.getAttribute('data-songtitle');
            const songMp3 = clickedElement.getAttribute('data-mp3');
            const songImg = clickedElement.getAttribute('data-img');
            getLyrics(artist, songTitle, songMp3, songImg)
        })
    }
    // get Lyrics from Data and display-----------------
    async function getLyrics(artist, songTitle, songMp3, songImg) {

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
            <span class="closeBtn">&times;</span><p>${lyrics}</p>`
            showLyricsSection.appendChild(lyricsS);
            const myMuz = {
                artist: artist,
                muzTitle: songTitle,
                mp3: songMp3,
                img: songImg,
                lyricsm: lyrics,
            }
            listOfLyrics.push(myMuz); // list of favorite lyrics
            console.log(listOfLyrics);
        } else {
            showLyricsSection.innerHTML = "";
            lyricsS.innerHTML = `
            <span class="closeBtn">&times;</span>
            <h1 style="color:red;" >Lyrics Not Found</h1>`;
            showLyricsSection.appendChild(lyricsS);
        }
        document.querySelector(".closeBtn").addEventListener("click", () => {
            showLyricsSection.style.display = "none";
        })
    }


}

function myFavoriteList(e) {
    e.preventDefault();
    firstPageH1.style.display = "none";
    btnNextPrevSection.style.display = "none";
    resultSection.innerHTML = ' ';
    let n = 0;
    for (let el of listOfLyrics) { el.id = n++ }
    console.log(listOfLyrics)
    const favoriteSongsList = document.createElement("div");
    favoriteSongsList.innerHTML = ` 
    ${listOfLyrics.map(el => `
    <div class="clearfix">
          <img  
            src="${el.img}" id="getlyrics11"  width="120px" alt="${el.id}">
            <p id="${el.id}" ><i class="fas fa-file-alt"></i>showLyrics</p>
            <span id="${el.id}"> ${el.artist} -- <strong> ${el.muzTitle} </strong> </span>
          <audio controls width="200px">
            <source src="${el.mp3}"
              type="audio/mpeg">Your browser does not support the audio element.
          </audio>
        </div>
        <hr>
    `).join('')}`;
    favoriteSongs.appendChild(favoriteSongsList);
}

function favoritelyricsShow(e) {
    // e.preventDefault();
    console.log('clickkkk')
    const item = e.target.id
    console.log(e.target)
    console.log(item)
    const searchLyrics = listOfLyrics.filter(el => (el.id == item))
    showLyricsSection.innerHTML = "";
    showLyricsSection.style.display = "block";
    const lyricsS = document.createElement("div");
    lyricsS.className = "showLyrics";
    lyricsS.innerHTML = `
        <span class="closeBtn">&times;</span><p>${searchLyrics.lyricsm}</p>`
    showLyricsSection.appendChild(lyricsS);
    document.querySelector(".closeBtn").addEventListener("click", () => {
        showLyricsSection.style.display = "none";
    })
}

const xxx = document.querySelector("#getlyrics11")
if (xxx){xxx.addEventListener("clicked", favoritelyricsShow)}


favoriteSongsBtn.addEventListener("click", myFavoriteList)
// favoriteSongs.addEventListener("click", e => {
//     if(e.target.innerText === "showLyrics") favoritelyricsShow
// })
