class SphericalLayout {
            constructor() {
                this.sphere = document.getElementById('sphere');
                this.elements = [];
                this.isDragging = false;
                this.rotationX = 0;
                this.rotationY = 0;
                this.lastMouseX = 0;
                this.lastMouseY = 0;
                this.autoRotating = false;
                this.autoRotationId = null;
                this.radius = 180;

                this.init();
                this.setupEventListeners();
            }

            init() {
                // Créer des éléments disposés sur la sphère
                const numElements = 20;
                const colors = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
                ];

                for (let i = 0; i < numElements; i++) {
                    const element = document.createElement('div');
                    element.className = 'sphere-element';
                    element.textContent = i + 1;
                    element.style.background = colors[i % colors.length];

                    // Calculer les coordonnées sphériques
                    const phi = Math.acos(-1 + (2 * i) / numElements);
                    const theta = Math.sqrt(numElements * Math.PI) * phi;

                    // Convertir en coordonnées cartésiennes et centrer les éléments
                    const x = this.radius * Math.cos(theta) * Math.sin(phi);
                    const y = this.radius * Math.sin(theta) * Math.sin(phi);
                    const z = this.radius * Math.cos(phi);

                    // Calculer l'orientation selon la normale de la sphère
                    // La normale en un point de la sphère pointe vers l'extérieur
                    const normal = { x: x / this.radius, y: y / this.radius, z: z / this.radius };
                    
                    // Calculer les angles de rotation pour orienter l'élément selon la normale
                    const rotationY = Math.atan2(normal.x, normal.z) * (180 / Math.PI);
                    const rotationX = -Math.asin(normal.y) * (180 / Math.PI);

                    element.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
                    element.setAttribute('data-original-x', x);
                    element.setAttribute('data-original-y', y);
                    element.setAttribute('data-original-z', z);
                    element.setAttribute('data-rotation-x', rotationX);
                    element.setAttribute('data-rotation-y', rotationY);

                    this.sphere.appendChild(element);
                    this.elements.push(element);
                }

                this.updateSphereRotation();
            }

            setupEventListeners() {
                // Événements de souris
                this.sphere.addEventListener('mousedown', (e) => {
                    this.isDragging = true;
                    this.lastMouseX = e.clientX;
                    this.lastMouseY = e.clientY;
                    this.stopAutoRotation();
                    e.preventDefault();
                });

                document.addEventListener('mousemove', (e) => {
                    if (!this.isDragging) return;

                    const deltaX = e.clientX - this.lastMouseX;
                    const deltaY = e.clientY - this.lastMouseY;

                    this.rotationY += deltaX * 0.5;
                    this.rotationX -= deltaY * 0.5;

                    this.updateSphereRotation();

                    this.lastMouseX = e.clientX;
                    this.lastMouseY = e.clientY;
                });

                document.addEventListener('mouseup', () => {
                    this.isDragging = false;
                });

                // Événements tactiles pour mobile
                this.sphere.addEventListener('touchstart', (e) => {
                    this.isDragging = true;
                    this.lastMouseX = e.touches[0].clientX;
                    this.lastMouseY = e.touches[0].clientY;
                    this.stopAutoRotation();
                    e.preventDefault();
                });

                document.addEventListener('touchmove', (e) => {
                    if (!this.isDragging) return;

                    const deltaX = e.touches[0].clientX - this.lastMouseX;
                    const deltaY = e.touches[0].clientY - this.lastMouseY;

                    this.rotationY += deltaX * 0.5;
                    this.rotationX -= deltaY * 0.5;

                    this.updateSphereRotation();

                    this.lastMouseX = e.touches[0].clientX;
                    this.lastMouseY = e.touches[0].clientY;
                    e.preventDefault();
                });

                document.addEventListener('touchend', () => {
                    this.isDragging = false;
                });
            }

            updateSphereRotation() {
                this.sphere.style.transform = `rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
            }

            startAutoRotation() {
                if (this.autoRotating) return;
                
                this.autoRotating = true;
                const rotate = () => {
                    if (!this.autoRotating) return;
                    
                    this.rotationY += 0.5;
                    this.updateSphereRotation();
                    this.autoRotationId = requestAnimationFrame(rotate);
                };
                rotate();
            }

            stopAutoRotation() {
                this.autoRotating = false;
                if (this.autoRotationId) {
                    cancelAnimationFrame(this.autoRotationId);
                    this.autoRotationId = null;
                }
            }

            reset() {
                this.rotationX = 0;
                this.rotationY = 0;
                this.stopAutoRotation();
                this.updateSphereRotation();
            }

            randomizeColors() {
                const colors = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                    'linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)'
                ];

                this.elements.forEach(element => {
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    element.style.background = randomColor;
                });
            }
        }

        // Initialiser l'application
        const sphereLayout = new SphericalLayout();

        // Fonctions globales pour les boutons
        function autoRotate() {
            if (sphereLayout.autoRotating) {
                sphereLayout.stopAutoRotation();
            } else {
                sphereLayout.startAutoRotation();
            }
        }

        function resetRotation() {
            sphereLayout.reset();
        }

        function randomizeColors() {
            sphereLayout.randomizeColors();
        }

        // Effet de particules en arrière-plan
        function createStars() {
            const numStars = 100;
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.style.position = 'absolute';
                star.style.width = Math.random() * 2 + 'px';
                star.style.height = star.style.width;
                star.style.background = 'rgba(255,255,255,' + Math.random() * 0.8 + ')';
                star.style.borderRadius = '50%';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animation = `twinkle ${Math.random() * 4 + 2}s infinite`;
                document.body.appendChild(star);
            }
        }

        // Ajouter l'animation CSS pour les étoiles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        createStars();