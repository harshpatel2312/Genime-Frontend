document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const textarea = document.getElementById("promptBox");
  const imageContainer = document.getElementById("imageContainer");
  const generatedImage = document.getElementById("generatedImage");
  const generatingLabel = document.getElementById("generatingLabel");
  const loadingText = document.getElementById("loadingText");
  const waveFill = document.getElementById("waveFill");

  const BACKEND_URL = "http://127.0.0.1:8000/generate";

  // 🔄 Smooth text update helper
  function smoothTextChange(element, newText) {
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    element.style.opacity = "0";
    element.style.transform = "translateY(-5px)";
    setTimeout(() => {
      element.textContent = newText;
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 400);
  }

  generateBtn.addEventListener("click", async () => {
    const prompt = textarea.value.trim();
    if (!prompt) {
      alert("Please enter a prompt first.");
      return;
    }

    // Reset UI state
    smoothTextChange(generatingLabel, "Generating...");
    generatingLabel.classList.remove("hidden");
    smoothTextChange(loadingText, "This may take a few seconds");
    loadingText.classList.remove("hidden");
    imageContainer.classList.add("hidden");
    generatedImage.src = "";

    // Restart wave
    waveFill.style.transition = "none";
    waveFill.style.width = "0%";
    void waveFill.offsetWidth;
    waveFill.style.transition = "width 4s linear";
    waveFill.style.width = "100%";
    waveFill.querySelector(".wave").style.animation = ""; // restart wave motion

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, number_of_images: 1 }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.status === "success" && data.images?.length) {
        const base64Img = data.images[0];
        generatedImage.src = "data:image/png;base64," + base64Img;

        // Stop wave and update text
        waveFill.style.transition = "width 0.3s ease";
        waveFill.style.width = "100%";
        waveFill.querySelector(".wave").style.animation = "none";

        smoothTextChange(generatingLabel, "Image generated below 👇");
        loadingText.classList.add("hidden");

        // Fade in the image smoothly
        imageContainer.classList.remove("hidden");
        generatedImage.style.opacity = "0";
        generatedImage.style.transition = "opacity 0.8s ease";
        setTimeout(() => (generatedImage.style.opacity = "1"), 100);
      } else {
        alert("Error generating image: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend. Make sure it's running.");
    }
  });
});
