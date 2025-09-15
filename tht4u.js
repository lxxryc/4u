const FIXED_DURATION = 30;  
    const THOUGHT_VERSION = "9:15:16:15.";  

    const THOUGHT_TEXT = {
      paragraphs: [
       "in life, you'll become the happiest version of yourself when you realize that you have no power over what they say or think. you only have power over what you say or do, or believe about yourself. because at the end of the day, you have no authority to change anyone's perspective or mind or view.",
       "you have no power over them. why? because it's their brain, their heart, their life. they can treat you well, they can treat you poorly. that's not up to you. all you can do is show up the way you want to show up. all you can do is love the way you want to love. all you can do is be the person you authentically are, and let that be what plays the card out.",
       "i can't stress this enough: we can't change what people say, we can't change what people do. but we can change how we interact with them. we can change the access they have to us. we can change the perspective we have of them, because we often put people on such high pedestals that even when they're terrible to us we convince ourselves they’re good.",
       "but just because we want something to be true, doesn’t mean it is. so i need you to understand this: you can’t change their mind, you can’t change their thought pattern, you can’t change what they desire. but you can absolutely change where you are in their lives.",
        
      ],
      author: "ry",
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
