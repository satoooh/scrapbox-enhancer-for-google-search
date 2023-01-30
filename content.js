function getBaseUrl(projectName) {
  return `https://scrapbox.io/${projectName}/`;
}

function getSearchUrl(projectName) {
  const searchQuery = new URL(window.location.href).searchParams.get("q");
  return `https://scrapbox.io/api/pages/${projectName}/search/query?q=${searchQuery}`;
}

function showResults(response, projectName) {
  const baseUrl = getBaseUrl(projectName);
  const data = response.pages;

  const container = document.createElement("div");
  container.className = "scrapbox-search-results";

  // add title
  const project = document.createElement("h2");
  project.textContent = `search results in scrapbox.io/${projectName}:`;
  container.appendChild(project);

  if (!data.length) {
    const message = document.createElement("p");
    message.textContent = "No results found.";
    container.appendChild(message);
  } else {
    data.forEach((page) => {
      const pageTitle = document.createElement("a");
      pageTitle.href = baseUrl + page.title;
      pageTitle.target = "_blank";
      pageTitle.textContent = page.title;
      container.appendChild(pageTitle);
      const spacer = document.createElement("span");
      spacer.textContent = " / ";
      container.appendChild(spacer);
    });
  }

  if (document.getElementById("rhs")) {
    document.getElementById("rhs").prepend(container);
  } else {
    const rhs = document.createElement("div");
    rhs.setAttribute("id", "rhs");
    document.getElementById("rcnt").appendChild(rhs);
    document.getElementById("rhs").prepend(container);
  }
}

function search(projects, sids) {
  if (!projects) return;
  for (let i = 0; i < projects.length; i++) {
    const searchUrl = getSearchUrl(projects[i]);

    chrome.runtime.sendMessage(
      {
        contentScriptQuery: "post",
        endpoint: searchUrl,
        sid: sids[i],
      },
      (response) => {
        showResults(response, projects[i]);
      }
    );
  }
}

chrome.storage.local.get(["projects", "sids"], function (items) {
  search(items.projects, items.sids);
});
