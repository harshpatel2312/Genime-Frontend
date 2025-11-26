document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptBox = document.getElementById("prompt");
  const loadingSection = document.getElementById("loadingSection");
  const waveFill = document.getElementById("waveFill");
  const imageContainer = document.getElementById("imageContainer");
  const generatedImage = document.getElementById("generatedImage");
  const resultText = document.getElementById("resultText");
  const generatingLabel = document.getElementById("generatingLabel");
  const loadingText = document.getElementById("loadingText");

  // NEW: video elements
  const videoContainer = document.getElementById("videoContainer");
  const generatedVideo = document.getElementById("generatedVideo");
  const videoResultText = document.getElementById("videoResultText");

  // NEW: mode toggle buttons
  const modeImageBtn = document.getElementById("modeImageBtn");
  const modeVideoBtn = document.getElementById("modeVideoBtn");

  // // Localhost URL's
  // const BASE_URL = "http://127.0.0.1:8000"
  // const IMAGE_BACKEND_URL = `${BASE_URL}/generate/image`; // Image Generation
  // const VIDEO_BACKEND_URL = `${BASE_URL}/generate/video`; // Video Generation

  // Backend URLs
  const BASE_URL = "http://ec2-52-7-248-169.compute-1.amazonaws.com:8000"
  const IMAGE_BACKEND_URL = `${BASE_URL}/generate/image`; // Image Generation
  const VIDEO_BACKEND_URL = `${BASE_URL}/generate/video`; // Video Generation

  let currentMode = "image"; // "image" or "video"

  // --- Mode toggle logic (Apple-style segmented control) ---
  const applyModeStyles = () => {
    if (currentMode === "image") {
      modeImageBtn.classList.add("bg-white", "text-black", "shadow");
      modeImageBtn.classList.remove("bg-transparent", "text-gray-300");

      modeVideoBtn.classList.add("bg-transparent", "text-gray-300");
      modeVideoBtn.classList.remove("bg-white", "text-black", "shadow");
    } else {
      modeVideoBtn.classList.add("bg-white", "text-black", "shadow");
      modeVideoBtn.classList.remove("bg-transparent", "text-gray-300");

      modeImageBtn.classList.add("bg-transparent", "text-gray-300");
      modeImageBtn.classList.remove("bg-white", "text-black", "shadow");
    }
  };

  // Init
  applyModeStyles();

  modeImageBtn.addEventListener("click", () => {
    if (currentMode !== "image") {
      currentMode = "image";
      applyModeStyles();
    }
  });

  modeVideoBtn.addEventListener("click", () => {
    if (currentMode !== "video") {
      currentMode = "video";
      applyModeStyles();
    }
  });

  // --- Generate logic ---
  generateBtn.addEventListener("click", async () => {
    const prompt = promptBox.value.trim();
    if (!prompt) {
      alert("Please enter a prompt first.");
      return;
    }

    // Reset IMAGE UI
    imageContainer.classList.add("hidden");
    generatedImage.src = "";
    resultText.style.opacity = "0";
    generatedImage.style.opacity = "0";

    // Reset VIDEO UI
    videoContainer.classList.add("hidden");
    if (generatedVideo) {
      // clear old video
      generatedVideo.removeAttribute("src");
      generatedVideo.load();
    }

    // Show loading section + proper label
    loadingSection.classList.remove("hidden");
    generatingLabel.textContent =
      currentMode === "image" ? "Generating image..." : "Generating video...";
    loadingText.textContent = "This may take a few seconds";

    // Start wave animation
    waveFill.style.transition = "none";
    waveFill.style.opacity = "1";
    waveFill.style.width = "0%";
    void waveFill.offsetWidth;
    waveFill.style.transition = "width 4s linear";
    waveFill.style.width = "100%";
    waveFill.querySelector(".wave").style.animation = "";

    try {
      // Pick endpoint + request body based on mode
      const endpoint =
        currentMode === "image" ? IMAGE_BACKEND_URL : VIDEO_BACKEND_URL;

      const body =
        currentMode === "image"
          ? { prompt, number_of_images: 1 }
          : { prompt }; // add extra fields for video here if needed

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.status === "success") {
        if (currentMode === "image") {
          // --- IMAGE MODE (same as before) ---
          if (data.images?.length) {
            const base64Img = data.images[0];

            generatedImage.classList.remove("fade-in-image");
            void generatedImage.offsetWidth;
            generatedImage.classList.add("fade-in-image");
            generatedImage.src = "data:image/png;base64," + base64Img;

            const downloadBtn = document.getElementById("downloadBtn");
            downloadBtn.classList.remove("hidden");

            downloadBtn.onclick = () => {
              const link = document.createElement("a");
              link.href = generatedImage.src;
              link.download = `genime_${Date.now()}.png`;
              link.click();
            };

            setTimeout(() => {
              waveFill.querySelector(".wave").style.animation = "none";
              waveFill.style.transition = "opacity 1s ease";
              waveFill.style.opacity = "0";
            }, 3500);

            setTimeout(() => {
              loadingSection.classList.add("hidden");
              imageContainer.classList.remove("hidden");
              resultText.textContent = "Image generated below";
              resultText.style.opacity = "1";
              generatedImage.style.opacity = "1";
            }, 4000);
          } else {
            throw new Error("Image not returned from backend.");
          }
        } else {
          // --- VIDEO MODE ---
          // Expecting backend: { status: "success", video_base64: "..." }
          const base64Video = data.video_base64;
          if (!base64Video) {
            throw new Error("No video data returned from backend.");
          }

          // base64 -> Uint8Array -> Blob -> Object URL
          const byteCharacters = atob(base64Video);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const blob = new Blob([byteArray], { type: "video/mp4" });
          const videoUrl = URL.createObjectURL(blob);

          generatedVideo.src = videoUrl;
          generatedVideo.load();

          // retrigger fade-in animation
          generatedVideo.classList.remove("fade-in-image");
          void generatedVideo.offsetWidth; // force reflow
          generatedVideo.classList.add("fade-in-image");

          // Make it visible as we started with opacity 0
          generatedVideo.style.opacity = "1";

          // Stop wave
          waveFill.querySelector(".wave").style.animation = "none";
          waveFill.style.transition = "opacity 1s ease";
          waveFill.style.opacity = "0";
          loadingSection.classList.add("hidden");

          // Show video container
          videoResultText.textContent = "Video generated below";
          videoContainer.classList.remove("hidden");
        }
      } else {
        alert("Error: " + (data.message || "Generation failed"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend. Make sure FastAPI is running.");
    }
  });
});
