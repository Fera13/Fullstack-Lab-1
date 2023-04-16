const myTable = document.getElementById("myTable");

async function showAlbums() {
  try {
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
              </td>`;

          row.innerHTML = content;
          myTableBody.appendChild(row);
        }
        myTable.appendChild(myTableBody);
      });
    myTable.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-btn")) {
        const rowId = event.target.closest("tr").id;
        handleDelete(rowId);
      } else if (event.target.classList.contains("update-btn")) {
        handleUpdate();
      } else if (event.target.classList.contains("show-details-btn")) {
        handleShowingDetails();
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
