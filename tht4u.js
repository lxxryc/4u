const FIXED_DURATION = 20;  
    const THOUGHT_VERSION = "9:15:11:55";  

    const THOUGHT_TEXT = {
      paragraphs: [
       "you deserve more than that. you deserve wholeness. you deserve love that doesn’t ask you to shrink. you deserve respect that doesn’t come with conditions.",
       "the moment you embrace your true self. the moment you know your worth. you stop allowing people to devalue you. you stop accepting leftovers and cheap love because you finally understand: this is not what you were made for.",
       "yes, life has seasons. hardships come. and it’s easy to look at others and compare. but your journey is yours, and when you carry self-love at the center of it, you'll no longer settle for less than you were created to receive.",
        
      ],
      author: "tap",
      link: "https://www.facebook.com/share/16zPsE3HH1/"
    };

    const messageEl = document.getElementById("message");
    const statusEl = document.getElementById("status");
    const leaveBtn = document.getElementById("leaveThought");
    const modalOverlay = document.getElementById("modalOverlay");
    const thoughtForm = document.getElementById("thoughtForm");
    const formMessage = document.getElementById("formMessage");

    function renderThought() {
      const paragraphsHTML = THOUGHT_TEXT.paragraphs
        .map(p => `<p>${p}</p>`)
        .join("");

      messageEl.innerHTML = `
        <blockquote>
          ${paragraphsHTML}
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
        formMessage.textContent = "sending...";
        try {
          const response = await fetch(thoughtForm.action, {
            method: "POST",
            body: new FormData(thoughtForm),
            headers: { 'Accept': 'application/json' }
          });
          if (response.ok) {
            formMessage.textContent = "message sent";
            thoughtForm.reset();
          } else {
            formMessage.textContent = "message not sent";
          }
        } catch (err) {
          formMessage.textContent = "message not sent";
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
