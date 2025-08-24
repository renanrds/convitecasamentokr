document.addEventListener('DOMContentLoaded', () => {
    const contentPanel = document.querySelector('.content-panel');
    const polaroids = document.querySelectorAll('.polaroid');
    const scrollableContainer = document.querySelector('.scrollable');
    const backToTopButton = document.getElementById('back-to-top-btn');
    const quickLinks = document.querySelector('.quick-links');

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
                if (entry.target.id === 'nossa-historia') {
                    contentPanel.classList.add('is-visible');
                }
                
                const polaroidsInSection = entry.target.querySelectorAll('.polaroid');
                polaroidsInSection.forEach(polaroid => {
                    polaroid.classList.add('in-view');
                    polaroid.classList.remove('is-inspected');
                    const initialRotation = polaroid.dataset.rotation || 0;
                    polaroid.style.transform = `rotateZ(${initialRotation}deg) rotateY(0deg) scale(1)`;
                });

                sectionObserver.unobserve(entry.target);
            }
        });
    }, { 
        root: scrollableContainer, 
        threshold: 0.3 
    });
    
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });
    
    // --- LÓGICA DOS BOTÕES FLUTUANTES ---
    if (scrollableContainer) {
        scrollableContainer.addEventListener('scroll', () => {
            const shouldBeVisible = scrollableContainer.scrollTop > 400;
            
            if (backToTopButton) {
                backToTopButton.classList.toggle('visible', shouldBeVisible);
            }
            if (quickLinks) {
                quickLinks.classList.toggle('visible', shouldBeVisible);
            }
        });
    }

    // --- FUNÇÃO DO BOTÃO PIX E POP-UP DA JOJO ---
    function setupPixButton() {
        const copyButton = document.getElementById('copiar-chave');
        const pixKeyElement = document.getElementById('chave-pix');
        const jojoPopup = document.getElementById('jojo-popup');
        const jojoImage = document.getElementById('jojo-image');
        const jojoCaption = document.getElementById('jojo-caption');

        const jojoPhotos = [
            { src: 'images/20250330_172406.jpg', caption: 'Fiscal de PIX oficial. Pode mandar!' },
            { src: 'images/20230420_152420.jpg', caption: 'Só saio da gaveta se o presente for bom.' },
            { src: 'images/20250514_204546.jpg', caption: 'Sua contribuição garante meu conforto. Grata.' },
            { src: 'images/20250210_131721.jpg', caption: 'Cansada depois de zerar a lista de presentes.' },
            { src: 'images/20240710_183310.jpg', caption: 'Até me arrumei pra ver esse PIX.' },
            { src: 'images/20250104_203659.jpg', caption: 'É sério que você ainda não contribuiu?' },
            { src: 'images/20230603_124214.jpg', caption: 'Juntando para uma coleira de grife.' },
            { src: 'images/20240427_155356.jpg', caption: 'Acha que essa vida boa se paga sozinha?' },
            { src: 'images/20240727_115650.jpg', caption: 'Com este look, mereço um PIX caprichado.' },
            { src: 'images/20240714_193227.jpg', caption: 'Tô de olho nessa sua transferência...' }
        ];
        
        if (copyButton && pixKeyElement) {
            const pixKey = pixKeyElement.textContent;
            copyButton.addEventListener('click', () => {
                // Lógica de copiar a chave
                navigator.clipboard.writeText(pixKey).then(() => {
                    copyButton.textContent = 'Copiado!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copiar Chave';
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar a chave PIX: ', err);
                });

                // Lógica do pop-up da Jojo
                if (jojoPopup) {
                    // Escolhe uma foto e legenda aleatória
                    const randomJojo = jojoPhotos[Math.floor(Math.random() * jojoPhotos.length)];
                    jojoImage.src = randomJojo.src;
                    jojoCaption.textContent = randomJojo.caption;
                    
                    // Mostra o pop-up
                    jojoPopup.classList.add('show');

                    // Esconde o pop-up depois de alguns segundos
                    setTimeout(() => {
                        jojoPopup.classList.remove('show');
                    }, 2500); // O pop-up ficará visível por 2.5 segundos
                }
            });
        }
    }
    setupPixButton();

    // --- FUNÇÃO PARA O FORMULÁRIO DE CONFIRMAÇÃO ---
    function setupConfirmationForm() {
        const form = document.getElementById('rsvp-form');
        const thankYouMessageDiv = document.getElementById('thank-you-message');
        const storageKey = 'guestConfirmationData';
        const hiddenIframe = document.getElementById('hidden_iframe');
        let formSubmitted = false;

        function showThankYouMessage(name) {
            thankYouMessageDiv.innerHTML = `<p>Obrigado por confirmar, <span class="guest-name">${name}</span>! Sua presença é muito importante para nós. Mal podemos esperar para celebrar com você!</p>`;
            form.style.display = 'none';
            thankYouMessageDiv.style.display = 'block';
        }

        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            const guestData = JSON.parse(savedData);
            showThankYouMessage(guestData.name);
        }

        form.addEventListener('submit', (e) => {
            const guestNameInput = document.getElementById('guest-name');
            const guestName = guestNameInput.value.trim();

            if (guestName) {
                formSubmitted = true;
                const guestData = { 
                    name: guestName, 
                    confirmedAt: new Date().toISOString() 
                };
                localStorage.setItem(storageKey, JSON.stringify(guestData));
            } else {
                e.preventDefault(); 
                alert('Por favor, digite seu nome para confirmar.');
            }
        });

        hiddenIframe.addEventListener('load', () => {
            if (formSubmitted) {
                const savedData = JSON.parse(localStorage.getItem(storageKey));
                if (savedData && savedData.name) {
                    showThankYouMessage(savedData.name);
                }
            }
        });
    }
    setupConfirmationForm();

    // --- INICIALIZADOR DOS TOOLTIPS DO BOOTSTRAP ---
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

});