window.addEventListener("DOMContentLoaded", function() {
    const notesContainer = document.getElementById("notes-container");
    const noteForm = document.getElementById("note-form");
    const noteTitleInput = document.getElementById("note-title-input");
    const noteTextSvInput = document.getElementById("note-text-sv-input");
    const noteTextFiInput = document.getElementById("note-text-fi-input");
    const languageForm = document.getElementById("language-form");
    const languageSelect = document.getElementById("language-select");
  
    noteForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const title = noteTitleInput.value.trim();
      const textSv = noteTextSvInput.value.trim();
      const textFi = noteTextFiInput.value.trim();
  
      if (title === "" || textSv === "" || textFi === "") {
        alert("Var vänlig fyll i både titel och anteckningstext för båda språken.");
        return;
      }
  
      const note = createNoteElement(title, textSv, textFi);
      notesContainer.appendChild(note);
  
      noteTitleInput.value = "";
      noteTextSvInput.value = "";
      noteTextFiInput.value = "";
    });
  
    languageForm.addEventListener("change", function() {
      const selectedLanguage = languageSelect.value;
      localStorage.setItem("language", selectedLanguage);
      updateNotesDisplay();
    });
  
    function createNoteElement(title, textSv, textFi) {
      const note = document.createElement("div");
      note.classList.add("note");
  
      const titleElement = document.createElement("div");
      titleElement.classList.add("title");
      titleElement.textContent = title;
  
      const dateElement = document.createElement("div");
      dateElement.classList.add("date");
      const timestamp = getCurrentTimestamp();
      dateElement.textContent = "Skapad: " + timestamp;
  
      const textElement = document.createElement("div");
      textElement.classList.add("text");
      textElement.textContent = getNoteText();
  
      const actionsElement = document.createElement("div");
      actionsElement.classList.add("actions");
      const editButton = document.createElement("button");
      editButton.textContent = "Redigera";
      editButton.addEventListener("click", function() {
        editNoteText(textElement, getNoteText());
      });
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Radera";
      deleteButton.addEventListener("click", function() {
        deleteNoteElement(note);
      });
      actionsElement.appendChild(editButton);
      actionsElement.appendChild(deleteButton);
  
      note.appendChild(titleElement);
      note.appendChild(dateElement);
      note.appendChild(textElement);
      note.appendChild(actionsElement);
  
      return note;
  
      function getNoteText() {
        const selectedLanguage = localStorage.getItem("language");
        return selectedLanguage === "sv" ? textSv : textFi;
      }
    }
  
    function editNoteText(textElement, currentText) {
      const newText = prompt("Redigera anteckningstext:", currentText);
      if (newText !== null) {
        textElement.textContent = newText.trim();
      }
    }
  
    function deleteNoteElement(note) {
      if (confirm("Är du säker på att du vill radera denna anteckning?")) {
        note.parentNode.removeChild(note);
      }
    }
  
    function getCurrentTimestamp() {
      const now = new Date();
      const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
      return now.toLocaleString(undefined, options);
    }
  
    function updateNotesDisplay() {
      const selectedLanguage = localStorage.getItem("language");
      const notes = document.querySelectorAll(".note");
      notes.forEach(function(note) {
        const textElement = note.querySelector(".text");
        textElement.textContent = getNoteText(note);
      });
  
      function getNoteText(note) {
        const textElement = note.querySelector(".text");
        const textSv = textElement.dataset.textSv;
        const textFi = textElement.dataset.textFi;
        return selectedLanguage === "sv" ? textSv : textFi;
      }
    }
  
    // Återställ valt språk från localstorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      languageSelect.value = savedLanguage;
    }
  
    // Återställ anteckningar från localstorage
    restoreNotesFromStorage();
  
    function restoreNotesFromStorage() {
      const savedNotes = localStorage.getItem("notes");
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        notes.forEach(function(note) {
          const noteElement = createNoteElement(note.title, note.textSv, note.textFi);
          notesContainer.appendChild(noteElement);
        });
      }
    }
  
    // Spara anteckningar till localstorage när sidan stängs
    window.addEventListener("beforeunload", function() {
      const notes = Array.from(notesContainer.children).map(function(noteElement) {
        return {
          title: noteElement.querySelector(".title").textContent,
          textSv: noteElement.querySelector(".text").dataset.textSv,
          textFi: noteElement.querySelector(".text").dataset.textFi
        };
      });
      localStorage.setItem("notes", JSON.stringify(notes));
    });
  });
  