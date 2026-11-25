
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Create the 3D scene
const scene = new THREE.Scene();

const backgroundLoader = new THREE.TextureLoader();

const milkyWayTexture = backgroundLoader.load(
    'textures/stars_milky_way.jpg',
    undefined,
    undefined,
    (error) => {
        console.error('Could not load Milky Way texture:', error);
    }
);

// The image is a 360-degree panoramic texture
milkyWayTexture.mapping = THREE.EquirectangularReflectionMapping;
milkyWayTexture.colorSpace = THREE.SRGBColorSpace;

scene.background = milkyWayTexture;




// Create background stars
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 1500; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;

    starPositions.push(x, y, z);
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


// Create the camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 35, 65);


 // ===== CINEMATIC CAMERA FLIGHT =====

// Camera positions for the transition
const solarSystemCameraPosition = new THREE.Vector3(0, 35, 65);
const distantCameraPosition = new THREE.Vector3(0, 200, 450);

// Camera animation settings
let cameraFlightActive = false;
let cameraFlightStart = 0;
let cameraFlightDuration = 3500;

const cameraFlightFrom = new THREE.Vector3();
const cameraFlightTo = new THREE.Vector3();

// ===== SOLAR APOCALYPSE CAMERA =====
let solarCameraActive = false;

function updateCameraFlight() {

    if (!cameraFlightActive) return;

    // Calculate how far the animation has progressed
    const elapsed = performance.now() - cameraFlightStart;

    const progress = Math.min(
        elapsed / cameraFlightDuration,
        1
    );

    // Smooth acceleration and deceleration
    const smoothProgress =
        progress * progress * (3 - 2 * progress);

    // Move the camera between the two positions
    camera.position.lerpVectors(
        cameraFlightFrom,
        cameraFlightTo,
        smoothProgress
    );

    // Keep the Sun centred during Solar Apocalypse
if (solarCameraActive) {
    camera.lookAt(sun.position);
}

    // Finish the animation
    if (progress >= 1) {
        cameraFlightActive = false;
        controls.enabled = !scenarioActive;
    }
}



// Create the renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('solar-system').appendChild(renderer.domElement);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 0.1;
controls.enableDamping = true;

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(3, 64, 64);

const sunMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('textures/sun.jpg')
});

sunMaterial.map.colorSpace = THREE.SRGBColorSpace;



const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Give the Sun an identity for mouse clicks
sun.userData.name = "Sun";

scene.add(sun);


// Create the Earth

 // Create all eight planets

 // ===== PLANET ORBIT LINES =====
const orbitLines = [];

// Create a visible orbit around the Sun
function createOrbitLine(radius) {
    const points = [];

    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;

        points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
        color: 0x405070,
        transparent: true,
        opacity: 0.5
    });

   const orbitLine = new THREE.LineLoop(geometry, material);
scene.add(orbitLine);

// Save the orbit line so we can hide and restore it
orbitLines.push(orbitLine);
}

// Information about the planets


const jupiterMoonInfo = {
    Io: {
        description: "Io is Jupiter's volcanic moon and the most volcanically active world in our solar system. Its colourful surface is covered with sulfur compounds, lava flows and volcanic deposits.",

        extendedDescription: `Io is one of Jupiter's four largest moons, discovered by Galileo Galilei in 1610.

Io is the most volcanically active world in our solar system, with hundreds of volcanoes. Some eruptions send material high above its surface.

Jupiter's powerful gravity, together with the gravitational influence of Europa and Ganymede, constantly stretches and compresses Io. This process, called tidal heating, generates enormous amounts of heat inside the moon.

Io's yellow, orange and reddish surface is shaped by sulfur compounds and volcanic activity.

Io orbits Jupiter approximately every 1.77 Earth days. This makes it one of the fastest-orbiting large moons in the solar system.`,

        diameter: "3,643 km",
        distance: "422,000 km from Jupiter",
        day: "1.77 Earth days",
        moons: "Jupiter",
        type: "Volcanic Moon",
       
        temperature: "Approx. -130°C"
    },

    Europa: {
        description: "Europa is one of Jupiter's largest moons. Beneath its icy surface, scientists have found strong evidence of a vast saltwater ocean, making Europa an important target in the search for environments that could support life.",

        extendedDescription: `Europa is one of the four Galilean moons discovered in 1610.

Its surface is covered by water ice, with long cracks and reddish-brown markings. These features provide clues about processes taking place within the moon.

Scientists have strong evidence that a global saltwater ocean exists beneath Europa's icy crust. This ocean may contain more than twice the volume of water in all of Earth's oceans combined.

Europa experiences tidal heating as Jupiter's gravity repeatedly stretches and compresses the moon. This energy may help keep its underground ocean liquid.

NASA's Europa Clipper spacecraft was launched on 14 October 2024 to investigate Europa and determine whether it has environments that could support life.

Europa is an important destination for scientific exploration, but no life has been discovered there.`,

        diameter: "3,122 km",
        distance: "671,000 km from Jupiter",
        day: "3.55 Earth days",
        moons: "Jupiter",
        type: "Icy Moon",
                temperature: "Approx. -160°C"
    },
     
    Ganymede: {
        description: "Ganymede is the largest moon in our solar system, even bigger than the planet Mercury. It is the only moon known to generate its own magnetic field and may contain a vast underground saltwater ocean.",

        extendedDescription: `Ganymede is Jupiter's largest moon and the largest natural satellite in the solar system.

With a diameter of approximately 5,268 kilometres, Ganymede is larger than Mercury, although it has much less mass.

Ganymede is the only moon known to generate its own intrinsic magnetic field. This makes it particularly interesting to scientists studying planetary interiors.

Its surface contains dark, heavily cratered regions and lighter areas with grooves and ridges.

Evidence from spacecraft observations suggests that Ganymede contains a deep saltwater ocean beneath its icy outer layers.

Ganymede was discovered by Galileo Galilei in 1610 and completes one orbit around Jupiter approximately every 7.15 Earth days.`,

        diameter: "5,268 km",
        distance: "1,070,000 km from Jupiter",
        day: "7.15 Earth days",
        moons: "Jupiter",
        type: "Icy Moon",
        temperature: "Approx. -163°C"
    },

    Callisto: {
        description: "Callisto is one of Jupiter's largest moons and has one of the most heavily cratered surfaces in our solar system. Its ancient landscape preserves evidence of billions of years of impacts.",

        extendedDescription: `Callisto is the second-largest moon of Jupiter and the third-largest moon in the solar system.

Its surface is extremely old and covered with impact craters, suggesting that it has experienced relatively little geological resurfacing compared with some other moons.

One of Callisto's most remarkable features is Valhalla, a giant impact structure surrounded by concentric rings.

Scientists have found evidence suggesting that a salty liquid-water ocean may exist deep beneath Callisto's icy surface.

Callisto orbits farther from Jupiter than Io, Europa and Ganymede, experiencing less intense tidal heating.

Like the other Galilean moons, Callisto was discovered in 1610. It completes an orbit around Jupiter approximately every 16.69 Earth days.`,

        diameter: "4,821 km",
        distance: "1,883,000 km from Jupiter",
        day: "16.69 Earth days",
        moons: "Jupiter",
        type: "Icy Moon",
        temperature: "Approx. -139°C"
    }


};



const outerMoonInfo = {

    Titania: {
        description: "Titania is the largest moon of Uranus. Its icy surface contains impact craters, deep valleys and enormous fractures.",

        extendedDescription: `Titania is Uranus's largest natural satellite and one of the five major moons orbiting the planet.

It was discovered by astronomer William Herschel in 1787, together with Oberon.

Titania's surface contains numerous impact craters and long valleys. These geological features suggest that the moon has experienced significant activity during its history.

Like many large moons in the outer solar system, Titania is believed to contain a mixture of water ice and rocky material.

Some scientific models suggest that Titania could potentially contain a layer of liquid water deep beneath its icy surface, although this has not been confirmed.

NASA's Voyager 2 spacecraft photographed Titania during its flyby of Uranus in 1986. Much of the moon remains unexplored.`,

        diameter: "1,580 km",
        distance: "436,300 km from Uranus",
        day: "8.71 Earth days",
        moons: "Uranus",
        type: "Icy Moon",
        temperature: "Extremely cold"
    },

    Oberon: {
        description: "Oberon is one of Uranus's largest moons. Its ancient surface is heavily covered with impact craters.",

        extendedDescription: `Oberon is the second-largest moon of Uranus and the outermost of its five major moons.

It was discovered in 1787 by William Herschel, the same astronomer who discovered Titania.

Oberon's surface is dark and heavily cratered. These impact craters provide evidence of collisions that occurred over billions of years.

Some of the moon's craters contain unusually dark material, although the origin of this material is not completely understood.

Oberon is believed to consist mainly of a combination of water ice and rocky material.

NASA's Voyager 2 spacecraft photographed Oberon during its 1986 encounter with Uranus. Many areas of its surface remain poorly explored.`,

        diameter: "1,524 km",
        distance: "583,400 km from Uranus",
        day: "13.46 Earth days",
        moons: "Uranus",
        type: "Icy Moon",
        temperature: "Extremely cold"
    },

    Miranda: {
        description: "Miranda is a small moon of Uranus famous for its extraordinary cliffs, deep canyons and unusual surface formations.",

        extendedDescription: `Miranda is the smallest and innermost of Uranus's five major moons.

It was discovered in 1948 by astronomer Gerard Kuiper.

Despite its relatively small size, Miranda has one of the most unusual landscapes discovered in our solar system.

Its surface contains enormous fault canyons, ridges and strange geological structures. Some canyons are estimated to be many times deeper than the Grand Canyon on Earth.

Scientists believe that Miranda's complicated surface may have been shaped by geological activity and gravitational interactions during its history.

Some regions appear much older than others, suggesting that parts of the moon's surface have changed over time.

NASA's Voyager 2 spacecraft photographed Miranda in 1986, revealing its extraordinary terrain for the first time.`,

        diameter: "472 km",
        distance: "129,900 km from Uranus",
        day: "1.41 Earth days",
        moons: "Uranus",
        type: "Icy Moon",
        temperature: "Extremely cold"
    },

    
Triton: {
    description: "Triton is Neptune's largest moon. It is unusual because it orbits in the opposite direction to Neptune's rotation.",

    extendedDescription: `Triton is the largest natural satellite of Neptune and one of the most unusual moons in our solar system.

It was discovered in 1846 by British astronomer William Lassell, shortly after Neptune itself was discovered.

Unlike most large moons, Triton travels around its planet in a retrograde orbit, meaning it moves in the opposite direction to Neptune's rotation.

Scientists believe Triton may have originally been an object from the Kuiper Belt that was captured by Neptune's gravity.

Triton's surface is extremely cold, with temperatures around -235°C. Much of its surface contains frozen nitrogen and other icy materials.

During its 1989 flyby, NASA's Voyager 2 spacecraft observed dark streaks and active geyser-like plumes rising from Triton's icy surface.

Triton has a thin atmosphere dominated by nitrogen. Despite its extreme conditions, it remains an important target for future scientific exploration.`,

    diameter: "2,707 km",
    distance: "354,800 km from Neptune",
    day: "5.88 Earth days (retrograde)",
    moons: "Neptune",
    type: "Icy Moon",
    temperature: "Approx. -235°C"
},

Proteus: {
    description: "Proteus is Neptune's second-largest moon. It has a dark, heavily cratered surface and an irregular shape.",

    extendedDescription: `Proteus is the second-largest known moon of Neptune and one of the planet's largest inner satellites.

It was discovered in 1989 using images taken by NASA's Voyager 2 spacecraft.

Despite its relatively large size, Proteus was difficult to detect from Earth because it is extremely dark and orbits close to the much brighter Neptune.

Proteus has an irregular shape rather than being a perfect sphere. Its gravity is not strong enough to have formed it into a completely rounded world.

Its ancient surface contains numerous impact craters, including the enormous crater Pharos, which is more than 200 kilometres across.

Proteus completes an orbit around Neptune in just over one Earth day, making it a much faster-orbiting moon than Triton.

NASA's Voyager 2 spacecraft provided much of our knowledge about Proteus. Large portions of the moon remain poorly studied.`,

    diameter: "Approx. 420 km",
    distance: "117,600 km from Neptune",
    day: "1.12 Earth days",
    moons: "Neptune",
    type: "Irregular Moon",
    temperature: "Extremely cold"
}

};



const moonInfo = {
    description: "The Moon is Earth's only natural satellite and the only celestial body beyond Earth that humans have walked on. It influences Earth's tides and helps stabilise our planet's climate.",

    
extendedDescription: `The Moon is Earth's only natural satellite and the only place beyond Earth where humans have walked.

The Moon helps stabilise Earth's axial tilt, contributing to a relatively stable climate. Its gravity also influences ocean tides.

With a radius of approximately 1,737.5 kilometres, the Moon is less than one-third the width of Earth. It is the fifth-largest moon in our solar system.

The average distance between Earth and the Moon is approximately 384,400 kilometres. Around 30 Earth-sized planets could fit between them.

The Moon is slowly moving away from Earth by approximately 3.8 centimetres per year.

The leading explanation for the Moon's formation is that a Mars-sized object collided with the early Earth around 4.5 billion years ago. Debris from this impact eventually formed the Moon.

The young Moon was initially extremely hot and largely molten. As it cooled, lighter rocks rose towards the surface and formed its early crust.`,


    diameter: "3,474 km",
    distance: "384,400 km from Earth",
    day: "27.3 Earth days",
    moons: "Orbits Earth",
    type: "Natural Satellite",
    temperature: "Approx. -173°C to 127°C"
};

const sunInfo = {
    description: "The Sun is the star at the centre of our solar system. Its gravity keeps the planets in orbit and its energy provides light and heat to Earth.",

    
extendedDescription: `The Sun is a yellow dwarf star at the centre of our solar system. Its gravity keeps the planets, asteroids, comets and other objects in orbit.

The Sun generates a powerful magnetic field. Charged particles released by the Sun travel through space as the solar wind and can interact with Earth's magnetic field, sometimes creating auroras.

Our solar system is located in the Orion Spur, a region of the Milky Way galaxy. The Sun travels around the centre of our galaxy, taking approximately 230 million years to complete one orbit.

The Sun also rotates on its own axis. Because it is not a solid object, different regions rotate at different speeds. The equator takes approximately 25 Earth days to complete one rotation, while the polar regions take about 36 days.`,


    diameter: "1.39 million km",
    distance: "Centre of the Solar System",
    day: "About 25 Earth days at the equator",
    moons: "8 planets orbit the Sun",
    type: "G2V Yellow Dwarf",
    temperature: "About 5,500°C at the surface"
};

const planetInfo = {
    Mercury: {
        description: "Mercury is the smallest planet in our solar system and the closest planet to the Sun.",

extendedDescription: `Mercury is the smallest planet in our solar system and the closest planet to the Sun. Despite its small size, it is a fascinating world with extreme conditions.

Mercury experiences enormous temperature differences. During the day, temperatures can reach approximately 430°C, while nighttime temperatures can fall to around -180°C. This happens because Mercury has almost no atmosphere to retain heat.

Although Mercury is the closest planet to the Sun, it is not the hottest planet. Venus holds that record because of its thick atmosphere.

Mercury is the fastest planet in our solar system, completing one orbit around the Sun in approximately 88 Earth days.

Its rocky surface is covered with impact craters, similar to Earth's Moon. These craters were formed by collisions with asteroids and comets over billions of years.

NASA's MESSENGER spacecraft orbited Mercury between 2011 and 2015, collecting detailed information about its surface, composition and magnetic field.`,

        diameter: "4,879 km",
        distance: "57.9 million km",
        day: "58.6 Earth days",
        moons: "0",
        type: "Terrestrial",
        temperature: "167°C"
    },
    Venus: {
        description: "Venus is the hottest planet in our solar system because of its thick atmosphere.",

extendedDescription: `Venus is often called Earth's twin because the two planets are similar in size, mass and composition. However, their environments are dramatically different.

Venus has an extremely thick atmosphere made mostly of carbon dioxide. Its yellowish clouds contain sulfuric acid, and the atmosphere traps heat through an intense greenhouse effect.

As a result, Venus is the hottest planet in our solar system, with an average surface temperature of approximately 464°C.

The atmospheric pressure at Venus's surface is more than 90 times greater than Earth's pressure at sea level. These extreme conditions make Venus a very difficult place for spacecraft to explore.

Venus rotates very slowly and in the opposite direction to most planets. One rotation takes approximately 243 Earth days, which is longer than its 225-day orbit around the Sun.

In 1962, NASA's Mariner 2 became the first spacecraft to successfully visit another planet when it flew past Venus. Later missions, including NASA's Magellan spacecraft, used radar to map its surface.

Scientists continue studying Venus to understand how planets with similar starting conditions can develop into completely different worlds.`,

        diameter: "12,104 km",
        distance: "108.2 million km",
        day: "243 Earth days",
        moons: "0",
        type: "Terrestrial",
        temperature: "464°C"
    },
    Earth: {
        description: "Earth is our home planet and the only known planet that supports life.",


extendedDescription: `Earth is the only planet known to support life. It is also the only planet in our solar system with stable liquid water on its surface.

Earth is the fifth-largest planet in the solar system and the largest of the four rocky inner planets.

NASA studies Earth through satellites and scientific missions. The Earth Observing System (EOS) monitors the atmosphere, oceans, land, living ecosystems and other parts of our planet to help scientists understand how Earth changes over time.`,


        diameter: "12,742 km",
        distance: "149.6 million km",
        day: "24 hours",
        moons: "1",
        type: "Terrestrial",
        temperature: "15°C"
    },
    Mars: {
        description: "Mars is known as the Red Planet because of iron oxide on its surface.",

extendedDescription: `Mars is the fourth planet from the Sun. Known as the Red Planet, Mars is a cold, dusty desert world with a thin atmosphere.

Mars gets its reddish appearance from iron minerals in its rocks and dust. These minerals react with oxygen, creating iron oxide, commonly known as rust.

Mars is home to Olympus Mons, the largest known volcano in our solar system. It is approximately three times the height of Mount Everest and has a base hundreds of kilometres wide.

Evidence from spacecraft shows that liquid water once flowed across the Martian surface. Ancient river valleys, lakebeds and minerals formed in water suggest that Mars had a much wetter past.

Today, most water on Mars exists as ice, particularly in its polar regions and beneath the surface. The thin atmosphere and low temperatures make stable liquid water difficult to maintain on the surface.

NASA has explored Mars using orbiters, landers and robotic rovers. Missions such as Curiosity and Perseverance investigate the planet's geology, climate and potential for ancient microbial life.

Mars continues to be an important destination for future robotic exploration and possible human missions.`,

        diameter: "6,779 km",
        distance: "227.9 million km",
        day: "24.6 hours",
        moons: "2",
        type: "Terrestrial",
        temperature: "-65°C"
    },
    Jupiter: {
        description: "Jupiter is the largest planet in our solar system and is famous for its Great Red Spot.",

extendedDescription: `Jupiter is the fifth planet from the Sun and the largest planet in our solar system. It is a gas giant made primarily of hydrogen and helium.

Jupiter is so massive that it contains more than twice the combined mass of all the other planets in our solar system.

Its colourful stripes and swirling patterns are clouds moving through a powerful atmosphere. The clouds contain substances including ammonia and water.

Jupiter's Great Red Spot is an enormous storm that has been observed for centuries. Its size and appearance have changed over time, but it remains one of the most recognisable features in the solar system.

Despite its enormous size, Jupiter rotates extremely quickly. One day lasts approximately 10 Earth hours, making it the planet with the shortest day.

Jupiter takes approximately 12 Earth years to complete one orbit around the Sun.

The planet has a faint system of rings and a large collection of moons. Four of its largest moons – Io, Europa, Ganymede and Callisto – were discovered by Galileo Galilei in 1610.

Jupiter formed around 4.5 billion years ago and plays an important role in understanding the formation and evolution of our solar system.`,

        diameter: "139,820 km",
        distance: "778.6 million km",
        day: "9.9 hours",
        moons: "95",
        type: "Gas Giant",
        temperature: "-110°C"
    },
    Saturn: {
        description: "Saturn is a gas giant famous for its spectacular rings made of ice and rock.",

extendedDescription: `Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Like Jupiter, Saturn is a gas giant composed mainly of hydrogen and helium.

Saturn is best known for its spectacular rings. Although other giant planets also have rings, Saturn's rings are by far the most prominent and complex.

The rings are made from countless pieces of ice, rock and dust. These particles range from tiny grains to much larger chunks, and they orbit Saturn at different speeds.

Saturn is home to many fascinating moons. Titan has a thick atmosphere and lakes of liquid methane and ethane, while Enceladus releases jets of water vapour and icy particles from its surface.

Despite its enormous size, Saturn has a low average density. It is the least dense planet in our solar system.

Saturn takes approximately 29 Earth years to orbit the Sun, but it rotates rapidly, completing one day in roughly 10.7 hours.

NASA's Cassini spacecraft studied Saturn, its rings and its moons for more than 13 years, transforming our understanding of this remarkable planetary system.`,

        diameter: "116,460 km",
        distance: "1.43 billion km",
        day: "10.7 hours",
        moons: "146",
        type: "Gas Giant",
        temperature: "-140°C"
    },
    Uranus: {
        description: "Uranus is an ice giant that rotates on its side.",

extendedDescription: `Uranus is the seventh planet from the Sun and one of the two ice giants in our solar system.

Its blue-green colour comes mainly from methane in its atmosphere, which absorbs red wavelengths of sunlight.

One of Uranus's most unusual characteristics is its extreme axial tilt of approximately 98 degrees. The planet effectively rotates on its side as it travels around the Sun.

This unusual orientation produces extreme seasons. During parts of its 84-Earth-year orbit, one pole can face the Sun for many years while the opposite pole remains in darkness.

Uranus has a faint system of dark rings and numerous natural moons. Among its largest moons are Titania and Oberon, while Miranda is famous for its extraordinary cliffs and fractured terrain.

Unlike most planets, Uranus rotates in a retrograde direction. Scientists believe a major collision early in its history may help explain its unusual tilt.

NASA's Voyager 2 spacecraft visited Uranus in 1986. It remains the only spacecraft to have flown past the planet.`,

        diameter: "50,724 km",
        distance: "2.87 billion km",
        day: "17.2 hours",
        moons: "28",
        type: "Ice Giant",
        temperature: "-195°C"
    },
    Neptune: {
        description: "Neptune is the most distant planet from the Sun and is known for its powerful winds.",

extendedDescription: `Neptune is the eighth and most distant planet from the Sun. It is an ice giant known for its deep blue appearance and powerful winds.

Neptune is more than 30 times farther from the Sun than Earth. Sunlight is much weaker there, making it an extremely cold world.

Its atmosphere consists mainly of hydrogen and helium, with methane contributing to its blue colour.

Neptune experiences some of the fastest winds recorded in our solar system. Its atmosphere contains enormous storms, including dark vortex-like features observed by spacecraft and telescopes.

Deep beneath its clouds, Neptune is believed to contain dense layers of water, ammonia and methane under extreme temperatures and pressures.

Neptune takes approximately 165 Earth years to complete one orbit around the Sun. In 2011, it completed its first full orbit since its discovery in 1846.

Neptune has a system of faint rings and several moons. Its largest moon, Triton, is particularly unusual because it orbits in the opposite direction to Neptune's rotation.

NASA's Voyager 2 spacecraft flew past Neptune in 1989 and remains the only spacecraft to have visited the planet.`,

        diameter: "49,244 km",
        distance: "4.5 billion km",
        day: "16.1 hours",
        moons: "16",
        type: "Ice Giant",
        temperature: "-200°C"
    }
};

const issInfo = {
    description: "The International Space Station (ISS) is a research laboratory orbiting Earth. Astronauts live and work on board, conducting scientific experiments in space.",

extendedDescription: `The International Space Station (ISS) is a permanently crewed research laboratory orbiting Earth. It is one of the largest international engineering projects ever completed in space.

The ISS was assembled through cooperation between space agencies in the United States, Russia, Europe, Japan and Canada. Its construction required numerous launches and spacewalks.

The station has been continuously inhabited since November 2000. Astronauts live and work aboard the ISS, conducting scientific experiments in microgravity.

Research aboard the station helps scientists study human health, materials, fluids, plant growth and how living organisms respond to long periods in space.

The ISS travels at approximately 28,000 kilometres per hour and completes one orbit around Earth roughly every 90 minutes. Astronauts aboard the station therefore experience about 16 sunrises and sunsets every day.

The station also serves as a testing ground for technologies that could support future missions to the Moon, Mars and beyond.

The ISS demonstrates how international cooperation can advance scientific knowledge and space exploration.`,

    diameter: "109 metres (approx. length)",
    distance: "About 400 km above Earth",
    day: "About 90 minutes per orbit",
    moons: "N/A",
    type: "Space Station",
    temperature: "Controlled environment"
};



// Create a simplified International Space Station
function createISS() {
    const station = new THREE.Group();

    // Main station body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.4, 12),
        new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            metalness: 0.5,
            roughness: 0.4
        })
    );

    body.rotation.z = Math.PI / 2;
    station.add(body);

    // Solar panels
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x174ea6,
        metalness: 0.3,
        roughness: 0.5,
        side: THREE.DoubleSide
    });

    // Left solar panel
    const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.015, 0.18),
        panelMaterial
    );
    leftPanel.position.x = -0.4;
    station.add(leftPanel);

    // Right solar panel
    const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.015, 0.18),
        panelMaterial
    );
    rightPanel.position.x = 0.4;
    station.add(rightPanel);

    return station;
}

const planets = [];
const clickableJupiterMoons = [];
const clickableOuterMoons = [];
let issModelForClick = null;
let moonForClick = null;


const textureLoader = new THREE.TextureLoader();

// Load a texture from the textures folder
function loadTexture(filename) {
    const texture = textureLoader.load(
        'textures/' + filename,
        undefined,
        undefined,
        (error) => {
            console.error('Could not load texture:', filename, error);
        }
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

// Planet textures
const planetTextures = {
    Mercury: loadTexture('mercury.jpg'),
    Venus: loadTexture('venus_atmosphere.jpg'),
    Earth: loadTexture('earth.jpg'),
    Mars: loadTexture('mars.jpg'),
    Jupiter: loadTexture('jupiter.jpg'),
    Saturn: loadTexture('saturn.jpg'),
    Uranus: loadTexture('uranus.jpg'),
    Neptune: loadTexture('neptune.jpg')
};

const earthNightTexture = loadTexture('earth_nightmap.jpg');

// Earth Day and Night shader
const earthDayNightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        dayTexture: {
            value: planetTextures.Earth
        },
        nightTexture: {
            value: earthNightTexture
        },
        sunPosition: {
            value: new THREE.Vector3(0, 0, 0)
        }
    },

    vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        void main() {
            vUv = uv;

            vec4 worldPosition =
                modelMatrix * vec4(position, 1.0);

            vWorldPosition = worldPosition.xyz;

            vWorldNormal = normalize(
                mat3(modelMatrix) * normal
            );

            gl_Position =
                projectionMatrix *
                viewMatrix *
                worldPosition;
        }
    `,

    fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        void main() {
            vec3 normalDirection = normalize(vWorldNormal);

            vec3 lightDirection = normalize(
                sunPosition - vWorldPosition
            );

            float sunlight = dot(
                normalDirection,
                lightDirection
            );

            float dayMix = smoothstep(
                -0.15,
                0.2,
                sunlight
            );

            vec3 dayColor = texture2D(
                dayTexture,
                vUv
            ).rgb;

            vec3 nightColor = texture2D(
                nightTexture,
                vUv
            ).rgb;

            float daylight = 0.15 +
                0.85 * max(sunlight, 0.0);

            dayColor *= daylight;

            vec3 finalColor = mix(
                nightColor,
                dayColor,
                dayMix
            );

            gl_FragColor = vec4(finalColor, 1.0);

            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }
    `
});






const planetData = [
    { name: "Mercury", size: 0.35, distance: 5, speed: 0.02, color: 0xaaaaaa },
    { name: "Venus", size: 0.65, distance: 7, speed: 0.015, color: 0xffcc88 },
    { name: "Earth", size: 0.7, distance: 10, speed: 0.01, color: 0x2288ff },
    { name: "Mars", size: 0.5, distance: 13, speed: 0.008, color: 0xff5533 },
    { name: "Jupiter", size: 1.7, distance: 18, speed: 0.004, color: 0xddaa77 },
    { name: "Saturn", size: 1.4, distance: 23, speed: 0.003, color: 0xeedd99 },
    { name: "Uranus", size: 1, distance: 28, speed: 0.002, color: 0x66dddd },
    { name: "Neptune", size: 1, distance: 33, speed: 0.001, color: 0x3355ff }
];

planetData.forEach((data) => {
    createOrbitLine(data.distance);

    const geometry = new THREE.SphereGeometry(data.size, 32, 32);

    


const material = data.name === "Earth"
    ? earthDayNightMaterial
    : new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: planetTextures[data.name]
    });




    const planet = new THREE.Mesh(geometry, material);
    planet.userData.name = data.name;

// Add rings to Saturn
if (data.name === "Saturn") {
    const ringGeometry = new THREE.RingGeometry(
        data.size * 1.3,
        data.size * 2.1,
        96
    );

    
const ringMaterial = new THREE.MeshBasicMaterial({
    map: loadTexture('saturn_ring.png'),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    depthWrite: false
});


    const rings = new THREE.Mesh(ringGeometry, ringMaterial);

    // Tilt the rings
    rings.rotation.x = Math.PI / 2.5;

    planet.add(rings);
}


    // Position planet away from the Sun
    planet.position.x = data.distance;

    // Create orbit group
    const orbit = new THREE.Group();
    orbit.add(planet);
    scene.add(orbit);

// Create Jupiter's moon Io
if (data.name === "Jupiter") {

    // Create Io
    const ioGeometry = new THREE.SphereGeometry(0.22, 32, 32);

    
const ioMaterial = new THREE.MeshStandardMaterial({
    map: loadTexture('io.jpg')
});


    const io = new THREE.Mesh(ioGeometry, ioMaterial);

    io.userData.name = "Io";
clickableJupiterMoons.push(io);

    // Create an orbit around Jupiter
    const ioOrbit = new THREE.Group();

    // Centre the orbit on Jupiter
    ioOrbit.position.copy(planet.position);

    // Distance from Jupiter (simplified)
    io.position.x = 2.5;

    ioOrbit.add(io);
    orbit.add(ioOrbit);

    // Save the orbit for animation
    planet.userData.ioOrbit = ioOrbit;
}
const uranusMoons = [
    { name: "Titania", size: 0.20, distance: 3.0, speed: 0.018, color: 0xbfc8d8 },
    { name: "Oberon",  size: 0.18, distance: 3.8, speed: 0.015, color: 0xaeb7c4 },
    { name: "Miranda", size: 0.10, distance: 2.2, speed: 0.026, color: 0xd8d8d8 }
];

const neptuneMoons = [
    { name: "Triton",  size: 0.22, distance: 3.2, speed: 0.020, color: 0xcfcfcf },
    { name: "Proteus", size: 0.12, distance: 2.3, speed: 0.028, color: 0x8f8f8f }

    ];


 // ===== URANUS MOONS =====

if (data.name === "Uranus") {

    planet.userData.uranusMoonOrbits = [];

    uranusMoons.forEach((moonData) => {

        const geometry = new THREE.SphereGeometry(
            moonData.size, 32, 32
        );


let textureFile = moonData.name.toLowerCase() + '.jpg';

if (moonData.name === "Titania") {
    textureFile = 'titania_fixed_final.jpg';
} else if (moonData.name === "Oberon") {
    textureFile = 'oberon_fixed.jpg';
} else if (moonData.name === "Miranda") {
    textureFile = 'miranda_fixed.jpg';
}

const texture = loadTexture(textureFile);

const material = new THREE.MeshBasicMaterial({
    map: texture
});



        const moon = new THREE.Mesh(geometry, material);

        moon.userData.name = moonData.name;
        clickableOuterMoons.push(moon);
        moon.position.x = moonData.distance;

        // Create an orbit centred on Uranus
        const moonOrbit = new THREE.Group();
        moonOrbit.position.copy(planet.position);

        moonOrbit.add(moon);
        orbit.add(moonOrbit);

        // Save for animation
        planet.userData.uranusMoonOrbits.push({
            orbit: moonOrbit,
            speed: moonData.speed
        });
    });
}


// Create three additional moons around Jupiter
if (data.name === "Jupiter") {

    const jupiterMoons = [
        {
            name: "Europa",
            size: 0.19,
            distance: 3.2,
            speed: 0.018,
            color: 0xd8c9a8
        },
        {
            name: "Ganymede",
            size: 0.3,
            distance: 4.1,
            speed: 0.012,
            color: 0x9a8a78
        },
        {
            name: "Callisto",
            size: 0.27,
            distance: 5.0,
            speed: 0.008,
            color: 0x6e6259
        }
        ];

        

    planet.userData.jupiterMoonOrbits = [];

    jupiterMoons.forEach((moonData) => {

        const geometry = new THREE.SphereGeometry(
            moonData.size, 32, 32
        );

   
const material = new THREE.MeshStandardMaterial({
    map: loadTexture(moonData.name.toLowerCase() + '.jpg'),
    emissive: 0xffffff,
    emissiveMap: loadTexture(moonData.name.toLowerCase() + '.jpg'),
    emissiveIntensity: 0.35
});

        const moon = new THREE.Mesh(geometry, material);

        moon.userData.name = moonData.name;
clickableJupiterMoons.push(moon);

        // Position the moon away from Jupiter
        moon.position.x = moonData.distance;

        // Create an orbit centred on Jupiter
        const moonOrbit = new THREE.Group();
        moonOrbit.position.copy(planet.position);

        moonOrbit.add(moon);
        orbit.add(moonOrbit);

        // Store the orbit for animation
        planet.userData.jupiterMoonOrbits.push({
            orbit: moonOrbit,
            speed: moonData.speed
        });
    });
}

 // ===== NEPTUNE MOONS =====

if (data.name === "Neptune") {

    planet.userData.neptuneMoonOrbits = [];

    neptuneMoons.forEach((moonData) => {

        const geometry = new THREE.SphereGeometry(
            moonData.size, 32, 32
        );

        const texture = loadTexture(
            moonData.name === "Triton"
                ? 'triton_fixed.jpg'
                : moonData.name === "Proteus"
                    ? 'proteus_fixed.jpg'
                    : moonData.name.toLowerCase() + '.jpg'
        );

        const material = new THREE.MeshBasicMaterial({
            map: texture
        });

        const moon = new THREE.Mesh(geometry, material);

        moon.userData.name = moonData.name;
        clickableOuterMoons.push(moon);
        moon.position.x = moonData.distance;

        const moonOrbit = new THREE.Group();
        moonOrbit.position.copy(planet.position);

        moonOrbit.add(moon);
        orbit.add(moonOrbit);

        planet.userData.neptuneMoonOrbits.push({
            orbit: moonOrbit,
            speed: moonData.name === "Triton"
                ? -moonData.speed
                : moonData.speed
        });
    });
}




 // Create the Moon orbiting Earth
if (data.name === "Earth") {
    const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);

    const moonMaterial = new THREE.MeshStandardMaterial({
        map: loadTexture('moon.jpg')
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.userData.name = "Moon";
moonForClick = moon;

    // Create a group that rotates around Earth
    const moonOrbit = new THREE.Group();

    // Keep the Moon's orbit centred on Earth
    moonOrbit.position.copy(planet.position);

    moon.position.x = 1.8;

    moonOrbit.add(moon);
    orbit.add(moonOrbit);

    // Save for animation
    planet.userData.moonOrbit = moonOrbit;

// Create ISS orbit around Earth
const issOrbit = new THREE.Group();

// Place orbit centre at Earth
issOrbit.position.copy(planet.position);

// Give ISS an inclined orbit
issOrbit.rotation.z = 0.4;

// Create the space station

// Create a container for the NASA ISS model
const iss = new THREE.Group();



// Identify the complete space station
iss.userData.name = "ISS";

// Position ISS close to Earth
iss.position.x = 1.15;

// Add ISS container to the existing orbit
issOrbit.add(iss);

// Load the NASA ISS 3D model
const issLoader = new GLTFLoader();

// Enable Draco decompression for NASA's ISS model
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
);

issLoader.setDRACOLoader(dracoLoader);


issLoader.load(
    'models/ISS.glb',

    (gltf) => {
        const issModel = gltf.scene;

        // Measure the original model
        issModel.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(issModel);
        const size = box.getSize(new THREE.Vector3());

        const maxDimension = Math.max(
            size.x,
            size.y,
            size.z
        );

        // Resize the model to fit our solar system
        if (maxDimension > 0) {
            issModel.scale.multiplyScalar(0.45 / maxDimension);
        }

        // Centre the model
        issModel.updateMatrixWorld(true);

        const newBox = new THREE.Box3().setFromObject(issModel);
        const centre = newBox.getCenter(new THREE.Vector3());

        issModel.position.sub(centre);

        // Add the finished model
        iss.add(issModel);
        // Store the ISS model for mouse interaction
issModelForClick = issModel;

// Inspect the different parts of the ISS model

// Temporary colours to identify ISS parts

const debugColors = [
    0xb8c2cc, // Silver
    0x183b78, // Dark blue solar panels
    0xb8c2cc, // Silver
    0xb8c2cc, // Silver
    0xb8c2cc, // Silver
    0xb8c2cc  // Silver
];


let partIndex = 0;

issModel.traverse((object) => {
    if (object.isMesh) {

        // Save original material
        object.userData.originalMaterial = object.material;

        // Give each mesh a different colour
       
object.material = new THREE.MeshStandardMaterial({
    color: debugColors[partIndex % debugColors.length],
    metalness: 0.35,
    roughness: 0.55,
    side: THREE.DoubleSide
});


        
const dimensions = new THREE.Box3()
    .setFromObject(object)
    .getSize(new THREE.Vector3());

console.log(
    "ISS part:",
    partIndex,
    "Name:", object.name,
    "Size:",
    dimensions.x.toFixed(3),
    dimensions.y.toFixed(3),
    dimensions.z.toFixed(3)
);


        partIndex++;
    }
});



        console.log('NASA ISS model loaded successfully!');
    },

    undefined,

    (error) => {
        console.error('Could not load NASA ISS model:', error);

        // Use our original ISS if loading fails
        const fallbackISS = createISS();
        fallbackISS.scale.setScalar(0.35);
        iss.add(fallbackISS);
    }
);

orbit.add(issOrbit);

// Save for animation
planet.userData.issOrbit = issOrbit;

}


    planets.push({
        mesh: planet,
        orbit: orbit,
        speed: data.speed,
        name: data.name
    });

});


// Sunlight
const sunlight = new THREE.PointLight(0xffffff, 120, 0);
scene.add(sunlight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Animation

// Pause and resume controls

// Orbital speed control
let speedMultiplier = 0.5;

const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

speedSlider.addEventListener('input', () => {
    speedMultiplier = Number(speedSlider.value);
    speedValue.textContent = speedMultiplier + 'x';
});

let isPaused = false;


// ===== SIMULATION TIME =====

// Starting date and time
const initialSimulationTime = new Date();
let simulationTime = new Date(initialSimulationTime);

// Track elapsed time
let lastSimulationFrame = performance.now();

const simulationDateElement = document.getElementById('simulation-date');
const simulationClockElement = document.getElementById('simulation-clock');
const resetTimeButton = document.getElementById('reset-time-button');

// Display the simulated date and time
function updateSimulationDisplay() {
    simulationDateElement.textContent =
        simulationTime.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase();

    simulationClockElement.textContent =
        simulationTime.toLocaleTimeString('en-GB', {
            hour12: false
        });
}

// Advance simulation time
function updateSimulationTime() {
    const now = performance.now();

    const delta = Math.min(
        (now - lastSimulationFrame) / 1000,
        0.1
    );

    lastSimulationFrame = now;

    if (!isPaused && !scenarioActive) {
        const simulatedMilliseconds =
            delta * 60000 * speedMultiplier;

        simulationTime = new Date(
            simulationTime.getTime() + simulatedMilliseconds
        );
    }

    updateSimulationDisplay();
}

// Reset simulation time
resetTimeButton.addEventListener('click', () => {
    simulationTime = new Date(initialSimulationTime);
    lastSimulationFrame = performance.now();
    updateSimulationDisplay();
});

// Show the initial time
updateSimulationDisplay();


const pauseButton = document.getElementById('pause-button');

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;

    pauseButton.textContent = isPaused
        ? 'Resume ▶'
        : 'Pause ⏸';
});


let scenarioActive = false;

function animate() {
    requestAnimationFrame(animate);

    // Only move planets when not paused
   if (!isPaused && !scenarioActive) {
        sun.rotation.y += 0.002;

       

planets.forEach((planet) => {
    planet.mesh.rotation.y += 0.01 * speedMultiplier;
    planet.orbit.rotation.y += planet.speed * speedMultiplier;

    // Animate the Moon around Earth
    if (planet.mesh.userData.moonOrbit) {
        planet.mesh.userData.moonOrbit.rotation.y +=
            0.02 * speedMultiplier;
    }

// Animate Io around Jupiter
if (planet.mesh.userData.ioOrbit) {
    planet.mesh.userData.ioOrbit.rotation.y +=
        0.025 * speedMultiplier;
}

// Animate Europa, Ganymede and Callisto
if (planet.mesh.userData.jupiterMoonOrbits) {
    planet.mesh.userData.jupiterMoonOrbits.forEach((moon) => {
        moon.orbit.rotation.y +=
            moon.speed * speedMultiplier;
    });
}


 // Animate Uranus moons
if (planet.mesh.userData.uranusMoonOrbits) {
    planet.mesh.userData.uranusMoonOrbits.forEach((moon) => {
        moon.orbit.rotation.y +=
            moon.speed * speedMultiplier;
    });
}


 // Animate Neptune moons
if (planet.mesh.userData.neptuneMoonOrbits) {
    planet.mesh.userData.neptuneMoonOrbits.forEach((moon) => {
        moon.orbit.rotation.y +=
            moon.speed * speedMultiplier;
    });
}




// Animate ISS around Earth
if (planet.mesh.userData.issOrbit) {
    planet.mesh.userData.issOrbit.rotation.y +=
        0.05 * speedMultiplier;
}

});


    }

  // Update cinematic camera movement
updateCameraFlight();
updateSimulationTime();


    // Only update OrbitControls outside Surprise scenarios
    if (!scenarioActive) {
        controls.update();
    }

    renderer.render(scene, camera);
}

animate();



// Adjust when the window changes size
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detect mouse clicks on planets
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
    console.log("Mouse click detected!");

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check which planet was clicked
   
const planetMeshes = planets.map(p => p.mesh);

const clickableObjects = [
    ...planetMeshes,
    ...clickableJupiterMoons,
    ...clickableOuterMoons,
    sun
];
if (moonForClick) {
    clickableObjects.push(moonForClick);
}

if (issModelForClick) {
    clickableObjects.push(issModelForClick);
}

const intersects = raycaster.intersectObjects(
    clickableObjects,
    true
);


    
if (intersects.length > 0) {
    const selectedObject = intersects[0].object;

    let name = selectedObject.userData.name;

console.log("Clicked object:", selectedObject.name);
console.log("Object information:", selectedObject.userData);


    // Identify ISS by checking its parent objects
    let currentObject = selectedObject;

    while (currentObject && !name) {
        if (currentObject === issModelForClick) {
            name = "ISS";
            break;
        }

        currentObject = currentObject.parent;
    }





const info = name === "ISS"
    ? issInfo
    : name === "Sun"
        ? sunInfo
        : name === "Moon"
            ? moonInfo
            : jupiterMoonInfo[name] || outerMoonInfo[name] || planetInfo[name];



if (!info) return;


// Reset Read More when selecting a new object
const extraText = info.extendedDescription || "";

extendedDescription.replaceChildren();

if (extraText) {
    const paragraphs = extraText.trim().split(/\n\s*\n/);

    paragraphs.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph.trim();
        extendedDescription.appendChild(p);
    });

    readMoreButton.hidden = false;
    readMoreButton.textContent = 'Read More';
} else {
    readMoreButton.hidden = true;
}

extendedDescription.hidden = true;


document.getElementById('planet-name').textContent = name;

 // Show the type of selected object
let objectType = "";



if (name === "Sun") {
    objectType = "☀️ Star";
} else if (name === "ISS") {
    objectType = "🛰️ Space Station";
} else if (name === "Moon") {
    objectType = "🌙 Moon of Earth";
} else if (name in jupiterMoonInfo) {
    objectType = "🌙 Moon of Jupiter";
} else if (["Titania", "Oberon", "Miranda"].includes(name)) {
    objectType = "🌙 Moon of Uranus";
} else if (["Triton", "Proteus"].includes(name)) {
    objectType = "🌙 Moon of Neptune";
} else {
    objectType = "🪐 Planet";
}



document.getElementById('object-type').textContent = objectType;


document.getElementById('planet-description').textContent =
    info.description;


const isISS = name === "ISS";
const isSun = name === "Sun";
const isMoon = name === "Moon" ||
    name in jupiterMoonInfo ||
    name in outerMoonInfo;

// Update the panel category


document.getElementById('info-category').textContent =
    isISS
        ? "SPACE STATION INFORMATION"
        : isSun
            ? "STAR INFORMATION"
            : isMoon
                ? "MOON INFORMATION"
                : "PLANET INFORMATION";



// Show different statistics depending on the object


const stats = isISS
    ? [
        ["Length", info.diameter],
        ["Altitude", info.distance],
        ["Orbital Period", info.day],
        ["Type", info.type]
    ]
    : isSun
        ? [
            ["Diameter", info.diameter],
            ["Location", info.distance],
            ["Rotation Period", info.day],
            ["Planetary System", info.moons],
            ["Star Type", info.type],
            ["Surface Temperature", info.temperature]
        ]
        
: isMoon
    ? [
        ["Diameter", info.diameter],
        [
            "Distance from " + (name === "Moon" ? "Earth" : info.moons),
            info.distance
        ],
        [
            name === "Moon" ? "Rotation Period" : "Orbital Period",
            info.day
        ],
        [
            "Parent Planet",
            name === "Moon" ? "Earth" : info.moons
        ],
        ["Moon Type", info.type],
        ["Surface Temperature", info.temperature]
    ]

            : [
                ["Diameter", info.diameter],
                ["Distance from Sun", info.distance],
                ["Day Length", info.day],
                ["Moons", info.moons],
                ["Planet Type", info.type],
                ["Average Temperature", info.temperature]
            ];



const statsContainer = document.getElementById('planet-stats');
statsContainer.replaceChildren();

stats.forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'stat-item';

    const labelElement = document.createElement('span');
    labelElement.className = 'stat-label';
    labelElement.textContent = label;

    const valueElement = document.createElement('span');
    valueElement.className = 'stat-value';
    valueElement.textContent = value;

    item.append(labelElement, valueElement);
    statsContainer.appendChild(item);
});

    }
});

// Read More / Read Less functionality
const readMoreButton = document.getElementById('read-more-button');
const extendedDescription = document.getElementById('extended-description');

readMoreButton.addEventListener('click', () => {
    const isExpanded = !extendedDescription.hidden;

    extendedDescription.hidden = isExpanded;

    readMoreButton.textContent = isExpanded
        ? 'Read More'
        : 'Read Less';
});


function startCameraFlight(destination) {

    // Remember the camera's current position
    cameraFlightFrom.copy(camera.position);

    // Set the destination
    cameraFlightTo.copy(destination);

    // Start the animation
    cameraFlightStart = performance.now();
    cameraFlightActive = true;

    // Prevent manual camera movement during the flight
    controls.enabled = false;
}


 // ===== GALAXY ZOOM TRANSITION =====

const galaxyView = document.getElementById('galaxy-view');
const exploreButton = document.getElementById('explore-button');
const backToGalaxyButton = document.getElementById('back-to-galaxy');

let galaxyTransitioning = false;

// Travel from the galaxy to the solar system
exploreButton.addEventListener('click', () => {
    console.log("Explore button clicked!");
    if (galaxyTransitioning) return;

    
    


    galaxyTransitioning = true;
    // Start far away and fly towards the planets
camera.position.copy(distantCameraPosition);
startCameraFlight(solarSystemCameraPosition);

    galaxyView.classList.remove('zooming-out');
    galaxyView.classList.add('zooming-in');

    // Fade out while zooming into the galaxy
    setTimeout(() => {
        galaxyView.style.transition = 'opacity 1.5s ease';
        galaxyView.style.opacity = '0';
    }, 900);

    // Reveal the solar system
    setTimeout(() => {

// Restore the Solar System after a Surprise scenario
    if (scenarioActive) {
        if (solarCameraActive) {
            resetSolarApocalypse();
        } else {
            resetAlienInvasion();
        }
    }

        galaxyView.style.display = 'none';
        galaxyTransitioning = false;
    }, 2500);

});

// Travel back from the solar system to the galaxy

function returnToGalaxy() {

    if (galaxyTransitioning) return;
    galaxyTransitioning = true;

    // First, fly away from the solar system
    startCameraFlight(distantCameraPosition);

    // Keep the galaxy hidden during most of the flight
    galaxyView.style.display = 'none';
    galaxyView.style.transition = 'none';
    galaxyView.style.opacity = '0';

    // Show the galaxy near the end of the camera flight
    setTimeout(() => {

        galaxyView.classList.remove('zooming-out');
        galaxyView.classList.add('zooming-in');

        galaxyView.style.display = 'block';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                galaxyView.style.transition = 'opacity 1.5s ease';
                galaxyView.style.opacity = '1';

                galaxyView.classList.remove('zooming-in');
                galaxyView.classList.add('zooming-out');

            });
        });

    }, 2500);

    // Finish the transition
    setTimeout(() => {
        galaxyTransitioning = false;
    }, 5000);

}

// Back to Galaxy button
backToGalaxyButton.addEventListener('click', returnToGalaxy);

 // ===== SPACE RADIO =====



const radioTracks = [
    {
        name: "First Light Particles",
        file: "music/first_light_particles.wav"
    },
    {
        name: "Sparkling Cosmic Dust",
        file: "music/sparkling_cosmic_dust.wav"
    },
    {
        name: "Exploration Theme",
        file: "music/exploration_theme.wav"
    },
    {
        name: "Magic Space",
        file: "music/magic_space.mp3"
    },
    {
        name: "Out There",
        file: "music/out_there.ogg"
    },
    {
        name: "Slowly Running",
        file: "music/slowly_running.mp3"
    },
    {
        name: "Ville Seppänen",
        file: "music/ville_seppanen.mp3"
    }
];



const spaceAudio = document.getElementById('space-audio');
const radioPlay = document.getElementById('radio-play');
const radioPrevious = document.getElementById('radio-previous');
const radioNext = document.getElementById('radio-next');
const radioTrackName = document.getElementById('radio-track-name');
const radioVolume = document.getElementById('radio-volume-slider');

let currentTrack = 0;

spaceAudio.volume = 0.25;

// Load a selected track
function loadRadioTrack() {
    spaceAudio.src = radioTracks[currentTrack].file;
    radioTrackName.textContent = radioTracks[currentTrack].name;
}

// Play or pause the music
radioPlay.addEventListener('click', async () => {
    if (spaceAudio.paused) {
        try {
            await spaceAudio.play();
            radioPlay.textContent = '⏸';
        } catch (error) {
            console.error("Could not play music:", error);
        }
    } else {
        spaceAudio.pause();
        radioPlay.textContent = '▶';
    }
});

// Change track
async function changeRadioTrack(direction) {
    const wasPlaying = !spaceAudio.paused;

    currentTrack =
        (currentTrack + direction + radioTracks.length) % radioTracks.length;

    loadRadioTrack();

    if (wasPlaying) {
        try {
            await spaceAudio.play();
        } catch (error) {
            console.error("Could not play music:", error);
        }
    }
}

radioPrevious.addEventListener('click', () => {
    changeRadioTrack(-1);
});

radioNext.addEventListener('click', () => {
    changeRadioTrack(1);
});

// Adjust volume
radioVolume.addEventListener('input', () => {
    spaceAudio.volume = Number(radioVolume.value) / 100;
});


 // Automatically play the next track
spaceAudio.addEventListener('ended', async () => {
    currentTrack = (currentTrack + 1) % radioTracks.length;

    loadRadioTrack();

    try {
        await spaceAudio.play();
    } catch (error) {
        console.error("Could not play next track:", error);
    }
});


// Keep the button synchronised with playback
spaceAudio.addEventListener('play', () => {
    radioPlay.textContent = '⏸';
});

spaceAudio.addEventListener('pause', () => {
    radioPlay.textContent = '▶';
});

// Load the first track without autoplay
loadRadioTrack();



 

 // ===== SURPRISE SCENARIOS =====


// ===== SURPRISE MENU =====

const surpriseButton = document.getElementById('surprise-button');
const surpriseOptions = document.getElementById('surprise-options');

// Open and close the Surprise menu
surpriseButton.addEventListener('click', () => {
    surpriseOptions.hidden = !surpriseOptions.hidden;
});

// ===== ALIEN INVASION =====

const alienButton = document.getElementById('scenario-alien');

alienButton.addEventListener('click', () => {
    if (scenarioActive) return;

    scenarioActive = true;
surpriseOptions.hidden = true;

// Let the cinematic camera take control
controls.enabled = false;

    // Show UFO above Earth
    const earth = planets.find(planet =>
        planet.name === "Earth"
    );

    if (earth) {
        const earthPosition = new THREE.Vector3();
        earth.mesh.getWorldPosition(earthPosition);

        
 // ===== UFO APPROACH =====

// Save Earth's position
const ufoTarget = earthPosition.clone();
ufoTarget.y += 8;

// Start the UFO far away from Earth
const ufoStart = earthPosition.clone();
ufoStart.x += 100;
ufoStart.y += 35;
ufoStart.z -= 60;

// Position UFO at the starting point
// Place UFO at the hyperspace arrival point
ufo.position.copy(ufoStart);


 // Place UFO at the hyperspace arrival point
ufo.position.copy(ufoStart);

// ===== CINEMATIC CAMERA START =====

// Position camera near the hyperspace arrival
camera.position.copy(ufoStart);
camera.position.add(new THREE.Vector3(0, 12, 28));

// Aim the camera at the hyperspace arrival
camera.lookAt(ufoStart);

// Keep UFO hidden until hyperspace opens
ufo.visible = false;


// Keep UFO hidden until hyperspace opens
ufo.visible = false;

// Give the camera time to reach the arrival point
// Hyperspace arrival
setTimeout(() => {

    // Purple explosion
    createHyperspaceBurst(ufoStart);

    // UFO emerges while the explosion is still visible
    setTimeout(() => {
        ufo.visible = true;
    }, 150);

}, 250);
// Animate UFO towards Earth
const flightStartTime = performance.now() + 400;
const flightDuration = 5000;

function animateUfoFlight(now) {
    const elapsed = now - flightStartTime;
    const progress = Math.max(0, Math.min(elapsed / flightDuration, 1));

    // Smooth deceleration near Earth
    const smoothProgress = 1 - Math.pow(1 - progress, 3);

    
    // Move UFO towards Earth
    ufo.position.lerpVectors(
        ufoStart,
        ufoTarget,
        smoothProgress
    );

    // ===== CINEMATIC UFO CAMERA =====

    // Camera follows the UFO from behind and above
    const cameraOffset = new THREE.Vector3(0, 12, 28);

    const desiredCameraPosition = ufo.position.clone().add(cameraOffset);

    // Smooth camera movement
    camera.position.lerp(desiredCameraPosition, 0.06);

   
    // Keep the camera focused on the UFO during its arrival
const lookAhead = Math.min(progress * 0.35, 0.35);

const cameraTarget = ufo.position.clone().lerp(
    earthPosition,
    lookAhead
);

camera.lookAt(cameraTarget);
    



    if (progress < 1) {
        requestAnimationFrame(animateUfoFlight);
    } else {
        console.log("UFO has reached Earth!");

        chargeUfoWeapon();
    }
}

requestAnimationFrame(animateUfoFlight);

    }

    console.log("Alien Invasion started!");
});




 // ===== 3D UFO =====

const ufo = new THREE.Group();


 // ===== UFO ENERGY WEAPON =====

// Purple energy core
const ufoWeapon = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.9
    })
);

// Position weapon underneath the UFO
ufoWeapon.position.set(0, -2.5, 2.5);

// Keep weapon hidden until charging begins
ufoWeapon.visible = false;

// Attach weapon to the UFO
ufo.add(ufoWeapon);

// Purple light for the weapon
const ufoWeaponLight = new THREE.PointLight(
    0xa855f7,
    0,
    15
);

ufoWeaponLight.position.set(0, -2.5, 2.5);
ufo.add(ufoWeaponLight);


// Main metallic saucer
const ufoBody = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 4.5, 1, 32),
    new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.85,
        roughness: 0.25
    })
);

ufo.add(ufoBody);

// Glowing dome
const ufoDome = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 16),
    new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        emissive: 0x6d28d9,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.2
    })
);

ufoDome.position.y = 0.6;
ufoDome.scale.y = 0.6;
ufo.add(ufoDome);

// Lights around the saucer
for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;

    const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0x22d3ee
        })
    );

    light.position.set(
        Math.cos(angle) * 4.1,
        -0.35,
        Math.sin(angle) * 4.1
    );

    ufo.add(light);
}

// Add UFO to the scene, but keep it hidden
ufo.visible = false;
scene.add(ufo);



 // ===== PURPLE HYPERSPACE BURST =====

function createHyperspaceBurst(position) {
    const particleCount = 70;
    const particles = new THREE.Group();

    const particleGeometry = new THREE.SphereGeometry(0.3, 6, 6);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 1
    });

    const directions = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
            particleGeometry,
            particleMaterial
        );

        particle.position.copy(position);

        const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();

        directions.push(direction);
        particles.add(particle);
    }

    scene.add(particles);

    const startTime = performance.now();
    const duration = 800;

    function animateBurst(now) {
        const progress = Math.min(
            (now - startTime) / duration,
            1
        );

        particles.children.forEach((particle, index) => {
            particle.position.copy(position).addScaledVector(
                directions[index],
                progress * 12
            );

            particle.scale.setScalar(1 - progress);
        });

        particleMaterial.opacity = 1 - progress;

        if (progress < 1) {
            requestAnimationFrame(animateBurst);
        } else {
            scene.remove(particles);
            particleGeometry.dispose();
            particleMaterial.dispose();
        }
    }

    requestAnimationFrame(animateBurst);
}

// ===== UFO WEAPON CHARGING =====

function chargeUfoWeapon() {

    console.log("WEAPON CHARGING STARTED!");

    const chargeDuration = 2000;
    const startTime = performance.now();

    ufoWeapon.visible = true;
    ufoWeapon.scale.setScalar(0.1);

    function animateCharging(now) {
        const progress = Math.min(
            (now - startTime) / chargeDuration,
            1
        );

        // Energy sphere grows while charging
        const size = 0.1 + progress * 1.4;
        ufoWeapon.scale.setScalar(size);

        // Purple light becomes stronger
        ufoWeaponLight.intensity = progress * 8;

        // Pulsating energy effect
        ufoWeapon.material.opacity =
            0.65 + Math.sin(now * 0.02) * 0.25;

       
if (progress < 1) {
    requestAnimationFrame(animateCharging);
} else {
    console.log("UFO weapon fully charged!");

    // Find Earth
    const earth = planets.find(planet => planet.name === "Earth");

    if (earth) {
        // Get Earth's exact position
        const earthPosition = new THREE.Vector3();
        earth.mesh.getWorldPosition(earthPosition);

        // Fire the laser towards Earth
        fireUfoLaser(earthPosition);
    }

    // Hide the charging energy sphere
    ufoWeapon.visible = false;
    ufoWeaponLight.intensity = 0;
}

    }

    requestAnimationFrame(animateCharging);
}



 // ===== UFO LASER BEAM =====

function fireUfoLaser(earthPosition) {
    // Get weapon position in world coordinates
    const weaponPosition = new THREE.Vector3();
    ufoWeapon.getWorldPosition(weaponPosition);

    const direction = new THREE.Vector3()
        .subVectors(earthPosition, weaponPosition);

    const distance = direction.length();

    if (distance === 0) return;

    // Create a purple beam
    const laserGeometry = new THREE.CylinderGeometry(
        0.25, 0.25, distance, 16
    );

    const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.95
    });

    const laser = new THREE.Mesh(laserGeometry, laserMaterial);

    // Position the beam between the weapon and Earth
    laser.position.copy(weaponPosition)
        .add(earthPosition)
        .multiplyScalar(0.5);

    // Align the beam towards Earth
    laser.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
    );

    scene.add(laser);

   
    // Remove the laser and destroy Earth after impact
    setTimeout(() => {
        scene.remove(laser);
        laserGeometry.dispose();
        laserMaterial.dispose();

        // Find Earth
        const earth = planets.find(planet =>
            planet.name === "Earth"
        );

        if (earth) {
            // Find Earth's current position
            const explosionPosition = new THREE.Vector3();
            earth.mesh.getWorldPosition(explosionPosition);

            // Create the explosion before hiding Earth
            createEarthExplosion(explosionPosition, 2);

            // Hide Earth without deleting it
            earth.mesh.visible = false;

            console.log("Earth has been destroyed!");
            // Return to the galaxy after the explosion
setTimeout(() => {
    returnToGalaxy();
}, 1800);
        }
    }, 650);

}


 // ===== EARTH EXPLOSION =====

function createEarthExplosion(position, radius) {
    const explosion = new THREE.Group();
    const particles = [];
    const particleCount = 250;

    const colors = [
        0xff4500,
        0xffa500,
        0xffff00,
        0xa855f7
    ];

    for (let i = 0; i < particleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 1
        });

        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 6, 6),
            material
        );

        // Start inside Earth's volume
        const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();

        particle.position.copy(direction).multiplyScalar(
            Math.random() * radius
        );

        particle.userData.velocity = direction.multiplyScalar(
            0.15 + Math.random() * 0.4
        );

        explosion.add(particle);
        particles.push(particle);
    }

    explosion.position.copy(position);
    scene.add(explosion);

    const startTime = performance.now();
    const duration = 2500;

    function animateEarthExplosion(now) {
        const progress = Math.min(
            (now - startTime) / duration,
            1
        );

        particles.forEach(particle => {
            particle.position.add(particle.userData.velocity);
            particle.material.opacity = 1 - progress;
            particle.scale.setScalar(1 - progress * 0.8);
        });

        if (progress < 1) {
            requestAnimationFrame(animateEarthExplosion);
        } else {
            scene.remove(explosion);

            particles.forEach(particle => {
                particle.geometry.dispose();
                particle.material.dispose();
            });
        }
    }

    requestAnimationFrame(animateEarthExplosion);
}



 // ===== RESET ALIEN INVASION =====

function resetAlienInvasion() {

    // Restore Earth
    const earth = planets.find(planet => planet.name === "Earth");

    if (earth) {
        earth.mesh.visible = true;
    }

    // Hide the UFO and its weapon
    ufo.visible = false;
    ufoWeapon.visible = false;
    ufoWeaponLight.intensity = 0;

    // Resume the solar system
    scenarioActive = false;

    console.log("Alien Invasion reset!");
}



 // ===== SOLAR APOCALYPSE =====

const solarApocalypseButton = document.getElementById('scenario-sun');

solarApocalypseButton.addEventListener('click', () => {

    // Prevent multiple scenarios at the same time
    if (scenarioActive) return;

    // Freeze the solar system
    scenarioActive = true;

    // Close the Surprise menu
    surpriseOptions.hidden = true;

    // Disable manual camera controls
    controls.enabled = false;

    // ===== SOLAR APOCALYPSE CAMERA =====

// Activate camera tracking towards the Sun
solarCameraActive = true;

// Choose a cinematic position near the Sun
const solarCameraDestination = new THREE.Vector3(0, 12, 24);

// Start the smooth camera movement
startCameraFlight(solarCameraDestination);

// Start charging after the camera reaches the Sun
setTimeout(() => {
    chargeSolarApocalypse();
}, cameraFlightDuration);

    console.log("Solar Apocalypse started!");


    // Check all objects before destruction
    const destructionTargets = getSolarDestructionTargets();

    console.log("===== SOLAR DESTRUCTION TARGETS =====");
    console.log("Total objects found:", destructionTargets.length);

    console.table(
        destructionTargets.map(target => ({
            name: target.name,
            visible: target.mesh.visible
        }))
    );


});



 // ===== SOLAR APOCALYPSE CHARGING =====

function chargeSolarApocalypse() {

    const chargeDuration = 4000;
    const startTime = performance.now();


    // ===== SOLAR CINEMATIC ZOOM OUT =====

    // Remember the camera's current position
    const solarZoomStart = camera.position.clone();

    // Calculate a wide view of the entire Solar System
    const solarZoomEnd = getSolarApocalypseCameraPosition();


    // Remember the Sun's original size
    const originalSunScale = sun.scale.clone();

    // Create an additional orange glow around the Sun
    const solarGlow = new THREE.Mesh(
        new THREE.SphereGeometry(3.3, 48, 48),
        new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.2,
            depthWrite: false
        })
    );

    sun.add(solarGlow);

    function animateSolarCharge(now) {
        const progress = Math.min(
            (now - startTime) / chargeDuration,
            1
        );


        // ===== CINEMATIC CAMERA ZOOM OUT =====

        // Smooth acceleration and deceleration
        const smoothProgress =
            progress * progress * (3 - 2 * progress);

        // Slowly move the camera away from the Sun
        camera.position.lerpVectors(
            solarZoomStart,
            solarZoomEnd,
            smoothProgress
        );

        // Keep the Sun centred during the zoom
        camera.lookAt(sun.position);


        // The Sun expands gradually and pulses
        const pulse = Math.sin(now * 0.025) * 0.05;
        const size = 1 + progress * 0.6 + pulse;

        sun.scale.copy(originalSunScale).multiplyScalar(size);

        // The glow grows and becomes brighter
        solarGlow.scale.setScalar(1 + progress * 0.5);
        solarGlow.material.opacity = 0.2 + progress * 0.5;

        if (progress < 1) {
    requestAnimationFrame(animateSolarCharge);
} else {
    console.log("Solar Apocalypse fully charged!");

    // Create a large explosion at the Sun
    const sunPosition = new THREE.Vector3();
    sun.getWorldPosition(sunPosition);

    createEarthExplosion(sunPosition, 5);

    // Hide the Sun and its orange glow
    sun.visible = false;

    // Release the solar shockwave
    createSolarShockwave();
}
    }

    requestAnimationFrame(animateSolarCharge);
}


 // ===== SOLAR APOCALYPSE WIDE CAMERA =====

function getSolarApocalypseCameraPosition() {

    // Find the outermost planet's distance from the Sun
    let maxDistance = 0;

    planets.forEach(planet => {
        const planetPosition = new THREE.Vector3();

        planet.mesh.getWorldPosition(planetPosition);

        const distance = planetPosition.distanceTo(sun.position);

        if (distance > maxDistance) {
            maxDistance = distance;
        }
    });

    // Position camera above and away from the Solar System
    return new THREE.Vector3(
        0,
        maxDistance * 1.5,
        maxDistance * 2
    );
}


 // ===== SOLAR APOCALYPSE SHOCKWAVE =====

function createSolarShockwave() {

    // Find the distance to the outermost planet
    let maxDistance = 0;

    planets.forEach(planet => {
        const position = new THREE.Vector3();
        planet.mesh.getWorldPosition(position);

        const distance = position.distanceTo(sun.position);
        maxDistance = Math.max(maxDistance, distance);
    });

    // Create a glowing energy wave
    const shockwaveGeometry = new THREE.RingGeometry(
        0.92, 1, 128
    );

    const shockwaveMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });

    const shockwave = new THREE.Mesh(
        shockwaveGeometry,
        shockwaveMaterial
    );

    // Lay the ring across the planets' orbital plane
    shockwave.rotation.x = -Math.PI / 2;
    shockwave.position.copy(sun.position);

    scene.add(shockwave);

    const startTime = performance.now();
    const duration = 5000;
    const maximumRadius = Math.max(maxDistance * 1.2, 10);

    // Find all planets, moons and ISS
const destructionTargets = getSolarDestructionTargets();

// Remember which objects the shockwave has reached
const hitTargets = new Set();

    function animateShockwave(now) {

        const progress = Math.min(
            (now - startTime) / duration,
            1
        );

        // Expand the wave from the Sun
        const radius = 3 + progress * maximumRadius;

        // Hide orbit lines as the shockwave reaches them
orbitLines.forEach(line => {

    // Find the orbit radius using its geometry
    line.geometry.computeBoundingSphere();

    const orbitRadius = line.geometry.boundingSphere.radius;

    // Remove the orbit line when the shockwave reaches it
    if (radius >= orbitRadius) {
        line.visible = false;
    }

});


        // ===== CHECK SHOCKWAVE IMPACTS =====

        destructionTargets.forEach(target => {

            // Do not register the same object twice
            if (hitTargets.has(target.mesh)) return;

            // Get the object's position in world coordinates
            const targetPosition = new THREE.Vector3();
            target.mesh.getWorldPosition(targetPosition);

            // Distance from the Sun
            const distance = targetPosition.distanceTo(sun.position);

            // Check whether the wave has reached the object
            
if (radius >= distance) {
    hitTargets.add(target.mesh);

    // Find the object's approximate size
    let objectRadius = 0.5;

    if (target.mesh.geometry) {
        target.mesh.geometry.computeBoundingSphere();

        objectRadius =
            target.mesh.geometry.boundingSphere.radius;
    }

    // Create an explosion at the object's position
    createEarthExplosion(targetPosition, objectRadius);

    // Hide the complete object
    target.mesh.visible = false;

    console.log(
        "Destroyed by shockwave: " + target.name
    );
}

        });


        shockwave.scale.set(radius, radius, 1);

        // Fade out towards the end
        shockwaveMaterial.opacity = 0.9 * (1 - progress);

        if (progress < 1) {
            requestAnimationFrame(animateShockwave);
       
} else {
    scene.remove(shockwave);
    shockwaveGeometry.dispose();
    shockwaveMaterial.dispose();

    

    console.log("Solar shockwave finished!");

    // Show that the Solar System has disappeared
const galaxySunLabel = document.getElementById('galaxy-sun-label');
galaxySunLabel.textContent = '?';

// Hide the Sun marker dot after Solar Apocalypse
document.getElementById('galaxy-sun-dot').style.display = 'none';

    // Return to the galaxy after the Solar Apocalypse
setTimeout(() => {
    returnToGalaxy();
}, 1200);
}

    }

    requestAnimationFrame(animateShockwave);
}


 // ===== SOLAR APOCALYPSE PLANET DESTRUCTION =====

function destroyPlanet(planet) {

    // Do not destroy the same planet twice
    if (!planet.mesh.visible) return;

    // Find the planet's position
    const planetPosition = new THREE.Vector3();
    planet.mesh.getWorldPosition(planetPosition);

    // Get the planet's approximate size
    const planetRadius =
        planet.mesh.geometry.boundingSphere?.radius || 2;

    // Create an explosion at the planet's position
    createEarthExplosion(planetPosition, planetRadius);

    // Hide the planet
    planet.mesh.visible = false;

    console.log(planet.name + " has been destroyed!");
}

 // ===== SOLAR APOCALYPSE OBJECT LIST =====


 // ===== SOLAR APOCALYPSE OBJECT LIST =====

function getSolarDestructionTargets() {
    const targets = [];
    const addedObjects = new Set();

    function addTarget(object, name) {
        if (!object || addedObjects.has(object)) return;

        addedObjects.add(object);

        targets.push({
            mesh: object,
            name: name
        });
    }

    // Add all eight planets
    planets.forEach(planet => {
        addTarget(planet.mesh, planet.name);

        // Find all moons and the complete ISS
        planet.orbit.traverse(object => {

            const name = object.userData?.name;

            // Add the entire ISS group as one object
            if (name === "ISS" && object.isGroup) {
                addTarget(object, "ISS");
                return;
            }

            // Ignore individual ISS model components
            let parent = object.parent;

            while (parent) {
                if (parent.userData?.name === "ISS") {
                    return;
                }

                parent = parent.parent;
            }

            // Add named moon meshes
            if (object.isMesh && name && name !== planet.name) {
                addTarget(object, name);
            }
        });
    });

    return targets;
}



 // ===== RESET SOLAR APOCALYPSE =====

function resetSolarApocalypse() {

    // Restore the Sun
    sun.visible = true;
    sun.scale.set(1, 1, 1);

    // Remove the temporary solar glow
    const solarGlow = sun.children.find(
        child => child.isMesh
    );

    if (solarGlow) {
        sun.remove(solarGlow);
        solarGlow.geometry.dispose();
        solarGlow.material.dispose();
    }

    // Restore all planets, moons and ISS
    const targets = getSolarDestructionTargets();

    targets.forEach(target => {
        target.mesh.visible = true;
    });

    // Restore planetary orbit lines
    orbitLines.forEach(line => {
        line.visible = true;
    });

    // Restore SUN marker in the galaxy
    document.getElementById('galaxy-sun-label').textContent = 'SUN';
    document.getElementById('galaxy-sun-dot').style.display = '';

    // Reset the cinematic camera state
    solarCameraActive = false;

    // Resume the simulation
    scenarioActive = false;

    console.log("Solar Apocalypse reset!");
}
   