const celebration = document.querySelector('.celebration');

document.querySelector('.intro-hint').addEventListener('click', () => {
  celebration.scrollIntoView({ behavior: 'smooth' });
});

const revealObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  celebration.classList.add('is-revealed');
  revealObserver.unobserve(celebration);
}, { threshold: 0.24 });

revealObserver.observe(celebration);
