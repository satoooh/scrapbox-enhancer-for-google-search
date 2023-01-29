function saveOption() {
  const formCount = document.querySelectorAll("input").length / 2;
  let projects = [];
  let sids = [];
  for (let i = 0; i < formCount; i++) {
    // save if project is not empty
    let project = document.querySelector(`#project_${i + 1}`).value;
    if (project !== "") {
      projects.push(project);
      sids.push(document.querySelector(`#sid_${i + 1}`).value);
    }
  }
  chrome.storage.local.set({ projects: projects }, function () {});
  chrome.storage.local.set({ sids: sids }, function () {});
  console.log("saved", projects, sids);
  alert("saved", projects, sids);
}

function loadOption() {
  chrome.storage.local.get(["projects", "sids"], function (items) {
    for (let i = 0; i < items.projects.length - 1; i++) {
      addForm();
    }
    for (let i = 0; i < items.projects.length; i++) {
      document.querySelector(`#project_${i + 1}`).value = items.projects[i];
      document.querySelector(`#sid_${i + 1}`).value = items.sids[i] || "";
      console.log("loaded", items.projects[i], items.sids[i]);
    }
  });
}

function addForm() {
  const formCount = document.querySelectorAll("input").length / 2;

  const newForm = document.createElement("div");
  newForm.setAttribute("class", "form-row");
  const newLabel = document.createElement("label");
  newLabel.textContent = `Project ${formCount + 1}:`;
  newForm.appendChild(newLabel);

  const newFormProject = document.createElement("div");
  newFormProject.setAttribute("class", "col");
  const newFormProjectInput = document.createElement("input");
  newFormProjectInput.type = "text";
  newFormProjectInput.setAttribute("id", `project_${formCount + 1}`);
  newFormProjectInput.setAttribute("class", "form-control");
  newFormProject.appendChild(newFormProjectInput);
  newForm.appendChild(newFormProject);

  const newFormSid = document.createElement("div");
  newFormSid.setAttribute("class", "col");
  const newFormSidInput = document.createElement("input");
  newFormSidInput.type = "text";
  newFormSidInput.setAttribute("id", `sid_${formCount + 1}`);
  newFormSidInput.setAttribute("class", "form-control");
  newFormSid.appendChild(newFormSidInput);
  newForm.appendChild(newFormSid);

  document.querySelector("form").appendChild(newForm);
}

document.querySelector("#add").addEventListener("click", addForm);
document.querySelector("#save").addEventListener("click", saveOption);
document.addEventListener("DOMContentLoaded", loadOption);
