const myTable = document.getElementById("myTable");

async function showAlbums() {
  try {
    const updateArea = document.querySelector(".update-space");
    updateArea.innerHTML = "";
    const myTableBody = document.querySelector(".rows");
    myTableBody.innerHTML = "";
    const oldRows = document.querySelectorAll("#myTable .rows tr");
    oldRows.forEach((row) => {
      row.remove();
    });
    await fetch(`http://localhost:3000/api/albums`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((albums) => {
        for (const album of albums) {
          const row = document.createElement("tr");
          row.setAttribute("id", album._id);
          const content = `
              <td class="title-cell">${album.title}</td>
              <td class="btn-cell">
                <button class="update-btn"> Update Album </button>
              </td>
              <td class="btn-cell">
                <button class="delete-btn"> Delete Album </button>
              </td>
              <td class="btn-cell">
                <button class="show-details-btn"> Show details </button>
              </td>
              <td class="show-details"></td>`;

          row.innerHTML = content;
          myTableBody.appendChild(row);
        }
        myTable.appendChild(myTableBody);
      });
    myTable.addEventListener("click", (event) => {
      const rowId = event.target.closest("tr").id;
      if (event.target.classList.contains("delete-btn")) {
        handleDelete(rowId);
      } else if (event.target.classList.contains("update-btn")) {
        handleUpdate(rowId);
      } else if (event.target.classList.contains("show-details-btn")) {
        const titleText = event.target
          .closest("tr")
          .querySelector(".title-cell").textContent;
        handleShowingDetails(titleText);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
showAlbums();

async function handleDelete(rowId) {
  try {
    const response = await fetch(`http://localhost:3000/api/albums/${rowId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) {
      const errorSpace = document.querySelector(".error-space");
      errorSpace.textContent = "Failed to delete. The album wasn't found.";
      return;
    }

    await showAlbums();

    const errorSpace = document.querySelector(".error-space");
    errorSpace.textContent = "Album deleted successfully!";
  } catch (error) {
    console.error(error);
  }
}
async function handleUpdate(rowId) {
  const updateParent = document.querySelector(".update-space");
  updateParent.innerHTML = `
    <label>Updated title</label>
    <input type="text" id="up-titleText"></input>
    <label>Updated artist</label>
    <input type="text" id="up-artistText"></input>
    <label>Updated year</label>
    <input type="text" id="up-yearText"></input>
    <button id="update">Update the album</button>`;

  const updateButton = document.getElementById("update");
  updateButton.addEventListener("click", () => {
    doTheUpdate(rowId);
  });
}

async function doTheUpdate(rowId) {
  const newTitle = document.querySelector("#up-titleText").value;
  const newArtist = document.querySelector("#up-artistText").value;
  const newYear = document.querySelector("#up-yearText").value;
  try {
    const response = await fetch(`http://localhost:3000/api/albums/${rowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        artist: newArtist,
        year: newYear,
      }),
    });

    if (response.status === 404) {
      const errorSpace = document.querySelector(".error-space");
      errorSpace.textContent = "Failed to update. The album wasn't found.";
      return;
    }

    await showAlbums();

    const errorSpace = document.querySelector(".error-space");
    errorSpace.textContent = "Album updated successfully!";
  } catch (error) {
    console.error(error);
  }
}

async function handleShowingDetails(title) {
  try {
    const response = await fetch(`http://localhost:3000/api/albums/${title}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = response.json();
    const albums = Promise.resolve(result);

    albums
      .then((text) => {
        document.querySelector(".show-details").innerHTML = text
          .map(
            (album) =>
              `Title: ${album.title}, Artist: ${album.artist}, Year: ${album.year}`
          )
          .join(" ");
      })
      .catch((err) => {
        console.log(err);
      });
    if (response.status === 404) {
      const errorSpace = document.querySelector(".error-space");
      errorSpace.textContent =
        "Failed to show details. The album wasn't found.";
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

/*try {
  document.addEventListener("DOMContentLoaded", () => {
    // Select the necessary elements from the HTML
    const createAlbumBtn = document.querySelector("#createAlbumBtn");
    const titleText = document.querySelector("#titleText");
    const artistText = document.querySelector("#artistText");
    const yearText = document.querySelector("#yearText");
    const errorSpace = document.querySelector(".error-space");

    // Function to check if a string is empty
    const isEmpty = (str) => !str.trim().length;

    // Function to handle form submission
    const handleSubmit = () => {
      // Check if any input fields are empty
      if (
        isEmpty(titleText.value) ||
        isEmpty(artistText.value) ||
        isEmpty(yearText.value)
      ) {
        errorSpace.textContent = "Please fill out all fields.";
        return;
      }

      // Send a POST request to create a new album
      fetch("http://localhost:3000/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleText.value,
          artist: artistText.value,
          year: yearText.value,
        }),
      })
        .then((response) => {
          console.log("Response:", response);
          return response.json();
        })
        .then((newAlbum) => {
          // Clear the input fields and error message
          titleText.value = "";
          artistText.value = "";
          yearText.value = "";
          errorSpace.textContent = "";

          // Add the new album to the table
          addAlbumRow(newAlbum);
        })
        .catch((error) => console.error("Error creating album:", error));
    };

    // Add a click event listener to the create album button
    createAlbumBtn.addEventListener("click", handleSubmit);
  });
} catch (error) {
  console.error("Something went wrong:", error);
}

const addAlbumRow = (album) => {
  // Select the table body element
  const tableBody = document.querySelector("#myTable tbody");

  // Create a new table row element
  const row = document.createElement("tr");

  // Create a table cell for the album title
  const titleCell = document.createElement("td");
  titleCell.textContent = album.title;
  row.appendChild(titleCell);

  // Create a table cell for the actions
  const actionsCell = document.createElement("td");

  // Create the view button
  const viewCell = document.createElement("td");
  const viewButton = document.createElement("button");
  viewButton.textContent = "View";
  viewButton.addEventListener("click", () => {
    // Create the accordion element
    const accordion = document.createElement("div");
    accordion.classList.add("accordion");

    // Create the accordion header element
    const accordionHeader = document.createElement("div");
    accordionHeader.classList.add("accordion-header");
    accordionHeader.textContent = album.title;
    accordion.appendChild(accordionHeader);

    // Create the accordion body element
    const accordionBody = document.createElement("div");
    accordionBody.classList.add("accordion-body");
    console.log(album.id);
    accordionBody.innerHTML = `
        <p>ID: ${album.id}</p>
        <p>Title: ${album.title}</p>
        <p>Artist: ${album.artist}</p>
        <p>Year: ${album.year}</p>
      `;
    accordion.appendChild(accordionBody);

    // Remove any existing accordions
    const existingAccordions = document.querySelectorAll(".accordion");
    existingAccordions.forEach((existingAccordion) => {
      existingAccordion.remove();
    });

    // Add the accordion to the table
    viewCell.appendChild(accordion);
  });
  actionsCell.appendChild(viewButton);

  // Create the update button
  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.addEventListener("click", () => {
    // Prompt the user for new album details
    const newTitle = prompt("Enter a new title:", album.title);
    const newArtist = prompt("Enter a new artist:", album.artist);
    const newYear = prompt("Enter a new year:", album.year);

    // Send a PUT request to update the album
    fetch(`http://localhost:3000/api/albums/${album.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        artist: newArtist,
        year: newYear,
      }),
    })
      .then((response) => response.json())
      .then((updatedAlbum) => {
        // Update the album row in the table
        titleCell.textContent = updatedAlbum.title;
        album.title = updatedAlbum.title;
        album.artist = updatedAlbum.artist;
        album.year = updatedAlbum.year;
      });
  });
  actionsCell.appendChild(updateButton);

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    fetch(`http://localhost:3000/api/albums/${album.id}`, {
      method: "DELETE",
    })
      .then(() => {
        // refresh the table after deletion
        fetchAlbums();
      })
      .catch((err) => console.error(err));
  });
  actionsCell.appendChild(deleteButton);

  row.appendChild(actionsCell);

  // Append the new row to the table body
  tableBody.appendChild(row);
};*/
