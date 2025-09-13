  const FIXED_DURATION = 10;  
  const THOUGHT_VERSION = "T:1";  
  const THOUGHT_TEXT = {
    text: "if clouds weren’t just water vapor but carried faint whispers of every place they passed over, then when it rained, you’d hear fragments of stories, laughter, or secrets falling with the drops.",
    author: "adsila",
    link: "https://web.facebook.com/profile.php?id=61552797368814"
  };
  

  const messageEl = document.getElementById("message");
  const statusEl = document.getElementById("status");
  const leaveBtn = document.getElementById("leaveThought");
  const modalOverlay = document.getElementById("modalOverlay");
  const thoughtForm = document.getElementById("thoughtForm");
  const formMessage = document.getElementById("formMessage");

  function renderThought() {
    messageEl.innerHTML = `
      <blockquote>
        ${THOUGHT_TEXT.text}
        <span class="author">— <a href="${THOUGHT_TEXT.link}" target="_blank">${THOUGHT_TEXT.author}</a></span>
      </blockquote>
    `;
  }

 
  if (leaveBtn) {
    leaveBtn.onclick = () => { modalOverlay.style.display = "flex"; };
  }


  if (modalOverlay) {
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
        formMessage.textContent = "";
      }
    };
  }

  
  if (thoughtForm) {
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
  }

  function startCountdown() {
    let remaining = FIXED_DURATION;
    const timer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(timer);
        destroyMessage();
      }
    }, 1000);
  }

  function destroyMessage() {
    localStorage.setItem("messageDestroyed:" + THOUGHT_VERSION, "true");
    messageEl.classList.add("fade-out");
    setTimeout(() => {
      messageEl.innerHTML = "";
      statusEl.textContent = "Message destroyed";
      leaveBtn.style.display = "inline-block";
    }, 1000);
  }

  function checkIfDestroyed() {
    if (localStorage.getItem("messageDestroyed:" + THOUGHT_VERSION) === "true") {
      messageEl.innerHTML = "";
      statusEl.textContent = "Message destroyed";
      leaveBtn.style.display = "inline-block";
    } else {
      renderThought();
      startCountdown();
    }
  }

  checkIfDestroyed();
