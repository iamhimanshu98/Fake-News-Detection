// Get CSRF token from the cookie or HTML
const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

function copyToClipboard(text, triggerElement = null) {
  navigator.clipboard.writeText(text).then(() => {
    let copyBtn = triggerElement?.closest(".news-card")?.querySelector(".copy-button");

    if (copyBtn) {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "Copied!";
      copyBtn.disabled = true;

      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.disabled = false;
      }, 1000);
    }
  });
}

const textarea = document.getElementById("news-text");
const charCount = document.querySelector(".char-count");

textarea.addEventListener("input", () => {
  charCount.textContent = `${textarea.value.length}/2000`;
});


function clearInput() {
  document.getElementById("news-text").value = "";
  document.querySelector(".char-count").innerText = "0/2000";
  document.getElementById("prediction").innerText = "Submit news for analysis";
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
      const predictionEl = document.getElementById("prediction");
    
      if (data.prediction) {
        const predictionText = data.prediction.trim().toLowerCase();
    
        if (predictionText === "real") {
          predictionEl.innerHTML = `<span class="green-text">Real News</span>`;
        } else if (predictionText === "fake") {
          predictionEl.innerHTML = `<span class="red-text">Fake News</span>`;
        } else {
          predictionEl.innerHTML = `<span class="status-icon">❓</span> ${data.prediction}`;
        }
      } else {
        predictionEl.innerText = "Error: " + data.error;
      }
    })    
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("prediction").innerText =
        "An error occurred. Check the console for details.";
    });
});
