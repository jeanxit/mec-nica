// Menu hambúrguer responsivo
const hamburger = document.getElementById("hamburger")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebarOverlay")
const closeSidebarBtn = document.getElementById("closeSidebar")

function openSidebar() {
  sidebar.classList.add("open")
  hamburger.classList.add("active")
  sidebarOverlay.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeSidebar() {
  sidebar.classList.remove("open")
  hamburger.classList.remove("active")
  sidebarOverlay.style.display = "none"
  document.body.style.overflow = ""
}

hamburger.addEventListener("click", openSidebar)
closeSidebarBtn.addEventListener("click", closeSidebar)
sidebarOverlay.addEventListener("click", closeSidebar)

// Fecha sidebar ao clicar em link (mobile)
window.closeSidebar = closeSidebar

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Animação de entrada dos cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observar cards para animação
document.querySelectorAll(".card").forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(30px)"
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(card)
})

// Header scroll effect
let lastScrollTop = 0
const header = document.querySelector(".header")

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    header.style.transform = "translateY(-100%)"
  } else {
    // Scrolling up
    header.style.transform = "translateY(0)"
  }

  lastScrollTop = scrollTop

  // Show/hide back to top button based on scroll position
  const backToTopButton = document.getElementById("backToTop")
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("visible")
  } else {
    backToTopButton.classList.remove("visible")
  }
})

// Smooth scroll to top when back to top button is clicked
const backToTopButton = document.getElementById("backToTop")
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Form submission
const form = document.querySelector(".contato-form")
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Simular envio do formulário
    const button = form.querySelector(".btn-red")
    const originalText = button.innerHTML

    button.innerHTML = "<span>Enviando...</span>"
    button.disabled = true

    setTimeout(() => {
      button.innerHTML = "<span>Mensagem Enviada!</span>"
      setTimeout(() => {
        button.innerHTML = originalText
        button.disabled = false
        form.reset()
      }, 2000)
    }, 1500)
  })
}
