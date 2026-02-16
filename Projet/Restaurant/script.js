// ============================================
// ENTRÉE 3D AVEC THREE.JS
// ============================================

// Configuration
const loadingScreen = document.getElementById('loadingScreen');
const hero3DContainer = document.getElementById('hero3DContainer');
const enterBtn = document.getElementById('enterBtn');
const mainContent = document.getElementById('mainContent');
const canvas = document.getElementById('canvas3d');
const goldParticles = document.getElementById('goldParticles');

let scene, camera, renderer, particles3D, logo3D;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// Initialiser Three.js
function init3DScene() {
    // Créer la scène
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    // Créer la caméra
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 15;

    // Créer le renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);

    // Ajouter des lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xD4AF37, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFD700, 1.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const spotLight = new THREE.SpotLight(0xD4AF37, 3);
    spotLight.position.set(0, 20, 15);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    // Créer un groupe de particules 3D dorées
    createGoldParticles();

    // Créer des formes géométriques dorées
    createGoldenShapes();

    // Démarrer l'animation
    animate3D();
}

// Créer des particules 3D dorées
function createGoldParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles3D = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles3D);
}

// Créer des formes géométriques dorées
function createGoldenShapes() {
    // Torus (cercle doré)
    const torusGeometry = new THREE.TorusGeometry(3, 0.1, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xD4AF37,
        emissiveIntensity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = Math.PI / 4;
    torus.position.z = -5;
    scene.add(torus);
    logo3D = torus;

    // Ajouter des anneaux supplémentaires
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(5 + i * 1.5, 0.05, 8, 50);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xB8860B,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.4 - i * 0.1
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 4 + (i * 0.1);
        ring.rotation.y = i * 0.3;
        ring.position.z = -5;
        scene.add(ring);
    }

    // Ajouter des sphères dorées
    for (let i = 0; i < 5; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 1,
            roughness: 0,
            emissive: 0xD4AF37,
            emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        const angle = (i / 5) * Math.PI * 2;
        const radius = 4;
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.y = Math.sin(angle) * radius;
        sphere.position.z = -3;
        
        scene.add(sphere);
    }
}

// Animation de la scène 3D
function animate3D() {
    requestAnimationFrame(animate3D);

    // Rotation du logo principal
    if (logo3D) {
        logo3D.rotation.y += 0.01;
        logo3D.rotation.z += 0.005;
    }

    // Animation des particules
    if (particles3D) {
        particles3D.rotation.y += 0.001;
        particles3D.rotation.x += 0.0005;
    }

    // Parallaxe avec la souris
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.5;
    camera.position.y = -targetY * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Écouter le mouvement de la souris pour le parallaxe
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

// Générer des particules HTML dorées
function createHTMLGoldParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-gold';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        goldParticles.appendChild(particle);
    }
}

// Simuler le chargement - Afficher l'intro à chaque actualisation mais pas lors de navigation interne
window.addEventListener('load', () => {
    // Vérifier si on vient d'une navigation interne (depuis une autre page du site)
    const isInternalNavigation = sessionStorage.getItem('isInternalNavigation');
    
    if (isInternalNavigation === 'true') {
        // Navigation interne : masquer directement l'intro et afficher le contenu
        loadingScreen.style.display = 'none';
        hero3DContainer.style.display = 'none';
        mainContent.classList.add('visible');
        // Réinitialiser le flag
        sessionStorage.removeItem('isInternalNavigation');
    } else {
        // Actualisation ou première visite : afficher l'intro normalement
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Initialiser la scène 3D après le chargement
            if (canvas) {
                init3DScene();
                createHTMLGoldParticles();
            }
        }, 2500);
    }
});

// Bouton d'entrée
if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        // Marquer qu'on a passé l'intro (pour la navigation interne)
        sessionStorage.setItem('isInternalNavigation', 'true');
        
        // Animation de transition
        hero3DContainer.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        hero3DContainer.style.opacity = '0';
        hero3DContainer.style.transform = 'scale(1.1)';

        setTimeout(() => {
            hero3DContainer.style.display = 'none';
            mainContent.classList.add('visible');
            window.scrollTo(0, 0);
        }, 1500);
    });
}

// Responsive - redimensionner la scène
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Marquer la navigation interne quand on clique sur les liens du menu
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Si on clique sur un lien autre que l'accueil actuel, marquer la navigation interne
            if (!link.classList.contains('active') || link.getAttribute('href') !== 'index.html') {
                sessionStorage.setItem('isInternalNavigation', 'true');
            }
        });
    });
    
    // Aussi pour le logo qui peut ramener à l'accueil
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            sessionStorage.setItem('isInternalNavigation', 'true');
        });
    }
});

// ============================================
// FIN ENTRÉE 3D
// ============================================

// Fonction pour réinitialiser l'intro (appeler resetIntro() dans la console pour revoir l'intro)
window.resetIntro = function() {
    localStorage.removeItem('hasSeenIntro');
    console.log('✅ Intro réinitialisée ! Rechargez la page pour la revoir.');
};

// Données des plats
const menuData = [
    // Entrées
    {
        id: 1,
        name: "Salade César",
        description: "Salade fraîche avec poulet grillé, parmesan et croûtons",
        price: 30.00,
        category: "entrees",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Soupe à l'oignon",
        description: "Soupe traditionnelle française gratinée au fromage",
        price: 20.00,
        category: "entrees",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Bruschetta",
        description: "Pain grillé avec tomates fraîches, basilic et huile d'olive",
        price: 20.00,
        category: "entrees",
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Salade Capresse",
        description: "Tomates, mozzarella fraîche et basilic arrosés d'huile d'olive.",
        price: 25.00,
        category: "entrees",
        image: "https://www.recettes.com/wp-content/uploads/2025/04/salade-caprese-mozzarella-aux-tomates-et-basilic-scaled.jpg"
    },
    {
        id: 5,
        name: "Tzatziki",
        description: "Yaourt grec frais au concombre et à l'ail.",
        price: 25.00,
        category: "entrees",
        image: "https://www.allrecipes.com/thmb/A7hvzxDejp12Qlu3ZkRkPcHbhIg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/145409_GreekTzatziki_ddmfs_2x1_3904-dfa1ed5c155645beaa4a5834afb618dc.jpg"
    },
    {
        id: 6,
        name: "Briouates au poulet",
        description: "Feuilletés croustillants farcis au poulet épicé.",
        price: 10.00,
        category: "entrees",
        image :"https://mesinspirationsculinaires.com/wp-content/uploads/2014/07/recette-briouates-maison-au-poulet-1.jpg"
    },
    {
        id: 7,
        name: "Nems au poulet",
        description: "Rouleaux croustillants farcis au poulet et légumes.",
        price: 30.00,
        category: "entrees",
        image: "https://adc-dev-images-recipes.s3.eu-west-1.amazonaws.com/REP_jl_1187_nems_cambodgienne_sauce_chili.JPG"
    },
    {
        id: 8,
        name: "Crouquettes de fromage",
        description: "Bouchées dorées au fromage.",
        price: 30.00,
        category: "entrees",
        image: "https://hainaut-terredegouts.be/wp-content/uploads/2021/11/shutterstock_1822339829.jpg"
    },
    
    // Plats principaux
    {
        id: 9,
        name: "Steak Frites",
        description: "Entrecôte grillée accompagnée de frites maison",
        price: 50.00,
        category: "plats",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop"
    },
    {
        id: 10,
        name: "Saumon Grillé",
        description: "Pavé de saumon avec légumes de saison",
        price: 60.00,
        category: "plats",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
    },
    {
        id: 11,
        name: "Poulet Rôti",
        description: "Poulet fermier rôti avec pommes de terre",
        price: 90.00,
        category: "plats",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop"
    },
    {
        id: 12,
        name: "Spaghetti Bolognaise",
        description: "Pâtes avec une sauce tomate riche à la viande hachée.",
        price: 45.00,
        category: "plats",
        image: "https://dxm.dam.savencia.com/api/wedia/dam/variation/fix635d9eidk9muu7yq33zuescmdts13b7bw94o/original/download"
    },
    {
        id: 13,
        name: "Tajine de bœuf aux légumes",
        description: "Plat marocain avec viande tendre et légumes.",
        price: 75.00,
        category: "plats",
        image: "https://i.ytimg.com/vi/lr2dM5WDzPQ/maxresdefault.jpg"
    },
    {
        id: 14,
        name: "Poulet rôti aux herbes",
        description: "Poulet tendre et juteux rôti au four avec pommes de terre et herbes aromatiques.",
        price: 80.00,
        category: "plats",
        image: "https://sf1.viepratique.fr/wp-content/uploads/sites/2/2014/06/shutterstock_157640480.jpg"
    },
     {
        id: 15,
        name: "Pâtes aux fruits de mer",
        description: "Pâtes fraîches de crevette et calamare.",
        price: 37.00,
        category: "plats",
        image: "https://backend.panzani.fr/app/uploads/2024/02/gettyimages-1184412289-min-scaled.jpg"
    },
     {
        id: 16,
        name: "Escalope de poulet à la crème",
        description: "Escalope tendre avec crème aux champignons et de riz.",
        price: 60.00,
        category: "plats",
        image: "https://img.cuisineaz.com/660x660/2023/04/04/i192193-escalopes-de-poulet-a-la-creme-et-champignons.webp"
    },
    
    
    // Pizzas
    {
        id: 17,
        name: "Pizza Margherita",
        description: "Sauce tomate, mozzarella, basilic frais",
        price: 40.00,
        category: "pizzas",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop"
    },
    {
        id: 18,
        name: "Pizza 4 Fromages",
        description: "Mozzarella, gorgonzola, parmesan, chèvre",
        price: 55.00,
        category: "pizzas",
        image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop"
    },
    {
        id: 19,
        name: "Pizza Pepperoni",
        description: "Sauce tomate, mozzarella, pepperoni épicé",
        price: 65.00,
        category: "pizzas",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop"
    },
     {
        id: 20,
        name: "Pizza Végétarienne",
        description: "Légumes grillés variés sur une base tomate et fromage.",
        price: 40.00,
        category: "pizzas",
        image: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/E3262F2D-E223-4172-BA55-46A609BD8240/Derivates/15442077-24d9-4fbc-b0ff-abb9244e28e4.jpg"
    },
    {
        id: 21,
        name: "Pizza Fruits de Mer",
        description: "Garnie de crevettes, calamars et moules sur sauce tomate.",
        price: 60.00,
        category: "pizzas",
        image: "https://lafrenchpizza.fr/wp-content/uploads/2024/04/pizza-aux-fruits-de-mer.jpg"
    },
    {
        id: 22,
        name: "Pizza Quatre Saisons",
        description: "Champignons, artichauts, jambon et olives répartis en quatre parties.",
        price: 60.00,
        category: "pizzas",
        image: "https://jesuisuncuisinier.fr/wp-content/uploads/2020/10/pizza-4-saisons.jpg"
    },
     {
        id: 23,
        name: "Pizza Poulet BBQ",
        description: "Base sauce barbecue garnie de poulet grillé, oignons, mozzarella fondante.",
        price: 35.00,
        category: "pizzas",
        image: "https://cdn.pratico-pratiques.com/app/uploads/sites/3/2024/05/02105538/Pizza-au-poulet-barbecue.jpg"
    },
    {
        id: 24,
        name: "Pizza Napoli",
        description: "Sauce tomate, mozzarella, anchois et olives noires au goût intense.",
        price: 70.00,
        category: "pizzas",
        image: "https://pekis.net/sites/default/files/styles/social_share_1200/public/2025-02/Napoli%20pizza.jpg?itok=NOGsMx-E"
    },
    // Burgers
    {
        id: 25,
        name: "Burger Classique",
        description: "Steak haché, salade, tomate, oignon, sauce maison",
        price: 40.00,
        category: "burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
    },
    {
        id: 26,
        name: "Burger Bacon",
        description: "Steak haché, bacon croustillant, cheddar, sauce BBQ",
        price: 50.00,
        category: "burgers",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop"
    },
    {
        id: 27,
        name: "Burger Végétarien",
        description: "Galette végétale, avocat, légumes grillés",
        price: 30.00,
        category: "burgers",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop"
    },
    {
        id: 28,
        name: "Cheeseburger Double",
        description: "Double steak, double fromage fondant et cornichons croquants.",
        price: 80.00,
        category: "burgers",
        image: "https://appetizing-cactus-7139e93734.media.strapiapp.com/large_Ultimate_Double_Cheeseburger_da3c3f6a9b.jpeg"
    },
    {
        id: 29,
        name: "Chicken Burger",
        description: "Filet de poulet croustillant, salade fraîche et sauce mayo.",
        price: 50.00,
        category: "burgers",
        image: "https://www.andy-cooks.com/cdn/shop/articles/20240831035715-andy-20cooks-20-20grilled-20chicken-20burger-20recipe_e0e5e1a7-cb37-48ba-bc46-a97780f32eaa.jpg?v=1725428110"
    },
    {
        id: 30,
        name: "Burger Royal",
        description: "Steak premium, fromage, œuf au plat et bacon croustillant.",
        price: 110.00,
        category: "burgers",
        image: "https://www.wurofood.com/_next/image?url=https%3A%2F%2Fwurofood.s3.eu-west-3.amazonaws.com%2Fuploads%2Flive%2Fwuro_1759690046_79vpyBrn9AIJaA4Qqdt0.jpg&w=3840&q=75"
    },
    {
        id: 31,
        name: "Burger Spécial",
        description: "Steak, œuf, fromage, salade et sauce spéciale du chef.",
        price: 120.00,
        category: "burgers",
        image: "https://www.favoritefoods.com/wp-content/uploads/2016/08/Burgers.png"
    },
    {
        id: 32,
        name: "Burger Mexicain",
        description: "Steak haché, fromage, jalapeños, salade et sauce épicée.",
        price: 65.00,
        category: "burgers",
        image: "https://cdn4.regie-agricole.com/ulf/CMS_Content/2/articles/841482/_MAXDEGENIE_BurgersGalettesMexicaines169-1000x562.jpg"
    },
    // Desserts
    {
        id: 33,
        name: "Tiramisu",
        description: "Dessert italien au café et mascarpone",
        price: 25.00,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop"
    },
    {
        id: 34,
        name: "Tarte Tatin",
        description: "Tarte aux pommes caramélisées",
        price: 18.00,
        category: "desserts",
        image: "https://i.pinimg.com/736x/ae/8b/73/ae8b7386ae3d85160557173e2d4d9f06.jpg"
    },
    {
        id: 35,
        name: "Crème Brûlée",
        description: "Crème vanille avec caramel croustillant",
        price: 19.00,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop"
    },
    {
        id: 36,
        name: "Cheesecake",
        description: "Dessert crémeux à base de fromage frais sur une croûte biscuitée.",
        price: 25.00,
        category: "desserts",
        image: "https://food-with-style.com/cdn/shop/articles/20250219142820-Berry-Cheesecake-DEsvNy9x2eK_ade69a5b-c5c0-47fb-b683-39129d89d8ba.png?v=1740018570&width=1024"
    },
    {
        id: 37,
        name: "Mousse au chocolat",
        description: "Dessert léger et aérien au chocolat noir.",
        price: 21.00,
        category: "desserts",
        image: "https://www.fromager.net/wp-content/uploads/2024/01/recette-mousse-au-chocolat.jpg"
    },
    {
        id: 38,
        name: "Panna cotta",
        description: "Crème italienne douce servie avec coulis de fruits.",
        price: 25.00,
        category: "desserts",
        image: "https://www.recipetineats.com/tachyon/2025/09/Panna-cotta_8-close-up.jpg?resize=500%2C500"
    },
     {
        id: 39,
        name: "Glace maison",
        description: "Différents parfums servis en boules ou en coupe.",
        price: 20.00,
        category: "desserts",
        image: "https://cdn.lacuisinedannie.com/images/390.jpg"
    },
     {
        id: 40,
        name: "Crêpes sucrées",
        description: "Crêpes fines garnies de sucre, chocolat ou fruits.",
        price: 30.00,
        category: "desserts",
        image: "https://assets.afcdn.com/recipe/20250128/157770_w1024h576c1cx1130cy1023cxt0cyt0cxb2667cyb1500.webp"
    },
    
    // Boissons
    {
        id: 41,
        name: "Coca-Cola",
        description: "33cl",
        price: 5.00,
        category: "boissons",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop"
    },
    {
        id: 42,
        name: "Jus d'Orange Frais",
        description: "Pressé minute",
        price: 15.00,
        category: "boissons",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop"
    },
    {
        id: 43,
        name: "Limonade maison",
        description: "Boisson citronnée.",
        price: 15.00,
        category: "boissons",
        image: "https://assets.afcdn.com/recipe/20160315/39982_w1024h1024c1cx2592cy1728.jpg"
    },
     {
        id: 44,
        name: "Thé glacé",
        description: "Thé légèrement sucré.",
        price: 15.00,
        category: "boissons",
        image: "https://ucarecdn.com/04c90f28-ecfb-4694-ba7b-dc0cdd6996e1/-/format/auto/-/preview/3000x3000/-/quality/lighter/the-glace-maison.webp"
    },
     {
        id: 45,
        name: "Smoothie fruits rouges",
        description: "",
        price: 15.00,
        category: "boissons",
        image: "https://gateauetcuisinerachida.com/wp-content/uploads/2023/02/Recette-smoothie-aux-fruits-rouges.jpg"
    },
    {
        id: 46,
        name: "Eau Minérale",
        description: "50cl",
        price: 10.00,
        category: "boissons",
        image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop"
    },
    {
        id: 47,
        name: "Thé vert",
        description: "Infusion de thé vert.",
        price: 15.00,
        category: "boissons",
        image: "https://www.indexsante.ca/chroniques/images/the-vert.jpg"
    },
    {
        id: 48,
        name: "Mojito sans alcool",
        description: "Boisson de menthe.",
        price: 25.00,
        category: "boissons",
        image: "https://shop.pierre-chavin.com/img/cms/Page%20Mocktails/Virgin%20Mojito/MOJITO_CHAVIN_SANS%20ALCOOL_2023%20HD%20(19).jpg"
    },
];

// Variables globales
let currentCategory = 'tous';
let cart = [];
let currentSlide = 0;
let currentPage = 1;
const itemsPerPage = 12;

// Initialiser le menu au chargement
document.addEventListener('DOMContentLoaded', () => {
    displayMenu();
    updateCart();
    startSlider();
});

// Afficher le menu
function displayMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    const filteredItems = currentCategory === 'tous' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    // Calculer la pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    menuGrid.innerHTML = paginatedItems.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">${item.price.toFixed(2)}DH</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Ajouter</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Mettre à jour la pagination
    updatePagination(totalPages, filteredItems.length);
    
    // Scroll vers le haut du menu si pas sur la première page
    if (currentPage > 1) {
        const menuSection = document.querySelector('.menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Mettre à jour les contrôles de pagination
function updatePagination(totalPages, totalItems) {
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationInfo = document.getElementById('paginationInfo');
    
    if (!paginationNumbers || !prevBtn || !nextBtn || !paginationInfo) return;
    
    // Désactiver/activer les boutons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Générer les numéros de page
    paginationNumbers.innerHTML = generatePageNumbers(totalPages);
    
    // Afficher les informations
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    paginationInfo.innerHTML = `Affichage <strong>${startItem}-${endItem}</strong> sur <strong>${totalItems}</strong> plats`;
}

// Générer les numéros de page
function generatePageNumbers(totalPages) {
    let pages = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pages += `
            <button class="page-number ${activeClass}" onclick="goToPage(${i})">
                <span>${i}</span>
            </button>
        `;
    }
    
    return pages;
}

// Changer de page
function changePage(direction) {
    const filteredItems = currentCategory === 'tous' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    displayMenu();
}

// Aller à une page spécifique
function goToPage(page) {
    currentPage = page;
    displayMenu();
}

// Filtrer par catégorie
function filterCategory(category) {
    currentCategory = category;
    currentPage = 1; // Réinitialiser à la page 1
    displayMenu();
    
    // Mise à jour des boutons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Rechercher un plat
function searchPlat() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        currentPage = 1;
        displayMenu();
        return;
    }
    
    const menuGrid = document.getElementById('menuGrid');
    const filteredItems = menuData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    
    // Réinitialiser à la page 1
    currentPage = 1;
    
    // Pagination pour recherche
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    menuGrid.innerHTML = paginatedItems.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">${item.price.toFixed(2)}DH</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Ajouter</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Mettre à jour pagination
    updatePagination(totalPages, filteredItems.length);
}

// Slider automatique
function startSlider() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Fonctions du panier
function addToCart(itemId) {
    const item = menuData.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    
    const btn = event.target;
    btn.textContent = '✓ Ajouté';
    btn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        btn.textContent = 'Ajouter';
        btn.style.backgroundColor = '';
    }, 1000);
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)}DH</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2) + 'DH';
}

function increaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

function decreaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    } else if (item && item.quantity === 1) {
        removeFromCart(itemId);
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCart();
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const body = document.body;
    
    if (cartModal) {
        cartModal.classList.toggle('active');
        
        if (cartModal.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
}

// Fermer le panier en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.target === cartModal) {
        toggleCart();
    }
});

// Fonction pour basculer le mode sombre
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// Charger la préférence dark mode
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

// Gestion de la commande WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const confirmOrderBtn = document.getElementById("confirmOrder");
    
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener("click", function() {
            let prenom = document.getElementById("prenom");
            let nom = document.getElementById("nom");
            let telephone = document.getElementById("telephone");
            let adresse = document.getElementById("adresse");

            const fields = [prenom, nom, telephone, adresse];

            for (let field of fields) {
                if (!field || !field.value.trim()) {
                    if (field) {
                        field.style.border = "2px solid red";
                        field.focus();
                    }
                    alert("Veuillez remplir tous les champs !");
                    return;
                } else {
                    field.style.border = "1px solid #ccc";
                }
            }

            let cartMessage = "\n\nArticles commandés:\n";
            cart.forEach(item => {
                cartMessage += `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toFixed(2)}DH)\n`;
            });
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartMessage += `\nTotal: ${total.toFixed(2)}DH`;

            let message = `Nouvelle commande:\nNom: ${prenom.value}\nPrénom: ${nom.value}\nTéléphone: ${telephone.value}\nAdresse: ${adresse.value}${cartMessage}`;
            
            let whatsappNumber = "+212713254023"; 
            let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank");
            
            cart = [];
            updateCart();
            toggleCart();
        });
    }
});

// ============================================
// ANIMATIONS PROFESSIONNELLES HEADER & PANIER
// ============================================

// Animation du header au scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Animation du panier lors de l'ajout d'un article
const originalAddToCart = window.addToCart;
window.addToCart = function(...args) {
    if (originalAddToCart) {
        originalAddToCart.apply(this, args);
    }
    
    // Animation du panier
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('cart-updated');
        setTimeout(() => {
            cartIcon.classList.remove('cart-updated');
        }, 600);
    }
    
    // Animation du badge
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'cartBounce 0.6s ease';
        }, 10);
    }
};

// Amélioration de la barre de recherche avec animation au focus
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('focus', function() {
        const searchBar = this.closest('.search-bar');
        if (searchBar) {
            searchBar.style.transform = 'translateY(-2px)';
        }
    });
    
    searchInput.addEventListener('blur', function() {
        const searchBar = this.closest('.search-bar');
        if (searchBar) {
            searchBar.style.transform = 'translateY(0)';
        }
    });
}

// Animation du logo
const logo = document.querySelector('.logo h1');
if (logo) {
    logo.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'logoShake 0.5s ease';
        }, 10);
    });
}

// Ajout de l'animation logoShake si elle n'existe pas
const styleSheet = document.styleSheets[0];
try {
    styleSheet.insertRule(`
        @keyframes logoShake {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-5deg) scale(1.05); }
            50% { transform: rotate(5deg) scale(1.05); }
            75% { transform: rotate(-3deg) scale(1.05); }
        }
    `, styleSheet.cssRules.length);
} catch(e) {
    // Ignore si la règle existe déjà
}