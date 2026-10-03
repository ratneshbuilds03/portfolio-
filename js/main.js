const texts = [
  "Backend Developer",
  "Python Engineer",
  "FastAPI Specialist",
  "API Architect",
  "DevOps Enthusiast",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById("typing");

function type() {
  const currentText = texts[textIndex];

  if (!isDeleting) {
    typingEl.textContent = currentText.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typingEl.textContent = currentText.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
  }

  setTimeout(type, isDeleting ? 50 : 100);
}

type();

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".skill-category, .about-content, .about-stats")
  .forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    showStatus("Please fill all required fields", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector(".btn-text").style.display = "none";
  submitBtn.querySelector(".btn-loader").style.display = "inline";

  try {
    await emailjs.send(
      "service_gfidmw4",
      "template_61j2gej",
      {
        name: name,
        email: email,
        subject: subject,
        message: message,
      }
    );

    showStatus("✅ Message sent! I'll get back to you soon.", "success");
    form.reset();

  } catch (error) {
    console.error("EmailJS Error:", error);
    showStatus("❌ Message could not be sent. Please try again.", "error");

  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-text").style.display = "inline";
    submitBtn.querySelector(".btn-loader").style.display = "none";
  }
});


const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatNotification = document.getElementById("chat-notification");
const chatIcon = document.querySelector(".chat-icon");
const chatCloseIcon = document.querySelector(".chat-close-icon");


const CHAT_API_URL = "https://portfolio-3li6.onrender.com/chat";

let isChatOpen = false;


chatToggle.addEventListener("click", () => {
    isChatOpen = !isChatOpen;

    if (isChatOpen) {
        chatWindow.classList.add("open");
        chatIcon.style.display = "none";
        chatCloseIcon.style.display = "inline";
        chatNotification.style.display = "none";
        chatInput.focus();
    } else {
        chatWindow.classList.remove("open");
        chatIcon.style.display = "inline";
        chatCloseIcon.style.display = "none";
    }
});

chatClose.addEventListener("click", () => {
    isChatOpen = false;
    chatWindow.classList.remove("open");
    chatIcon.style.display = "inline";
    chatCloseIcon.style.display = "none";
});


chatSend.addEventListener("click", sendMessage);


chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function askQuick(question) {
    chatInput.value = question;
    sendMessage();
}


function getTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;

    messageDiv.innerHTML = `
        <div class="message-bubble">${text}</div>
        <div class="message-time">${getTime()}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing-indicator";
    typingDiv.id = "typing-indicator";
    typingDiv.innerHTML = `
        <div class="message-bubble">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
}


function renderQuickQuestions() {
    const existing = document.querySelector(".quick-questions");
    if (existing) existing.remove();

    const quick = document.createElement("div");
    quick.className = "quick-questions";
    quick.innerHTML = `
        <p class="quick-label">Quick Questions:</p>
        <button class="quick-btn" type="button" data-question="What are your top skills?">🔧 Top Skills</button>
        <button class="quick-btn" type="button" data-question="Tell me about MiniStream project">🚀 MiniStream</button>
        <button class="quick-btn" type="button" data-question="What technologies do you use?">💻 Tech Stack</button>
        <button class="quick-btn" type="button" data-question="Are you available for hire?">💼 Hire?</button>
    `;

    quick.querySelectorAll(".quick-btn").forEach((button) => {
        button.addEventListener("click", () => askQuick(button.dataset.question));
    });

    chatMessages.appendChild(quick);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    
    chatInput.value = "";
    chatSend.disabled = true;
    chatInput.disabled = true;

    
    const quickQ = document.querySelector(".quick-questions");
    if (quickQ) quickQ.remove();

    
    addMessage(message, "user");

    
    showTyping();

    try {
        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json().catch(() => ({}));

        removeTyping();

        if (!response.ok) {
            throw new Error(data.detail || data.reply || `Chat request failed (${response.status})`);
        }

        addMessage(data.reply || "I couldn't generate a response right now. Please try again.", "bot");
        renderQuickQuestions();

    } catch (error) {
        console.error("Chat API Error:", error);
        removeTyping();
        addMessage(
            "Sorry, the assistant is temporarily unavailable. You can contact Ratnesh at <a href='mailto:ratneshmakwana51@gmail.com' style='color:var(--accent)'>ratneshmakwana51@gmail.com</a>.",
            "bot"
        );
        renderQuickQuestions();
    } finally {
        chatSend.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}
function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
  setTimeout(() => {
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }, 5000);
}
