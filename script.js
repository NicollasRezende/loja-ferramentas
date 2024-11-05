// Configurações
const CONFIG = {
    carouselAutoplaySpeed: 5000,
    animationThreshold: 0.1,
    testimonials: [
        {
            name: 'João Silva',
            role: 'Construtor',
            text: 'Excelentes ferramentas, durabilidade incomparável.',
            rating: 5,
        },
        {
            name: 'Maria Oliveira',
            role: 'Arquiteta',
            text: 'Ferramentas de alta qualidade que facilitam meu trabalho.',
            rating: 4,
        },
        {
            name: 'Carlos Pereira',
            role: 'Engenheiro',
            text: 'Ótimo custo-benefício e atendimento excelente.',
            rating: 5,
        },
        {
            name: 'Ana Souza',
            role: 'Designer de Interiores',
            text: 'Variedade incrível de produtos, sempre encontro o que preciso.',
            rating: 4,
        },
        {
            name: 'Pedro Lima',
            role: 'Marceneiro',
            text: 'As ferramentas são robustas e duráveis, recomendo!',
            rating: 5,
        },
        {
            name: 'Fernanda Costa',
            role: 'Paisagista',
            text: 'Entrega rápida e produtos de qualidade, estou muito satisfeita.',
            rating: 4,
        },
        {
            name: 'Rafael Almeida',
            role: 'Eletricista',
            text: 'Ferramentas confiáveis e com ótimo desempenho.',
            rating: 5,
        },
    ],
};

// Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.content').classList.toggle('shifted');
});

// Fechar Sidebar
document.querySelector('.close-sidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('.content').classList.remove('shifted');
});

// Classe Carrossel Melhorada
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.container = element.querySelector('.carousel-container');
        this.items = element.querySelectorAll('.carousel-item');
        this.prev = element.querySelector('.carousel-prev');
        this.next = element.querySelector('.carousel-next');
        this.currentIndex = 0;
        this.totalItems = this.items.length;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        this.prev.addEventListener('click', () => this.move('prev'));
        this.next.addEventListener('click', () => this.move('next'));
        this.startAutoplay();

        // Touch events para mobile
        let touchStartX = 0;
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                this.move(diff > 0 ? 'next' : 'prev');
            }
        });
    }

    move(direction) {
        this.stopAutoplay();

        if (direction === 'prev') {
            this.currentIndex =
                (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        }

        this.updateCarousel();
        this.startAutoplay();
    }

    updateCarousel() {
        this.container.style.transform = `translateX(-${
            this.currentIndex * 100
        }%)`;
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(
            () => this.move('next'),
            CONFIG.carouselAutoplaySpeed
        );
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
}

// Sistema de Depoimentos
class TestimonialsManager {
    constructor(container, testimonials) {
        this.container = container;
        this.testimonials = testimonials;
        this.currentIndex = 0;

        this.render();
        this.startRotation();
    }

    render() {
        const testimonial = this.testimonials[this.currentIndex];
        this.container.innerHTML = `
            <div class="testimonial-card animate-up">
                <div class="testimonial-rating">
                    ${this.generateStars(testimonial.rating)}
                </div>
                <p>${testimonial.text}</p>
                <div class="testimonial-author">
                    <strong>${testimonial.name}</strong>
                    <span>${testimonial.role}</span>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        return Array(5)
            .fill('')
            .map(
                (_, i) => `<i class="fas fa-star${i < rating ? '' : '-o'}"></i>`
            )
            .join('');
    }

    startRotation() {
        setInterval(() => {
            this.currentIndex =
                (this.currentIndex + 1) % this.testimonials.length;
            this.render();
        }, 5000);
    }
}

// Formulário de Contato
class ContactForm {
    constructor(formElement) {
        this.form = formElement;
        this.setupListeners();
    }

    setupListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        try {
            this.setLoadingState(true);
            // Simulação de envio para API
            await this.simulateApiCall(data);
            this.showMessage('success', 'Mensagem enviada com sucesso!');
            this.form.reset();
        } catch (error) {
            this.showMessage(
                'error',
                'Erro ao enviar mensagem. Tente novamente.'
            );
            console.error('Erro:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading
            ? '<i class="fas fa-spinner fa-spin"></i> Enviando...'
            : 'Enviar';
    }

    showMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${
                type === 'success' ? 'check-circle' : 'exclamation-circle'
            }"></i>
            ${text}
        `;

        this.form.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
    }

    async simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), 1500);
        });
    }
}

// Sistema de Carrinho
class CartManager {
    constructor() {
        this.cart = [];
        this.cartCount = document.querySelector('.cart-count');
        this.setupListeners();
    }

    setupListeners() {
        document.querySelectorAll('.add-to-cart').forEach((button) => {
            button.addEventListener('click', (e) => this.addToCart(e));
        });
    }

    addToCart(e) {
        const productCard = e.target.closest('.product-card');
        const product = {
            id: productCard.dataset.id,
            name: productCard.querySelector('h3').textContent,
            price: parseFloat(
                productCard
                    .querySelector('.price')
                    .textContent.replace('R$ ', '')
            ),
            quantity: 1,
        };

        const existingItem = this.cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push(product);
        }

        this.updateCartUI();
        this.showAddedAnimation(e.target);
    }

    updateCartUI() {
        const totalItems = this.cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
        this.cartCount.textContent = totalItems;
        this.cartCount.classList.add('bounce');
        setTimeout(() => this.cartCount.classList.remove('bounce'), 300);
    }

    showAddedAnimation(button) {
        button.classList.add('added');
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = 'Adicionar ao Carrinho';
        }, 2000);
    }
}

// Sistema de Tema
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.setupListeners();
        this.loadSavedTheme();
    }

    setupListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = this.themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
        this.saveTheme();
    }

    saveTheme() {
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const icon = this.themeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// Inicialização dos componentes
document.addEventListener('DOMContentLoaded', () => {
    new Carousel(document.querySelector('.carousel'));
    new TestimonialsManager(
        document.querySelector('.testimonials-container'),
        CONFIG.testimonials
    );
    new ContactForm(document.querySelector('#contact-form'));
    new CartManager();
    new ThemeManager();
});
