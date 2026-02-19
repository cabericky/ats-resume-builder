// --- TOGGLE VISIBILITY ---
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.toggle("hidden");
}

// --- DYNAMIC INPUTS ---
function createInputGroup(labelTxt, className, type = "text") {
  const wrapper = document.createElement("div");
  wrapper.className = "input-group";

  const label = document.createElement("label");
  label.innerText = labelTxt;
  wrapper.appendChild(label);

  const input = document.createElement(
    type === "textarea" ? "textarea" : "input",
  );
  if (type !== "textarea") input.type = type;
  input.className = className;
  input.oninput = updateResume;
  wrapper.appendChild(input);

  return wrapper;
}

// Add Work
function addWork() {
  const container = document.getElementById("work-container");
  const div = document.createElement("div");
  div.className = "dynamic-item work-item";

  div.appendChild(createInputGroup("Job Title", "w-title"));
  div.appendChild(createInputGroup("Company Name", "w-company"));
  div.appendChild(
    createInputGroup("Date (e.g., Jan 2020 - Present)", "w-date"),
  );
  div.appendChild(
    createInputGroup(
      "Description (Bullet points recommended)",
      "w-desc",
      "textarea",
    ),
  );

  const delBtn = document.createElement("button");
  delBtn.innerText = "Remove";
  delBtn.className = "btn btn-delete";
  delBtn.onclick = function () {
    container.removeChild(div);
    updateResume();
  };
  div.appendChild(delBtn);

  container.appendChild(div);
}

// Add Education
function addEducation() {
  const container = document.getElementById("edu-container");
  const div = document.createElement("div");
  div.className = "dynamic-item edu-item";

  div.appendChild(createInputGroup("Degree / Major", "e-degree"));
  div.appendChild(createInputGroup("University / School", "e-school"));
  div.appendChild(createInputGroup("Year (e.g., 2018 - 2022)", "e-year"));

  const delBtn = document.createElement("button");
  delBtn.innerText = "Remove";
  delBtn.className = "btn btn-delete";
  delBtn.onclick = function () {
    container.removeChild(div);
    updateResume();
  };
  div.appendChild(delBtn);

  container.appendChild(div);
}

// Add Cert
function addCert() {
  const container = document.getElementById("cert-container");
  const div = document.createElement("div");
  div.className = "dynamic-item cert-item";

  div.appendChild(createInputGroup("Certification Name", "c-name"));
  div.appendChild(createInputGroup("Issued By", "c-issuer"));
  div.appendChild(createInputGroup("Date", "c-date"));

  const delBtn = document.createElement("button");
  delBtn.innerText = "Remove";
  delBtn.className = "btn btn-delete";
  delBtn.onclick = function () {
    container.removeChild(div);
    updateResume();
  };
  div.appendChild(delBtn);

  container.appendChild(div);
}

// --- UPDATE PREVIEW ---
function updateResume() {
  // Static
  document.getElementById("p-name").innerText =
    document.getElementById("name").value || "YOUR NAME";
  document.getElementById("p-contact").innerText =
    document.getElementById("contact").value ||
    "email@example.com | 123-456-7890";
  document.getElementById("p-summary").innerText =
    document.getElementById("summary").value ||
    "Your summary will appear here...";
  document.getElementById("p-skills").innerText =
    document.getElementById("skills").value ||
    "Your skills will appear here...";

  // Work
  const workItems = document.querySelectorAll(".work-item");
  let workHTML = "";
  workItems.forEach((item) => {
    const title = item.querySelector(".w-title").value;
    const company = item.querySelector(".w-company").value;
    const date = item.querySelector(".w-date").value;
    const desc = item.querySelector(".w-desc").value.replace(/\n/g, "<br>");

    if (title || company) {
      workHTML += `
                <div style="margin-bottom: 12px;">
                    <div class="ats-job-header">
                        <span>${title}</span>
                        <span>${date}</span>
                    </div>
                    <div class="ats-job-sub">${company}</div>
                    <div class="ats-content">${desc}</div>
                </div>
            `;
    }
  });
  document.getElementById("p-work").innerHTML = workHTML;

  // Education
  const eduItems = document.querySelectorAll(".edu-item");
  let eduHTML = "";
  eduItems.forEach((item) => {
    const degree = item.querySelector(".e-degree").value;
    const school = item.querySelector(".e-school").value;
    const year = item.querySelector(".e-year").value;

    if (degree || school) {
      eduHTML += `
                <div style="margin-bottom: 8px;">
                    <div class="ats-job-header">
                        <span>${school}</span>
                        <span>${year}</span>
                    </div>
                    <div class="ats-content">${degree}</div>
                </div>
            `;
    }
  });
  document.getElementById("p-education").innerHTML = eduHTML;

  // Certs
  const certItems = document.querySelectorAll(".cert-item");
  let certHTML = "";
  certItems.forEach((item) => {
    const name = item.querySelector(".c-name").value;
    const issuer = item.querySelector(".c-issuer").value;
    const date = item.querySelector(".c-date").value;

    if (name) {
      certHTML += `
                <div class="ats-content" style="margin-bottom: 4px;">
                    <span class="ats-bold">${name}</span> - ${issuer} (${date})
                </div>
            `;
    }
  });
  document.getElementById("p-certs").innerHTML = certHTML;
}

// Init
window.onload = function () {
  addWork();
  addEducation();
  addCert();
  updateResume();
};

// --- PDF DOWNLOAD ---
function downloadPDF() {
  const element = document.getElementById("resume-preview");
  const opt = {
    margin: 0,
    filename: "ATS_Resume.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
}
