const commentSection = [
  { 
    name: "Odrunia, Mark", 
    comment: `Great goals, hoping you achieve all of them someday!`, 
    dateTime: "10/22/2023 8:40:02 PM" 
  },
  { 
    name: "Dimasacat, Andronicus", 
    comment: `I like how your goals will change your 
              future and influence others`, 
    dateTime: "10/22/2023 7:53:02 AM" 
  },
  { 
    name: "Go, Harrel C", 
    comment: `More jams to come before we finish our degree. 
              Good luck on your journey!`, 
    dateTime: "10/23/2023 3:51:02 AM" 
  },
  { 
    name: "Galope, Jhean Khendrick", 
    comment: `Nice work broski! Keep it up, 
              and you'll be where you dream of in no time.`, 
    dateTime: "10/22/2023 6:51:02 AM" 
  }
];

sortComments();

document.querySelector("#name")
  .addEventListener("input", updateButtonState);
document.querySelector("#comment")
  .addEventListener("input", updateButtonState);

function updateButtonState() {
  const nameInput = document.querySelector("#name");
  const commentInput = document.querySelector("#comment");
  const addCommentBtn = document.querySelector("#add_comment_btn");

  addCommentBtn.disabled 
  = !nameInput.value.trim() || !commentInput.value.trim();
}

document.querySelector("#add_comment_btn")
  .addEventListener("click", addComment);

function addComment() {
  const nameInput = document.querySelector("#name");
  const commentInput = document.querySelector("#comment");
  const addCommentBtn = document.querySelector("#add_comment_btn");

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const dateTime = new Date().toLocaleString();

  if (!name.length || !comment.length) {
      addCommentBtn.disabled = true;
      return;
  }

  const newComment = { name, comment, dateTime };
  commentSection.push(newComment);
  displayComments();
  nameInput.value = "";
  commentInput.value = "";
  addCommentBtn.disabled = true;
}

function displayComments() {
  const commentsContainer = document.querySelector("#comments_dynamic");
  commentsContainer.innerHTML = "";

  commentSection.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comments_dynamic");
      commentDiv.innerHTML =
          `<p>
              <strong>${comment.name}</strong> - ${comment.dateTime}
          </p>
          <p>
              <em>${comment.comment}</em>
          </p>`;
      commentsContainer.appendChild(commentDiv);
  });
}

function sortComments() {
  const sortOption = document.querySelector("#sort").value;

  if (sortOption === "newest") {
      commentSection.sort((a, b) =>
          new Date(b.dateTime) - new Date(a.dateTime)
      );
  } else if (sortOption === "oldest") {
      commentSection.sort((a, b) =>
          new Date(a.dateTime) - new Date(b.dateTime)
      );
  }

  displayComments();
}
