const apiUrl = "https://projectvrzn.online/api/naoe_back_end.php";
  
document.addEventListener("DOMContentLoaded", () => {
  readAlbums();

  let albumForm = document.querySelector("#album_form");

  if (albumForm) {
    albumForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateForm()) {
        if (document.querySelector("#album_id").value) {
          performUpdate();
        } else {
          createAlbum();
        }
      }
    });

    document
      .querySelector("#album_name")
      .addEventListener("input", validateForm);
    document
      .querySelector("#artist")
      .addEventListener("input", validateForm);
    document
      .querySelector("#num_tracks")
      .addEventListener("input", validateForm);
    document
      .querySelector("#language")
      .addEventListener("change", validateForm);
    document.querySelector("#genre")
      .addEventListener("change", validateForm);
  } else {
    console.error("Error: Album form not found.");
  }
});

function validateForm() {
  const getValue = (id) => document.querySelector(`#${id}`).value;
  const getDefault = (id) => document.querySelector(`#${id}`).defaultValue;

  const isChanged = [
    "album_name",
    "artist",
    "num_tracks",
    "language",
    "genre",
  ].some((id) => getValue(id) !== getDefault(id));

  const isValid =
    ["album_name", "artist", "num_tracks", "language", "genre"].every(
      (id) => getValue(id).trim()
    ) && isChanged;

  document.querySelector("#album_form button").disabled = !isValid;
  return isValid;
}

function createAlbum() {
  let albumData = {
    album_name: document.querySelector("#album_name").value,
    artist: document.querySelector("#artist").value,
    language: document.querySelector("#language").value,
    track_number: document.querySelector("#num_tracks").value,
    genre: document.querySelector("#genre").value,
    action: "POST",
  };

  let formData = new FormData();
  for (const key in albumData) {
    formData.append(key, albumData[key]);
  }

  fetch(apiUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      handleResponse(data);
    })
    .catch((error) => {
      console.error("Error creating album:", error.message);
      handleResponse({ message: "Error creating album. Please try again." });
    });
}

function performUpdate() {
  let albumData = {
    albumId: document.querySelector("#album_id").value,
    album_name: document.querySelector("#album_name").value,
    artist: document.querySelector("#artist").value,
    language: document.querySelector("#language").value,
    track_number: document.querySelector("#num_tracks").value,
    genre: document.querySelector("#genre").value,
    action: "PATCH",
  };

  let formData = new FormData();
  for (const key in albumData) {
    formData.append(key, albumData[key]);
  }

  fetch(apiUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      handleResponse(data);
    })
    .catch((error) => {
      console.error("Error updating album:", error.message);
      handleResponse({ message: "Error updating album. Please try again." });
    });
}


function deleteAlbum(albumId) {
  let albumData = {
    albumId: albumId,
    action: "DELETE",
  };

  let formData = new FormData();
  for (const key in albumData) {
    formData.append(key, albumData[key]);
  }

  fetch(apiUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      handleResponse(data);
    })
    .catch((error) => {
      console.error("Error deleting album:", error.message);
      handleResponse({ message: "Error deleting album. Please try again." });
    });
}

function handleResponse(data) {
  let outputElement = document.querySelector("#output");
  if (outputElement) {
    outputElement.innerHTML = data.message;
  }

  readAlbums();
  resetForm();
}


function readAlbums() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let tableBody = document.querySelector("#album_table_body");
      if (tableBody) {
        tableBody.innerHTML = "";

        data.forEach((album) => {
          let row = tableBody.insertRow();
          let cell0 = row.insertCell(0);
          let cell1 = row.insertCell(1);
          let cell2 = row.insertCell(2);
          let cell3 = row.insertCell(3);
          let cell4 = row.insertCell(4);
          let cell5 = row.insertCell(5);
          let cell6 = row.insertCell(6);

          cell0.innerHTML = album.id || ''; 
          cell1.innerHTML = (album.album_name || '').toUpperCase();
          cell2.innerHTML = (album.artist || '').toUpperCase();
          cell3.innerHTML = album.language || '';
          cell4.innerHTML = album.track_number || '';
          cell5.innerHTML = album.genre || '';

          let updateButton = document.createElement("button");
          updateButton.textContent = "Update";
          updateButton.onclick = function () {
            updateAlbum(album);
          };

          let deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.onclick = function () {
            deleteAlbum(album.id);
          };

          cell6.appendChild(updateButton);
          cell6.appendChild(deleteButton);
        });
      }

      let outputElement = document.querySelector("#output");
      if (outputElement) {
        outputElement.innerHTML = "";
      }
    })
    .catch((error) => {
      console.error("Error reading albums:", error.message);
    });
}


function updateAlbum(album) {
  document
    .querySelector("#language")
    .removeEventListener("change", validateForm);
  document.querySelector("#genre")
    .removeEventListener("change", validateForm);

  document.querySelector("#album_id").value = album.id;
  document.querySelector("#album_name").value = album.album_name;
  document.querySelector("#artist").value = album.artist;
  document.querySelector("#language").value = album.language;
  document.querySelector("#num_tracks").value = album.track_number;
  document.querySelector("#genre").value = album.genre;

  let createButton = document.querySelector("#album_form button");
  createButton.textContent = "UPDATE";
  createButton.onclick = function () {
    performUpdate();
  };

  document.querySelector("#language")
    .addEventListener("change", validateForm);
  document.querySelector("#genre")
    .addEventListener("change", validateForm);
}

function resetForm() {
  let albumForm = document.querySelector("#album_form");
  if (albumForm) {
    albumForm.reset();
    let createButton = document.querySelector("#album_form button");
    if (createButton) {
      createButton.textContent = "Create";
      createButton.onclick = function () {
        createAlbum();
      };
    }
  } else {
    console.error("Error resetting form: Album form not found.");
  }
}
