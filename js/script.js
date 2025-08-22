document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o carrossel
    initCarousel();
    
    // Configurar o botão do Google Maps
    setupMapsButton();
    
    // Configurar botões de compartilhamento
    setupSocialSharing();
    
    // Configurar o formulário de contato
    setupContactForm();
    
    // Atualizar a data do cardápio
    updateMenuDate();
    
    // Inicializar sistema de avaliações
    initReviewSystem();
});

/**
 * Inicializa o carrossel de imagens com funcionalidades avançadas
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoSlideInterval;
    
    // Ajustar posição das legendas
    const adjustCaptions = () => {
        slides.forEach(slide => {
            const caption = slide.querySelector('.carousel-caption');
            if (caption) {
                const imgHeight = slide.querySelector('img').offsetHeight;
                caption.style.bottom = '0';
            }
        });
    };
    
    // Ajustar legendas quando a janela for redimensionada
    window.addEventListener('resize', adjustCaptions);
    
    // Ajustar legendas na inicialização
    setTimeout(adjustCaptions, 100);
    
    // Criar indicadores de slide
    function createIndicators() {
        if (slides.length <= 1) return;
        
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        
        for (let i = 0; i < slides.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Slide ${i + 1}`);
            indicator.dataset.slideIndex = i;
            
            if (i === 0) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
                resetAutoSlide();
            });
            
            indicatorsContainer.appendChild(indicator);
        }
        
        carousel.appendChild(indicatorsContainer);
    }
    
    // Função para mostrar o slide atual
    function showSlide(index) {
        // Esconder todos os slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Mostrar o slide atual
        slides[index].classList.add('active');
        
        // Atualizar indicadores
        const indicators = document.querySelectorAll('.carousel-indicator');
        if (indicators.length > 0) {
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }
    
    // Função para ir para o próximo slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }
    
    // Função para ir para o slide anterior
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }
    
    // Reiniciar o temporizador do carrossel automático
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    // Configurar eventos de toque para dispositivos móveis
    function setupTouchEvents() {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    // Processar o gesto de deslize
    function handleSwipe() {
        const swipeThreshold = 50; // Mínimo de pixels para considerar um swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > swipeThreshold) {
            // Swipe para a direita - slide anterior
            prevSlide();
            resetAutoSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Swipe para a esquerda - próximo slide
            nextSlide();
            resetAutoSlide();
        }
    }
    
    // Adicionar event listeners aos botões
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
        
        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }
    
    // Adicionar teclas de navegação
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });
    
    // Pausar o carrossel quando o mouse estiver sobre ele
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        resetAutoSlide();
    });
    
    // Inicializar
    createIndicators();
    setupTouchEvents();
    
    // Iniciar o carrossel automático
    autoSlideInterval = setInterval(nextSlide, 5000);
}

/**
 * Configura o botão "Como Chegar" para abrir o Google Maps
 */
function setupMapsButton() {
    const mapsButton = document.getElementById('maps-button');
    
    if (mapsButton) {
        mapsButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Coordenadas do restaurante (substitua com as coordenadas reais)
            const latitude = -23.550520;
            const longitude = -46.633308;
            
            // Nome do restaurante para a busca
            const restaurantName = 'Buffet Livre Lar do Ma';
            
            // Criar a URL do Google Maps
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName)}&ll=${latitude},${longitude}`;
            
            // Verificar se está em um dispositivo móvel
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Em dispositivos móveis, tentar abrir no aplicativo nativo do Maps
                const mapsAppUrl = `geo:${latitude},${longitude}?q=${encodeURIComponent(restaurantName)}`;
                
                // Criar um elemento temporário para tentar abrir o app nativo
                const link = document.createElement('a');
                link.href = mapsAppUrl;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Fallback para o Google Maps no navegador após um pequeno delay
                setTimeout(() => {
                    window.open(mapsUrl, '_blank');
                }, 500);
            } else {
                // Em desktop, abrir no navegador
                window.open(mapsUrl, '_blank');
            }
        });
    }
}

/**
 * Atualiza a data do cardápio para o dia atual e destaca o preço correspondente ao dia
 */
function updateMenuDate() {
    const dateElement = document.querySelector('.date');
    const priceItems = document.querySelectorAll('.price-item');
    
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedDate = today.toLocaleDateString('pt-BR', options);
        
        // Capitalizar a primeira letra
        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        
        dateElement.textContent = capitalizedDate;
        
        // Destacar o preço correspondente ao dia da semana
        const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        
        if (priceItems && priceItems.length >= 2) {
            // Resetar estilos
            priceItems.forEach(item => {
                item.style.transform = 'scale(1)';
                item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            });
            
            // Destacar o preço atual (dias de semana = 2-6, final de semana = 0-1)
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const highlightIndex = isWeekend ? 1 : 0; // 0 = dias de semana, 1 = final de semana
            
            priceItems[highlightIndex].style.transform = 'scale(1.05)';
            priceItems[highlightIndex].style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }
    }
}

/**
 * Configura os botões de compartilhamento nas redes sociais
 */
function setupSocialSharing() {
    const whatsappButton = document.getElementById('share-whatsapp');
    const facebookButton = document.getElementById('share-facebook');
    const twitterButton = document.getElementById('share-twitter');
    
    const pageTitle = 'Cardápio do Buffet Livre Lar do Ma';
    const pageUrl = window.location.href;
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            e.preventDefault();
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' - ' + pageUrl)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    if (facebookButton) {
        facebookButton.addEventListener('click', function(e) {
            e.preventDefault();
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            window.open(facebookUrl, '_blank');
        });
    }
    
    if (twitterButton) {
        twitterButton.addEventListener('click', function(e) {
            e.preventDefault();
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
            window.open(twitterUrl, '_blank');
        });
    }
}

/**
 * Configura o formulário de contato
 */
function setupContactForm() {
    const form = document.getElementById('reservation-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter os valores do formulário
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Aqui você normalmente enviaria os dados para um servidor
            // Como este é um exemplo, apenas mostraremos um alerta
            alert(`Obrigado ${name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`);
            
            // Limpar o formulário
            form.reset();
        });
    }
}

/**
 * Sistema de avaliações dinâmico
 */
function initReviewSystem() {
    const reviewsContainer = document.querySelector('.testimonials-container');
    const reviewForm = document.getElementById('review-form');
    
    // Avaliações iniciais (simulando dados de um banco de dados)
    const initialReviews = [
        {
            name: 'Maria Silva',
            rating: 5,
            comment: 'Comida deliciosa e ambiente acolhedor. Recomendo o buffet de sobremesas!',
            date: '10/05/2023'
        },
        {
            name: 'João Oliveira',
            rating: 4,
            comment: 'Ótima variedade de pratos. Os grelhados são excelentes.',
            date: '22/06/2023'
        },
        {
            name: 'Ana Costa',
            rating: 5,
            comment: 'Melhor buffet da região! Sempre volto com a família.',
            date: '15/07/2023'
        }
    ];
    
    // Função para renderizar as estrelas de avaliação
    function renderStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }
    
    // Função para renderizar uma avaliação
    function renderReview(review) {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'testimonial';
        reviewElement.innerHTML = `
            <div class="testimonial-header">
                <h4>${review.name}</h4>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="rating">${renderStars(review.rating)}</div>
            <p>${review.comment}</p>
        `;
        return reviewElement;
    }
    
    // Função para renderizar todas as avaliações
    function renderAllReviews() {
        // Limpar o container de avaliações, mantendo apenas o título
        const testimonialsTitle = reviewsContainer.querySelector('h2');
        reviewsContainer.innerHTML = '';
        reviewsContainer.appendChild(testimonialsTitle);
        
        // Adicionar formulário de avaliação
        if (!document.getElementById('review-form')) {
            const formHTML = `
                <div class="review-form-container">
                    <h3>Deixe sua avaliação</h3>
                    <form id="review-form" class="review-form">
                        <div class="form-group">
                            <label for="reviewer-name">Nome:</label>
                            <input type="text" id="reviewer-name" required>
                        </div>
                        <div class="form-group">
                            <label>Avaliação:</label>
                            <div class="star-rating">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                                <input type="hidden" id="rating-value" value="0" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="review-comment">Comentário:</label>
                            <textarea id="review-comment" rows="3" required></textarea>
                        </div>
                        <button type="submit" class="submit-button">Enviar Avaliação</button>
                    </form>
                </div>
            `;
            const formContainer = document.createElement('div');
            formContainer.innerHTML = formHTML;
            reviewsContainer.appendChild(formContainer);
        }
        
        // Criar container para as avaliações
        const reviewsList = document.createElement('div');
        reviewsList.className = 'testimonials-list';
        
        // Obter avaliações do localStorage ou usar as iniciais
        const savedReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || initialReviews;
        
        // Adicionar cada avaliação ao container
        savedReviews.forEach(review => {
            reviewsList.appendChild(renderReview(review));
        });
        
        reviewsContainer.appendChild(reviewsList);
        
        // Configurar o formulário de avaliação
        setupReviewForm();
    }
    
    // Configurar o formulário de avaliação
    function setupReviewForm() {
        const reviewForm = document.getElementById('review-form');
        const stars = document.querySelectorAll('.star-rating i');
        
        // Configurar a interação com as estrelas
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                highlightStars(rating);
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = document.getElementById('rating-value').value;
                highlightStars(currentRating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                document.getElementById('rating-value').value = rating;
                highlightStars(rating);
            });
        });
        
        // Função para destacar as estrelas
        function highlightStars(rating) {
            stars.forEach(star => {
                if (star.dataset.rating <= rating) {
                    star.className = 'fas fa-star';
                } else {
                    star.className = 'far fa-star';
                }
            });
        }
        
        // Configurar o envio do formulário
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('reviewer-name').value;
                const rating = parseInt(document.getElementById('rating-value').value);
                const comment = document.getElementById('review-comment').value;
                
                if (rating === 0) {
                    alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
                    return;
                }
                
                // Criar nova avaliação
                const newReview = {
                    name: name,
                    rating: rating,
                    comment: comment,
                    date: new Date().toLocaleDateString('pt-BR')
                };
                
                // Salvar no localStorage
                const savedReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || initialReviews;
                savedReviews.unshift(newReview); // Adicionar no início da lista
                localStorage.setItem('restaurantReviews', JSON.stringify(savedReviews));
                
                // Atualizar a exibição
                renderAllReviews();
                
                // Mostrar confirmação
                alert('Obrigado pela sua avaliação!');
            });
        }
    }
    
    // Inicializar o sistema de avaliações
    if (reviewsContainer) {
        renderAllReviews();
    }
}