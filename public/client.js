async function showAlbums() {
  try {
    await fetch(`http://localhost:3000/api/albums`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((albums) => {
        const myTable = document.getElementById("myTable");
        const myTableBody = document.querySelector(".rows");

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
    document.querySelector(".delete-btn").addEventListener("click", () => {
      handleDelete();
    });
    document.querySelector(".update-btn").addEventListener("click", () => {
      handleUpdate();
    });
    document
      .querySelector(".show-details-btn")
      .addEventListener("click", () => {
        handleShowingDetails();
      });
  } catch (error) {
    console.log(error);
  }
}
showAlbums();

async function handleDelete() {}

async function handleUpdate() {}

async function handleShowingDetails() {}
