const form = document.querySelector("#form-news");

//  init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});

function customHttp() {
  return {
    async get(url) {
      try {
        const response = await fetch(url)
          .then((resp) => resp.json())
          .catch((err) =>
            console.log(`Error GET from fetch from MyHttp: ${err}`)
          );
        // console.log(response);
        return response;
      } catch (err) {
        throw `Error GET from catch myHttp: ${err}`;
      }
    },
    async post(url, body) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .catch((err) =>
            console.log(`Error POST from fetch from MyHttp: ${err}`)
          );
        return response;
      } catch (err) {
        throw `Error POST from catch myHttp: ${err}`;
      }
    },
  };
}

const http = customHttp();

form.addEventListener("submit", submitHandler);

function submitHandler(e) {
  e.preventDefault();
  let search = form.querySelector("[name=search]").value;
  if (!search) {
    let countryVal = document.querySelector("#country").value;
    let categoryVal = document.querySelector("#category").value;
    loadNews(countryVal, categoryVal);
  } else {
    loadNewsQuery(search);
    form.querySelector("[name=search]").value = "";
  }
}

const newsService = (function () {
  const apiKey = "766dfec616ec4728a0e504222d45f4ee";
  const apiUrl = "https://news-api-v2.herokuapp.com";

  return {
    topHeadlines(country = "ua", category = "general") {
      return http.get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
      );
    },
    everithing(query) {
      return http.get(
        `${apiUrl}/everything?q=${query}&language=ru&apiKey=${apiKey}`
      );
    },
  };
})();

function loadNews(country, category) {
  newsService
    .topHeadlines(country, category)
    .then((res) => renderNews(res.articles))
    .catch((err) => console.log(`Error loadNews: ${err}`));
}
function loadNewsQuery(query) {
  newsService
    .everithing(query)
    .then((res) => renderNews(res.articles))
    .catch((err) => console.log(`Error loadNewsQuery: ${err}`));
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  if (newsContainer.children.length > 0) {
    newsContainer.innerHTML = "";
  }
  let fragment = "";
  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// News item template function
function newsTemplate({ urlToImage, title, url, description }) {
  console.log(urlToImage, title, url, description);
  try {
    return `
    <div class="col s12">
    <div class="card">
    <div class="card-image">
    <img src="${zaglushka(urlToImage)}">
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
  } catch (err) {
    throw `Template Error:${err}`;
  }
}

function zaglushka(urlToImage) {
  const str = "http";
  if (!urlToImage || !urlToImage.includes(str) || urlToImage.length < 10) {
    return "zaglushka.jpg";
  }
  return urlToImage;
}
