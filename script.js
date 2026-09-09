// Base de datos de detalles para el modal desplegable
const gamesData = {
    'Dying Light 2': {
        tag: 'ACCIÓN / PARKOUR',
        description: 'Supervivencia urbana en un mundo postapocalíptico donde el movimiento fluido por los tejados y el combate cuerpo a cuerpo son la clave para mantenerse con vida.',
        hours: '+120 hrs',
        platform: 'PC / Consola',
        rating: '9.0 / 10',
        video: 'https://www.youtube.com/embed/-amhwaphS5s',
        screenshots: ['images/dl2-1.jpg', 'images/dl2-2.jpg', 'images/dl2-3.jpg']
    },
    'Call of Duty: Warzone': {
        tag: 'FPS / BATTLE ROYALE',
        description: 'Partidas competitivas de alta intensidad, precisión en disparos y estrategia en equipo en mapas de gran escala.',
        hours: '+300 hrs',
        platform: 'PC',
        rating: '8.5 / 10',
        video: 'https://www.youtube.com/embed/Qop1sH70nHI',
        screenshots: ['images/wz-1.jpg', 'images/wz-2.jpg', 'images/wz-3.jpg']
    },
    'Saga Resident Evil': {
        tag: 'SURVIVAL HORROR',
        description: 'Atmósferas opresivas, gestión de recursos escasos y acertijos inolvidables que definieron el género del terror survival.',
        hours: '+200 hrs',
        platform: 'Varias',
        rating: '10 / 10',
        video: 'https://www.youtube.com/embed/jZZWxF_nENU',
        screenshots: ['images/re-1.jpg', 'images/re-2.jpg', 'images/re-3.jpg']
    },
    'Metro Exodus': {
        tag: 'SURVIVAL / NARRATIVO',
        description: 'Una experiencia inmersiva e impactante en una Rusia postapocalíptica; conseguir su final bueno tras todo el viaje deja una huella imborrable.',
        hours: '+85 hrs',
        platform: 'PC',
        rating: '9.8 / 10',
        video: 'https://www.youtube.com/embed/fbbqlvuovQ0',
        screenshots: ['images/metro-1.jpg', 'images/metro-2.jpg', 'images/metro-3.jpg']
    },
    'Juegos Rítmicos': {
        tag: 'PRECISIÓN / RITMO',
        description: 'Enfocado en Osu!, Geometry Dash y Beat Saber. Dominio de reflejos, lectura musical a alta velocidad y coordinación perfecta.',
        hours: '+150 hrs',
        platform: 'PC / VR',
        rating: '9.2 / 10',
        video: 'https://www.youtube.com/embed/3Wi28nKJSes',
        screenshots: ['images/ritmo-1.jpg', 'images/ritmo-2.jpg', 'images/ritmo-3.jpg']
    },
    'Need for Speed: Hot Pursuit': {
        tag: 'CARRERAS / ARCADIA',
        description: 'Persecuciones policiales a alta velocidad y carreras clandestinas al volante de superdeportivos exóticos en las carreteras de Seacrest County.',
        hours: '+60 hrs',
        platform: 'PC / Consola',
        rating: '9.5 / 10',
        video: 'https://www.youtube.com/embed/6P-YxFQiVAo',
        screenshots: ['images/nfs-1.jpg', 'images/nfs-2.jpg', 'images/nfs-3.jpg']
    }
};

// Control de apertura y cierre del Modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('game-modal');
    const closeModalBtn = document.getElementById('modal-close');
    const cards = document.querySelectorAll('#games .card');
    const videoIframe = document.getElementById('modal-video');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const titleElement = card.querySelector('h3');
            if (!titleElement) return;

            const title = titleElement.innerText.trim();
            const data = gamesData[title];

            if (data) {
                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-tag').innerText = data.tag;
                document.getElementById('modal-description').innerText = data.description;
                document.getElementById('modal-hours').innerText = data.hours;
                document.getElementById('modal-platform').innerText = data.platform;
                document.getElementById('modal-rating').innerText = data.rating;

                // Cargar Video de YouTube
                videoIframe.src = data.video;

                // Cargar Galería de Fotos
                const gallery = document.getElementById('modal-gallery');
                gallery.innerHTML = '';
                data.screenshots.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.onerror = () => { img.src = 'https://picsum.photos/300/200'; };
                    gallery.appendChild(img);
                });

                modal.classList.add('active');
            }
        });
    });

    // Función para cerrar el modal y apagar el video
    const closeModal = () => {
        modal.classList.remove('active');
        videoIframe.src = '';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});

// Tu SteamID64 real (número de 17 dígitos)
const STEAM_ID = 'https://steamcommunity.com/profiles/76561198452340533/64'; 

async function fetchSteamProfile() {
    if (!STEAM_ID || STEAM_ID === 'https://steamcommunity.com/profiles/76561198452340533/_ID64') return;

    try {
        // Usamos corsproxy para evitar el bloqueo de CORS en local
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=4A1D9C33860F5F6C62C0528B63283FBB&steamids=' + STEAM_ID)}`);
        
        const wrapper = await response.json();
        const data = JSON.parse(wrapper.contents);
        const player = data.response.players[0];

        if (player) {
            // Asignar Avatar, Nombre y Link
            document.getElementById('steam-avatar').src = player.avatarfull;
            document.getElementById('steam-name').innerText = player.personaname;
            document.getElementById('steam-link').href = player.profileurl;

            // Estado online / jugando
            const gameText = document.getElementById('steam-game');
            const statusDot = document.getElementById('steam-status-dot');

            if (player.gameextrainfo) {
                gameText.innerText = `Jugando a ${player.gameextrainfo}`;
                statusDot.className = 'status-dot online';
            } else if (player.personastate > 0) {
                gameText.innerText = 'En línea';
                statusDot.className = 'status-dot online';
            } else {
                gameText.innerText = 'Desconectado';
                statusDot.className = 'status-dot offline';
            }
        }
    } catch (error) {
        console.log('Error al conectar con Steam API:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchSteamProfile);