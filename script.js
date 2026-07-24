const celebration = document.querySelector('.celebration');

document.querySelector('.intro-hint').addEventListener('click', () => {
  celebration.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.save-button').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const originalLabel = button.lastChild.textContent;
  let printableCard;
  let pdfBack;
  const previewWindow = window.open('', '_blank');

  button.disabled = true;
  button.lastChild.textContent = ' Preparing PDF…';

  try {
    if (!window.html2canvas || !window.jspdf) throw new Error('PDF libraries unavailable');

    printableCard = document.querySelector('.celebration').cloneNode(true);
    printableCard.className = 'celebration pdf-card';
    document.body.appendChild(printableCard);

    const canvas = await window.html2canvas(printableCard, {
      backgroundColor: '#f5f5f7',
      scale: 2,
      useCORS: true,
    });
    const pdf = new window.jspdf.jsPDF({ format: 'letter', unit: 'in' });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 8.5, 11);

    pdfBack = document.createElement('section');
    pdfBack.className = 'pdf-back';
    pdfBack.innerHTML = `<article class="pdf-paper"><p>${revealText}</p><p class="pdf-signature">– Jay</p></article>`;
    document.body.appendChild(pdfBack);
    await document.fonts?.ready;

    const backCanvas = await window.html2canvas(pdfBack, {
      backgroundColor: '#dcecff',
      scale: 2,
      useCORS: true,
    });
    pdf.addPage('letter', 'portrait');
    pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, 8.5, 11);

    const pdfUrl = URL.createObjectURL(pdf.output('blob'));
    if (previewWindow) {
      previewWindow.location.href = pdfUrl;
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 120000);
    } else {
      const download = document.createElement('a');
      download.href = pdfUrl;
      download.download = 'Kavya-graduation-card.pdf';
      download.click();
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 120000);
    }
  } catch (error) {
    previewWindow?.close();
    window.print();
  } finally {
    printableCard?.remove();
    pdfBack?.remove();
    button.disabled = false;
    button.lastChild.textContent = originalLabel;
  }
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
