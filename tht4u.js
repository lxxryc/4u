const FIXED_DURATION = 60;  
    const THOUGHT_VERSION = "9:16:23:03.";  

    const THOUGHT_TEXT = {
      paragraphs: [
       "stop feeling bad for doing what you had to do in a place that you tried to do everything in. stop feeling bad for having to walk away from a situation, from a person, from a place, from a thing that you gave so much of yourself to, and nothing was ever given back to you.",
       "you have to stop feeling bad for doing the best thing for you, for doing the thing that's gonna serve you, for doing the thing that seems hard right now but is actually the best possible choice for your life.",
       "sometimes we feel bad because we think that if we keep trying, or keep pushing, or keep working, that one day they'll finally see what we offer, see who we are. but in the process, you end up breaking your own heart trying to force people into places they clearly don't want to be.",
       "stop feeling bad for doing what's right for you, because at the end of the day, the only person who's guaranteed to care about you is you. if you keep trying to force yourself to be smaller, little, or less than what you deserve just so somebody can stick around, you will continue to hate the person you've become—because it's not you.",
       "it's a diminished version of you that you kept holding onto, because you thought it was all you wanted or could ever have. and you can't keep hurting yourself just to get other people to like you.",
        
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
