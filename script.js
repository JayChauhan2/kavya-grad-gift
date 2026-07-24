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

const revealCopy = document.querySelector('#reveal-copy');
const revealText = revealCopy.textContent;
revealCopy.textContent = '';

const revealCharacters = [...revealText].map((character) => {
  const span = document.createElement('span');
  span.className = 'reveal-character';
  span.textContent = character;
  revealCopy.appendChild(span);
  return span;
});

const updateLetterReveal = () => {
  const section = document.querySelector('.letter-reveal');
  const sectionTop = section.getBoundingClientRect().top;
  const travel = section.offsetHeight;
  const progress = Math.min(1, Math.max(0, (window.innerHeight - sectionTop) / travel));
  revealCharacters.forEach((character, index) => {
    const amount = Math.min(1, Math.max(0, progress * revealCharacters.length - index));
    character.style.setProperty('--reveal', amount);
  });
};

window.addEventListener('scroll', updateLetterReveal, { passive: true });
window.addEventListener('resize', updateLetterReveal);
updateLetterReveal();
