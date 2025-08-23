document.addEventListener('DOMContentLoaded', () => {
    const contentPanel = document.querySelector('.content-panel');
    const polaroids = document.querySelectorAll('.polaroid');
    const scrollableContainer = document.querySelector('.scrollable');

    // Lógica para arrastar e virar os polaroids
    polaroids.forEach(polaroid => {
        const initialRotation = polaroid.dataset.rotation || 0;
        let isDragging = false, hasDragged = false;
        let startX = 0, startY = 0;
        let currentX = 0, currentY = 0, initialX = 0, initialY = 0;
        const dragThreshold = 5;

        polaroid.style.transform = `rotateZ(${initialRotation}deg) rotateY(0deg) scale(0.8)`;

        function applyTransform() {
            let transform;
            if (polaroid.classList.contains('is-inspected')) {
                transform = `translate(${currentX}px, ${currentY}px) rotateY(180deg) rotateZ(0deg) scale(1.1)`;
            } else {
                transform = `translate(${currentX}px, ${currentY}px) rotateZ(${initialRotation}deg) rotateY(0deg)`;
            }
            polaroid.style.transform = transform;
        }

        function startInteraction(e) {
            e.preventDefault();
            hasDragged = false;
            isDragging = true;
            startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
            startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
            initialX = currentX;
            initialY = currentY;
        }

        function moveInteraction(e) {
            if (!isDragging) return;
            e.preventDefault();
            const moveX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
            const moveY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
            if (!hasDragged && (Math.abs(moveX - startX) > dragThreshold || Math.abs(moveY - startY) > dragThreshold)) {
                hasDragged = true;
                polaroid.classList.add('is-dragging');
            }
            if (hasDragged) {
                currentX = initialX + (moveX - startX);
                currentY = initialY + (moveY - startY);
                applyTransform();
            }
        }

        function endInteraction() {
            if (!isDragging) return;
            isDragging = false;
            if (hasDragged) {
                polaroid.classList.remove('is-dragging');
            } else {
                polaroid.classList.toggle('is-inspected');
                applyTransform();
            }
        }

        polaroid.addEventListener("mousedown", startInteraction);
        polaroid.addEventListener("touchstart", startInteraction, { passive: false });
        document.addEventListener("mousemove", moveInteraction);
        document.addEventListener("touchmove", moveInteraction, { passive: false });
        document.addEventListener("mouseup", endInteraction);
        document.addEventListener("touchend", endInteraction);
    });

    // --- OBSERVER PARA ANIMAÇÕES DE ENTRADA ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animação do painel principal
                if (entry.target.id === 'nossa-historia') {
                    contentPanel.classList.add('is-visible');
                }
                
                // Animação dos polaroids dentro da seção visível
                const polaroidsInSection = entry.target.querySelectorAll('.polaroid');
                polaroidsInSection.forEach(polaroid => {
                    polaroid.classList.add('in-view');
                    polaroid.classList.remove('is-inspected'); // Reseta o estado
                    const initialRotation = polaroid.dataset.rotation || 0;
                    polaroid.style.transform = `rotateZ(${initialRotation}deg) rotateY(0deg) scale(1)`;
                });

                // Otimização: para de observar a seção uma vez que ela já foi animada
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { 
        root: scrollableContainer, 
        threshold: 0.3 // A animação começa quando 30% da seção está visível
    });
    
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });
    
    // --- FUNÇÃO DO BOTÃO PIX ---
    function setupPixButton() {
        const copyButton = document.getElementById('copiar-chave');
        const pixKeyElement = document.getElementById('chave-pix');
        
        if (copyButton && pixKeyElement) {
            const pixKey = pixKeyElement.textContent;
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(pixKey).then(() => {
                    copyButton.textContent = 'Copiado!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copiar Chave';
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar a chave PIX: ', err);
                });
            });
        }
    }
    setupPixButton();

});