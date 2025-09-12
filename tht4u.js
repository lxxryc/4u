 const FIXED_DURATION = 10;
  

    const messageEl = document.getElementById("message");
    const statusEl = document.getElementById("status");
    const progressBar = document.getElementById("progressBar");
    const countdownText = document.getElementById("countdownText");
    const toggleBtn = document.getElementById("toggleTheme");

    const modalOverlay = document.getElementById("modalOverlay");
    const leaveBtn = document.getElementById("leaveThought");
    const thoughtForm = document.getElementById("thoughtForm");
    const formMessage = document.getElementById("formMessage");

    toggleBtn.onclick = () => {
      document.body.classList.toggle("dark");
      toggleBtn.textContent = document.body.classList.contains("dark") ? "🌞" : "🌙";
    };

    leaveBtn.onclick = () => { modalOverlay.style.display = "flex"; };
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
        formMessage.textContent = "";
      }
    };

    thoughtForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      formMessage.textContent = "Sending...";
      try {
        const response = await fetch(thoughtForm.action, {
          method: "POST",
          body: new FormData(thoughtForm),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          formMessage.textContent = "Message sent";
          thoughtForm.reset();
        } else {
          formMessage.textContent = "Message not sent";
        }
      } catch (err) {
        formMessage.textContent = "Message not sent";
      }
    });

    function computeDuration() {
      const text = messageEl.innerText.trim();
      return Math.max(10, Math.ceil(text.length / 12));
    }

    function startCountdown() {
      let remaining = FIXED_DURATION ?? computeDuration();
      const duration = remaining;
      const timer = setInterval(() => {
        remaining--;
        progressBar.style.width = (remaining / duration) * 100 + "%";
        if (remaining <= 0) {
          clearInterval(timer);
          destroyMessage();
        }
      }, 1000);
    }

    function destroyMessage() {
      localStorage.setItem("messageDestroyed", "true");
      messageEl.classList.add("fade-out");
      setTimeout(() => {
        messageEl.innerHTML = "";
        statusEl.textContent = "Message destroyed";
        countdownText.style.display = "none";
        document.getElementById("progressBarWrapper").style.display = "none";
      }, 1000);
    }

    function checkIfDestroyed() {
      if (localStorage.getItem("messageDestroyed") === "true") {
        messageEl.innerHTML = "";
        statusEl.textContent = "Message destroyed";
        countdownText.style.display = "none";
        document.getElementById("progressBarWrapper").style.display = "none";
      } else {
        startCountdown();
      }
    }
    checkIfDestroyed();