let currentIndex = 0;
let apiUrl = "https://comment-folio-default-rtdb.asia-southeast1.firebasedatabase.app/comments.json"

function showTestimonial(index) {
  const testimonials = document.querySelectorAll(".testimonial");
  testimonials.forEach((testimonial) => 
  testimonial.classList.remove("active"));
  testimonials[index].classList.add("active");
}

function changeTestimonial(direction) {
  currentIndex += direction;

  const testimonials = document.querySelectorAll(".testimonial");
  if (currentIndex >= testimonials.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = testimonials.length - 1;
  }

  showTestimonial(currentIndex);
}

showTestimonial(currentIndex);

document.addEventListener("DOMContentLoaded", () => {
  sortComments();

  document.querySelector("#name")
    .addEventListener("input", updateButtonState);
  document.querySelector("#comment")
    .addEventListener("input", updateButtonState);
  document.querySelector("#add_comment_btn")
    .addEventListener("click", addComment);
  document.querySelector("#sort")
    .addEventListener("change", sortComments);

  displayComments();
});

function updateButtonState() {
  const nameInput = document.querySelector("#name");
  const commentInput = document.querySelector("#comment");
  const addCommentBtn = document.querySelector("#add_comment_btn");

  addCommentBtn.disabled = 
    !nameInput.value.trim() || !commentInput.value.trim();
}

function addComment() {
  const nameInput = document.querySelector("#name");
  const commentInput = document.querySelector("#comment");
  const addCommentBtn = document.querySelector("#add_comment_btn");

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const dateTime = new Date().toLocaleString();

  if (!name.length || !comment.length || addCommentBtn.disabled) {
    return;
  }

  addCommentBtn.disabled = true;

  const requestBody = {
    name: name,
    comment: comment,
    dateTime: dateTime
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      nameInput.value = "";
      commentInput.value = "";
      displayComments();
    })
    .catch((error) => {
      console.error("Error adding comment:", error.message);
    })
    .finally(() => {
      addCommentBtn.disabled = false;
    });
}

function displayComments() {
  const commentsContainer = document.querySelector("#comments_dynamic");
  commentsContainer.innerHTML = "";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      for (const commentId in data) {
        const comment = data[commentId];
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
      }
    })
    .catch((error) => {
      console.error("Error retrieving comments:", error.message);
    });
}

function sortComments() {
  const sortOption = document.querySelector("#sort").value;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const commentsArray = Object.values(data);

      if (sortOption === "newest") {
        commentsArray.sort((a, b) => 
          new Date(b.dateTime) - new Date(a.dateTime));
      } else if (sortOption === "oldest") {
        commentsArray.sort((a, b) => 
          new Date(a.dateTime) - new Date(b.dateTime));
      }

      displaySortedComments(commentsArray);
    })
    .catch((error) => {
      console.error("Error retrieving and sorting comments:", error.message);
    });
}

function displaySortedComments(sortedComments) {
  const commentsContainer = document.querySelector("#comments_dynamic");
  commentsContainer.innerHTML = "";
  sortedComments.forEach((comment) => {
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


