const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const appointmentForm = document.getElementById("appointmentForm");
const formMessage = document.getElementById("formMessage");
const revealElements = document.querySelectorAll(".reveal");
const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
const prevTestimonialButton = document.getElementById("prevTestimonial");
const nextTestimonialButton = document.getElementById("nextTestimonial");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

if (testimonialCards.length > 0) {
  let currentTestimonial = 0;

  const showTestimonial = (index) => {
    testimonialCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === index);
    });
  };

  const moveTestimonial = (direction) => {
    currentTestimonial =
      (currentTestimonial + direction + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
  };

  prevTestimonialButton?.addEventListener("click", () => moveTestimonial(-1));
  nextTestimonialButton?.addEventListener("click", () => moveTestimonial(1));

  // Rotate testimonials automatically for a smoother homepage experience.
  setInterval(() => moveTestimonial(1), 5000);
}

if (appointmentForm && formMessage) {
  appointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      date: document.getElementById("date").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.department ||
      !formData.date ||
      !formData.message
    ) {
      formMessage.textContent = "Please complete all appointment fields.";
      return;
    }

    const phonePattern = /^[0-9+\-\s]{10,15}$/;
    if (!phonePattern.test(formData.phone)) {
      formMessage.textContent = "Please enter a valid phone number.";
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Unable to submit appointment request.");
      }

      formMessage.textContent =
        "Appointment request submitted successfully. The hospital team will contact you soon.";
      appointmentForm.reset();
    } catch (error) {
      formMessage.textContent =
        "Appointment request could not be submitted right now. Please call +91 8808456820.";
    }
  });
}
