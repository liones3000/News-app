//Parametrs

const form = document.querySelector("#form-news");

// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error, response);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}

// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = "766dfec616ec4728a0e504222d45f4ee";
  // const apiUrl = "http://newsapi.org/v2";
  const apiUrl = "https://news-api-v2.herokuapp.com";

  return {
    topHeadlines(country = "ua", category = "general", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },
    everithing(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

//  init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});

form.addEventListener("submit", submitHandler);

//Load news fn

function submitHandler(e) {
  e.preventDefault();
  let search = form.querySelector("[name=search]").value;
  if (!search) {
    let countryVal = document.querySelector("#country").value;
    let categoryVal = document.querySelector("#category").value;
    console.log(categoryVal, countryVal);
    loadNews(countryVal, categoryVal);
  } else {
    loadNewsQuery(search);
    form.querySelector("[name=search]").value = "";
  }
}

function loadNews(country, category) {
  newsService.topHeadlines(country, category, onGetResponse);
}

function loadNewsQuery(query) {
  newsService.everithing(query, onGetResponse);
}

// function on get response server
function onGetResponse(err, res) {
  renderNews(res.articles);
}

// function render news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  let fragment = "";
  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  // console.log(fragment);
  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// News item template function
function newsTemplate({ urlToImage, title, url, description }) {
  // console.log(news);
  return `
  <div class="col s12">
    <div class="card">
    <div class="card-image">
      <img src="${urlToImage || "zaglushka.jpg"}">
      <span class="card-title">${title || ""}</span>
    </div>
    <div class="card-content">
      <p>${description || ""}</p>
    </div>
    <div class="card-action">
      <a href="${url}">Read more</a>
    </div>
    </div>
  </div>
  `;
}
