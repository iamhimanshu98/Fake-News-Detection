// Get CSRF token from the cookie or HTML
const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

function copyToClipboard(text, button = null) {
  navigator.clipboard.writeText(text).then(() => {
      if (button) {
          button.classList.add('copied');
          setTimeout(() => {
              button.classList.remove('copied');
          }, 1500);
      }
  });
}

// Listen to form submission and prevent the default action
document.getElementById("news-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the form from submitting the traditional way

  const newsText = document.getElementById("news-text").value;

  fetch("/predict/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrftoken, // Add CSRF token to headers
    },
    body: "news_text=" + encodeURIComponent(newsText),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.prediction) {
        document.getElementById("prediction").innerText = data.prediction;
      } else {
        document.getElementById("prediction").innerText =
          "Error: " + data.error;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("prediction").innerText =
        "An error occurred. Check the console for details.";
    });
});
