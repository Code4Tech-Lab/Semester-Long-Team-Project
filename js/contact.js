console.log("contact.js loaded");
alert("contact.js loaded");
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const birthday = document.getElementById("birthday");
  const course = document.getElementById("course");
  const preferenceEmail = document.getElementById("preferenceEmail");
  const preferencePhone = document.getElementById("preferencePhone");
  const uploadFiles = document.getElementById("uploadFiles");
  const issueDescription = document.getElementById("issueDescription");
  const fillSampleBtn = document.getElementById("fillSampleBtn");
  const messageBox = document.getElementById("messageBox");


  loadSavedFormData();
  updateCharacterCount();

  if (fillSampleBtn) {
    fillSampleBtn.addEventListener("click", fillSampleData);
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
  });

  fullName.addEventListener("input", function () {
    capitalizeName();
    saveFormData();
    clearMessage();
  });

  email.addEventListener("input", function () {
    saveFormData();
    clearMessage();
  });

  phone.addEventListener("input", function () {
    formatPhoneNumber();
    saveFormData();
    clearMessage();
  });

  address.addEventListener("input", function () {
    saveFormData();
    clearMessage();
  });



  birthday.addEventListener("change", function () {
    saveFormData();
    clearMessage();
  });

  course.addEventListener("change", function () {
    saveFormData();
    clearMessage();
  });

  preferenceEmail.addEventListener("change", saveFormData);
  preferencePhone.addEventListener("change", saveFormData);

  issueDescription.addEventListener("input", function () {
    updateCharacterCount();
    saveFormData();
    clearMessage();
  });

  uploadFiles.addEventListener("change", showSelectedFiles);

  function fillSampleData() {
    fullName.value = "John Doe";
    email.value = "john@example.com";
    phone.value = "(716) 555-1234";
    address.value = "123 Main Street, Buffalo, NY";
    birthday.value = "2000-01-15";

    if (course.options.length > 1) {
      course.selectedIndex = 1;
    }

    preferenceEmail.checked = true;
    preferencePhone.checked = false;

    issueDescription.value =
      "I am having trouble accessing my account from the mobile version of the website.";

    updateCharacterCount();
    saveFormData();
    showMessage("Sample data filled successfully.", "success");
  }

  function validateForm() {
    let errors = [];

    if (fullName.value.trim() === "") {
      errors.push("Full name is required.");
    }

    if (email.value.trim() === "") {
      errors.push("Email is required.");
    } else if (!isValidEmail(email.value.trim())) {
      errors.push("Please enter a valid email address.");
    }

    if (phone.value.trim() === "") {
      errors.push("Phone number is required.");
    } else if (!isValidPhone(phone.value.trim())) {
      errors.push("Please enter a valid phone number.");
    }

    if (address.value.trim() === "") {
      errors.push("Address is required.");
    }

    if (birthday.value === "") {
      errors.push("Birthday is required.");
    }

    if (course.value === "" || course.selectedIndex === 0) {
      errors.push("Please choose a course.");
    }

    if (!preferenceEmail.checked && !preferencePhone.checked) {
      errors.push("Please select at least one contact preference.");
    }

    if (issueDescription.value.trim() === "") {
      errors.push("Issue description is required.");
    } else if (issueDescription.value.trim().length < 10) {
      errors.push("Issue description must be at least 10 characters long.");
    }

    if (errors.length > 0) {
      let errorMessage = "";
      for (let i = 0; i < errors.length; i++) {
        errorMessage += (i + 1) + ". " + errors[i] + "<br>";
      }
      showMessage(errorMessage, "error");
    } else {
      const submittedData = getFormData();

      let allSubmissions = JSON.parse(localStorage.getItem("contactFormSubmissions")) || [];
      allSubmissions.push(submittedData);
      localStorage.setItem("contactFormSubmissions", JSON.stringify(allSubmissions));

      showMessage("Form submitted successfully and saved in localStorage.", "success");

      contactForm.reset();
      localStorage.removeItem("contactFormDraft");
      updateCharacterCount();
      clearFileInfo();

      console.log("Saved submission:", submittedData);
      console.log("All submissions:", allSubmissions);
    }
  }

  function saveFormData() {
    const draftData = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      address: address.value.trim(),
      birthday: birthday.value,
      course: course.value,
      preferenceEmail: preferenceEmail.checked,
      preferencePhone: preferencePhone.checked,
      issueDescription: issueDescription.value.trim()
    };

    localStorage.setItem("contactFormDraft", JSON.stringify(draftData));
  }

  function loadSavedFormData() {
    const savedDraft = JSON.parse(localStorage.getItem("contactFormDraft"));

    if (!savedDraft) {
      return;
    }

    fullName.value = savedDraft.fullName || "";
    email.value = savedDraft.email || "";
    phone.value = savedDraft.phone || "";
    address.value = savedDraft.address || "";
    birthday.value = savedDraft.birthday || "";
    course.value = savedDraft.course || "";
    preferenceEmail.checked = savedDraft.preferenceEmail || false;
    preferencePhone.checked = savedDraft.preferencePhone || false;
    issueDescription.value = savedDraft.issueDescription || "";
  }

  function getFormData() {
    const selectedPreferences = [];

    if (preferenceEmail.checked) {
      selectedPreferences.push("Email");
    }

    if (preferencePhone.checked) {
      selectedPreferences.push("Phone");
    }

    return {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      address: address.value.trim(),
      birthday: birthday.value,
      course: course.value,
      preferences: selectedPreferences,
      issueDescription: issueDescription.value.trim(),
      submittedAt: new Date().toLocaleString()
    };
  }

  function isValidEmail(emailValue) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(emailValue);
  }

  function isValidPhone(phoneValue) {
    const digitsOnly = phoneValue.replace(/\D/g, "");
    return digitsOnly.length === 10;
  }

  function formatPhoneNumber() {
    let digits = phone.value.replace(/\D/g, "");

    if (digits.length > 10) {
      digits = digits.substring(0, 10);
    }

    if (digits.length === 0) {
      phone.value = "";
    } else if (digits.length <= 3) {
      phone.value = "(" + digits;
    } else if (digits.length <= 6) {
      phone.value = "(" + digits.substring(0, 3) + ") " + digits.substring(3);
    } else {
      phone.value =
        "(" +
        digits.substring(0, 3) +
        ") " +
        digits.substring(3, 6) +
        "-" +
        digits.substring(6);
    }
  }

  function capitalizeName() {
    let words = fullName.value.toLowerCase().split(" ");
    let formattedName = [];

    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 0) {
        formattedName.push(
          words[i].charAt(0).toUpperCase() + words[i].slice(1)
        );
      }
    }

    fullName.value = formattedName.join(" ");
  }

  function updateCharacterCount() { }

  function showSelectedFiles() {
    let fileInfo = document.getElementById("fileInfo");

    if (!fileInfo) {
      fileInfo = document.createElement("small");
      fileInfo.id = "fileInfo";
      fileInfo.style.display = "block";
      fileInfo.style.marginTop = "5px";
      fileInfo.style.color = "#cbd5e1";
      uploadFiles.parentNode.appendChild(fileInfo);
    }

    if (uploadFiles.files.length === 0) {
      fileInfo.textContent = "No files selected.";
      return;
    }

    let fileNames = [];
    for (let i = 0; i < uploadFiles.files.length; i++) {
      fileNames.push(uploadFiles.files[i].name);
    }

    fileInfo.textContent = "Selected files: " + fileNames.join(", ");
  }

  function clearFileInfo() {
    const fileInfo = document.getElementById("fileInfo");
    if (fileInfo) {
      fileInfo.textContent = "";
    }
  }

  function showMessage(message, type) {
    if (!messageBox) {
      return;
    }

    messageBox.innerHTML = message;
    messageBox.style.display = "block";
    messageBox.style.marginTop = "15px";
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "8px";

    if (type === "success") {
      messageBox.style.backgroundColor = "#166534";
      messageBox.style.color = "#ffffff";
    } else {
      messageBox.style.backgroundColor = "#991b1b";
      messageBox.style.color = "#ffffff";
    }
  }

  function clearMessage() {
    if (messageBox) {
      messageBox.innerHTML = "";
      messageBox.style.display = "none";
    }
  }
});