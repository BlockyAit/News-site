document.addEventListener("DOMContentLoaded", perform);

let themechange = localStorage.getItem("theme") || "light";
let arti = [];
const article = document.getElementById("article");
const pop = document.getElementById("pop");
const recent = document.getElementById("recent");

function perform() {
    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            arti = data.articles;
            load();
            display(arti);
            displaypop();
            displayRecent();  
        });

    document.getElementById("datee").addEventListener("click", sortByDate);
    document.getElementById("views").addEventListener("click", sortByViews);
    document.getElementById("theme").addEventListener("click", toggleTheme);

    applyTheme();
}

function applyTheme() {
    document.body.classList.toggle("dark-mode", themechange === "dark");
    document.getElementById("navbar").classList.toggle("navbar-dark", themechange === "dark");
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    document.getElementById("navbar").classList.toggle("navbar-dark");
    themechange = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", themechange);
}

function load() {
    const save = JSON.parse(localStorage.getItem("viewCounts")) || {};
    arti.forEach(article => {
        article.views = save[article.id] || article.views || 0;
    });
}

function display(arti) {
    article.innerHTML = "";
    arti.forEach(articless => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="m-3">
                <h5><a href="#" class="article-title" data-id="${articless.id}">${articless.title}</a></h5>
                <p><small>${articless.date} - ${articless.category}</small></p>
                <p class="mx-3">${articless.content}</p>
                <p><small>Views: ${articless.views}</small></p>
                <p><small>Reading Time: ${Math.ceil(articless.wordCount / 200)} min</small></p>
            </div>
        `;
        article.appendChild(card);
    });

    document.querySelectorAll('.article-title').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const Id = parseInt(event.target.dataset.id);
            inc(Id);
        });
    });
}

function inc(Id) {
    const artic = arti.find(artic => artic.id === Id);
    if (artic) {
        artic.views += 1;
        
        const save = JSON.parse(localStorage.getItem("viewCounts")) || {};
        save[Id] = artic.views;
        localStorage.setItem("viewCounts", JSON.stringify(save));

        display(arti);
        displaypop();
        displayRecent();  
    }
}

function sortByDate() {
    arti.sort((a, b) => new Date(b.date) - new Date(a.date));
    display(arti);
}

function sortByViews() {
    arti.sort((a, b) => b.views - a.views);
    display(arti);
}


function displaypop() {
    const popo = arti.reduce((prev, current) => (prev.views > current.views) ? prev : current);
    upd(popo);
}


function upd(artic) {
    pop.innerHTML = `
        <div class="card-body">
            <img class="upd-image" src="${artic.image}">
            <h5><a href="#" class="article-link" data-id="${artic.id}">${artic.title}</a></h5>
            <p><small>${artic.date} - ${artic.category}</small></p> <!-- Added published date -->
            <p>${artic.content}</p>
            <p><small>Views: ${artic.views}</small></p>
            <p><small>Reading Time: ${Math.ceil(artic.wordCount / 200)} min</small></p>
        </div>
    `;

    pop.querySelector('.article-link').addEventListener('click', function(event) {
        event.preventDefault();
        const id = parseInt(event.target.dataset.id);
        inc(id);
    });
}

function displayRecent() {
    const recentArticle = arti.reduce((prev, current) => (new Date(prev.date) > new Date(current.date)) ? prev : current);
    recent.innerHTML = `
        <div class="card-body">
            <img class="upd-image" src="${recentArticle.image}">
            <h5><a href="#" class="article-link" data-id="${recentArticle.id}">${recentArticle.title}</a></h5>
            <p><small>${recentArticle.date} - ${recentArticle.category}</small></p> <!-- Added published date -->
            <p>${recentArticle.content}</p>
            <p><small>Views: ${recentArticle.views}</small></p>
            <p><small>Reading Time: ${Math.ceil(recentArticle.wordCount / 200)} min</small></p>
        </div>
    `;

    recent.querySelector('.article-link').addEventListener('click', function(event) {
        event.preventDefault();
        const id = parseInt(event.target.dataset.id);
        inc(id);
    });
}



