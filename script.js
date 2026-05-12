// --- TOGGLE VISIBILITY ---
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.toggle("hidden");
  schedulePreviewScaleUpdate();
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

function escapeHTML(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPreviewText(value) {
  return escapeHTML(value).replace(/\n/g, "<br>");
}

function formatResumeFilename(name) {
  const formattedName = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_");

  return `${formattedName || "ATS"}_Resume.pdf`;
}

let previewScaleRaf = 0;

function schedulePreviewScaleUpdate() {
  if (previewScaleRaf) return;
  previewScaleRaf = window.requestAnimationFrame(() => {
    previewScaleRaf = 0;
    updatePreviewScale();
  });
}

function updatePreviewScale() {
  const rootStyle = document.documentElement.style;
  const previewContainer = document.querySelector(".preview-container");
  const resumePreview = document.getElementById("resume-preview");

  if (!previewContainer || !resumePreview) return;

  if (document.body.classList.contains("pdf-export")) {
    rootStyle.setProperty("--preview-scale", "1");
    rootStyle.setProperty("--preview-frame-width", "210mm");
    rootStyle.setProperty("--preview-frame-height", "297mm");
    return;
  }

  const a4Width = 793.7;
  const a4Height = 1122.5;

  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  const isPreviewOpen = document.body.classList.contains(
    "mobile-preview-active",
  );

  if (isSmallScreen && !isPreviewOpen) {
    rootStyle.setProperty("--preview-scale", "1");
    rootStyle.setProperty("--preview-frame-width", `${a4Width}px`);
    rootStyle.setProperty("--preview-frame-height", `${a4Height}px`);
    return;
  }

  const containerStyles = window.getComputedStyle(previewContainer);
  const paddingX =
    parseFloat(containerStyles.paddingLeft) +
    parseFloat(containerStyles.paddingRight);
  const paddingY =
    parseFloat(containerStyles.paddingTop) +
    parseFloat(containerStyles.paddingBottom);

  const availableWidth = Math.max(previewContainer.clientWidth - paddingX, 0);

  let scale = 1;

  if (isSmallScreen && isPreviewOpen) {
    const previewActions = Array.from(
      previewContainer.querySelectorAll(".btn-back-mobile, .btn-download"),
    ).filter((el) => el.offsetParent !== null);

    const actionsBottom = previewActions.reduce((bottom, button) => {
      return Math.max(bottom, button.offsetTop + button.offsetHeight);
    }, 0);

    const actionGap = 12;
    const availableHeight = Math.max(
      previewContainer.clientHeight - paddingY - actionsBottom - actionGap,
      0,
    );

    scale = Math.min(availableWidth / a4Width, availableHeight / a4Height, 1);
  } else {
    scale = Math.min(availableWidth / a4Width, 1);
  }

  const boundedScale = Math.max(scale, 0.3);

  rootStyle.setProperty("--preview-scale", boundedScale.toString());
  rootStyle.setProperty("--preview-frame-width", `${a4Width * boundedScale}px`);

  if (isSmallScreen && isPreviewOpen) {
    rootStyle.setProperty(
      "--preview-frame-height",
      `${a4Height * boundedScale}px`,
    );
    return;
  }

  const contentHeight = Math.max(resumePreview.scrollHeight, a4Height);
  rootStyle.setProperty(
    "--preview-frame-height",
    `${contentHeight * boundedScale}px`,
  );
}

window.addEventListener("resize", updatePreviewScale);
window.addEventListener("orientationchange", updatePreviewScale);

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

// Add Custom Section
function addCustomSection() {
  const container = document.getElementById("custom-section-container");
  const div = document.createElement("div");
  div.className = "dynamic-item custom-section-item";

  div.appendChild(createInputGroup("Section Title", "cs-title"));
  div.appendChild(createInputGroup("Details", "cs-desc", "textarea"));

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
    const title = escapeHTML(item.querySelector(".w-title").value);
    const company = escapeHTML(item.querySelector(".w-company").value);
    const date = escapeHTML(item.querySelector(".w-date").value);
    const desc = formatPreviewText(item.querySelector(".w-desc").value);

    if (title || company) {
      workHTML += `
                <div class="ats-entry">
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
    const degree = escapeHTML(item.querySelector(".e-degree").value);
    const school = escapeHTML(item.querySelector(".e-school").value);
    const year = escapeHTML(item.querySelector(".e-year").value);

    if (degree || school) {
      eduHTML += `
                <div class="ats-entry ats-entry-compact">
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
    const name = escapeHTML(item.querySelector(".c-name").value);
    const issuer = escapeHTML(item.querySelector(".c-issuer").value);
    const date = escapeHTML(item.querySelector(".c-date").value);

    if (name) {
      certHTML += `
                <div class="ats-content" style="margin-bottom: 4px;">
                    <span class="ats-bold">${name}</span> - ${issuer} (${date})
                </div>
            `;
    }
  });
  document.getElementById("p-certs").innerHTML = certHTML;

  // Custom Sections
  const customSectionItems = document.querySelectorAll(".custom-section-item");
  let customSectionsHTML = "";
  customSectionItems.forEach((item) => {
    const title = escapeHTML(item.querySelector(".cs-title").value);
    const desc = formatPreviewText(item.querySelector(".cs-desc").value);

    if (title || desc) {
      customSectionsHTML += `
                <div class="ats-custom-section">
                    <div class="ats-section-title">${title || "Additional Section"}</div>
                    <div class="ats-content">${desc}</div>
                </div>
            `;
    }
  });
  document.getElementById("p-custom-sections").innerHTML = customSectionsHTML;

  schedulePreviewScaleUpdate();
}

// Init
window.onload = function () {
  addWork();
  addEducation();
  addCert();
  updateResume();
  updatePreviewScale();
};

// --- MOBILE PREVIEW TOGGLE ---
function toggleMobilePreview() {
  document.body.classList.toggle("mobile-preview-active");
  updatePreviewScale();
}

// --- PDF DOWNLOAD ---
function downloadPDF() {
  const element = document.getElementById("resume-preview");
  const fullName = document.getElementById("name").value;

  const originalInlineStyles = {
    height: element.style.height,
    minHeight: element.style.minHeight,
    overflow: element.style.overflow,
  };

  const cleanupExport = function () {
    element.style.height = originalInlineStyles.height;
    element.style.minHeight = originalInlineStyles.minHeight;
    element.style.overflow = originalInlineStyles.overflow;
    document.body.classList.remove("pdf-export");
    updatePreviewScale();
  };

  document.body.classList.add("pdf-export");

  const pxPerMm = 96 / 25.4;
  const a4HeightPx = 297 * pxPerMm;
  const tolerancePx = 2;
  const previewHeightPx = element.getBoundingClientRect().height;

  element.style.minHeight = "0";

  if (previewHeightPx <= a4HeightPx + tolerancePx) {
    element.style.height = "296.8mm";
    element.style.overflow = "hidden";
  } else {
    element.style.height = "auto";
    element.style.overflow = "visible";
  }

  const opt = {
    margin: 0,
    filename: formatResumeFilename(fullName),
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  const pdfWorker = html2pdf().set(opt).from(element).save();

  if (pdfWorker && typeof pdfWorker.then === "function") {
    pdfWorker.then(cleanupExport, cleanupExport);
  } else {
    setTimeout(cleanupExport, 1000);
  }
}
