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
  container.setAttribute("id", "scrapbox-search-results");
  container.style.marginBottom = "40px";
  container.style.padding = "15px";
  container.style.maxWidth = "var(--rhs-width)";
  container.style.border = "1px solid #3c4043";
  container.style.borderRadius = "8px";

  // add title
  const project = document.createElement("h2");
  project.textContent = `search results in scrapbox.io/${projectName}:`;
  project.style.marginTop = "0";
  container.appendChild(project);

  if (data.length === 0) {
    // add message
    const message = document.createElement("p");
    message.textContent = "No results found.";
    container.appendChild(message);
  } else {
    // add pages
    data.forEach((page) => {
      const pageTitle = document.createElement("a");
      const pageUrl = baseUrl + page.title;
      pageTitle.textContent = page.title;
      pageTitle.setAttribute("href", pageUrl);
      pageTitle.setAttribute("target", "_blank");
      pageTitle.style.lineHeight = "1.5";
      container.appendChild(pageTitle);
      const spacer = document.createElement("span");
      spacer.textContent = " / ";
      container.appendChild(spacer);
    });
  }

  if (document.getElementById("rhs")) {
    document.getElementById("rhs").prepend(container);
  } else {
    container.setAttribute("id", "rhs");
    document.getElementById("rcnt").appendChild(container);
  }
}

function search(projects, sids) {
  for (let i = 0; i < projects.length; i++) {
    const projectName = projects[i];
    const sid = sids[i];
    const searchUrl = getSearchUrl(projectName);
    console.log("searching", searchUrl, sid);

    chrome.runtime.sendMessage(
      {
        contentScriptQuery: "post",
        endpoint: searchUrl,
        sid: sid,
      },
      (response) => {
        showResults(response, projectName);
      }
    );
  }
}

chrome.storage.local.get(["projects", "sids"], function (items) {
  search(items.projects, items.sids);
});
