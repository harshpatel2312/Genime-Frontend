document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");

  const closeLoginBtn = document.getElementById("closeLoginModal");
  const closeSignupBtn = document.getElementById("closeSignupModal");

  const openSignupFromLogin = document.getElementById("openSignupFromLogin");
  const openLoginFromSignup = document.getElementById("openLoginFromSignup");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const loginMsg = document.getElementById("loginMessage");
  const signupMsg = document.getElementById("signupMessage");

  // Header elements
  const userBtn = document.getElementById("userBtn");
  const userDropdown = document.getElementById("userDropdown");
  const logoutOption = document.getElementById("logoutOption");
  const profileOption = document.getElementById("profileOption");

  const BACKEND_URL = "http://127.0.0.1:8000/auth";

  // ===== Utility: Inline message display =====
  const showMessage = (element, message, type = "error") => {
    element.textContent = message;
    element.className = `mt-4 text-center text-sm font-medium ${
      type === "success" ? "text-green-400" : "text-red-400"
    }`;
    element.classList.remove("hidden");
  };

  // ===== Modal animations =====
  const showModal = (modal) => {
    modal.classList.remove("hidden");
    modal.classList.add("flex", "modal-show");
    modal.classList.remove("modal-hide");
  };

  const hideModal = (modal) => {
    modal.classList.remove("modal-show");
    modal.classList.add("modal-hide");
    setTimeout(() => modal.classList.add("hidden"), 250);
  };

  // ===== Header Logic (Login / User Dropdown) =====
  const updateHeaderButton = () => {
    const user = JSON.parse(localStorage.getItem("genimeUser"));
    if (user) {
      userBtn.textContent = `${user.username.trim().split(" ")[0] || user.email.split("@")[0]}`;
      userBtn.onclick = toggleDropdown;
    } else {
      userBtn.textContent = "Login";
      userDropdown.classList.add("hidden");
      userBtn.onclick = () => showModal(loginModal);
    }
  };

  const toggleDropdown = () => {
    if (userDropdown.classList.contains("show")) {
        userDropdown.classList.remove("show");
        setTimeout(() => userDropdown.classList.add("hidden"), 150);
    } else {
        userDropdown.classList.remove("hidden");
        // Force reflow so transition plays again if reopened quickly
        void userDropdown.offsetWidth;
        userDropdown.classList.add("show");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("genimeUser");
    updateHeaderButton();
    userDropdown.classList.add("hidden");
  };

  logoutOption.addEventListener("click", () => logoutUser());
  profileOption.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Profile feature coming soon!");
    userDropdown.classList.add("hidden");
  });

  // Close dropdown on outside click
  window.addEventListener("click", (e) => {
    if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add("hidden");
    }
  });

  // ===== Modal Event Logic =====
  closeLoginBtn.addEventListener("click", () => hideModal(loginModal));
  closeSignupBtn.addEventListener("click", () => hideModal(signupModal));

  openSignupFromLogin.addEventListener("click", (e) => {
    e.preventDefault();
    hideModal(loginModal);
    setTimeout(() => showModal(signupModal), 250);
  });

  openLoginFromSignup.addEventListener("click", (e) => {
    e.preventDefault();
    hideModal(signupModal);
    setTimeout(() => showModal(loginModal), 250);
  });

  // Close modals on background click
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) hideModal(loginModal);
    if (e.target === signupModal) hideModal(signupModal);
  });

  // ===== Signup =====
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupMsg.classList.add("hidden");

    const username = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        showMessage(signupMsg, "Signup successful! Redirecting to login...", "success");
        setTimeout(() => {
          hideModal(signupModal);
          signupForm.reset();
          signupMsg.classList.add("hidden");
          showModal(loginModal);
          showMessage(loginMsg, "🎉 Account created! Please log in.", "success");
        }, 2000);
      } else {
        showMessage(signupMsg, data.message || "⚠️ Signup failed");
      }
    } catch (err) {
      console.error(err);
      showMessage(signupMsg, "❌ Unable to connect to backend.");
    }
  });

  // ===== Login =====
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMsg.classList.add("hidden");

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("genimeUser", JSON.stringify(data.user));
        showMessage(loginMsg, "Login successful!", "success");

        setTimeout(() => {
          hideModal(loginModal);
          updateHeaderButton();
        }, 1500);
      } else {
        showMessage(loginMsg, data.message || "⚠️ Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      showMessage(loginMsg, "❌ Unable to connect to backend.");
    }
  });
  setTimeout(() => {
      updateHeaderButton();
  }, 200);
});
