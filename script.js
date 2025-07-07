document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');

    // --- TWOJE PROJEKTY ---
    // Edytuj tę listę, aby dodać, usunąć lub zmienić swoje projekty.
    // Aby dodać obrazek, wklej link do grafiki w polu `image`.
    // Jeśli nie chcesz obrazka, zostaw to pole puste (`image: ""`).
    const myProjects = [
        {
            name: "BuyBit - Crypto Trading Game",
            link: "topsoft-dev.github.io/BuyBit-Crypto-Trading-Game/",
            desc: "Gra o trejdowaniu kryptowalutami. Kupuj tanio, sprzedawaj drogo!",
            image: "https://topsoft-dev.github.io/BuyBit-Crypto-Trading-Game/BuyBit_logo.png" // Przykładowy link
        },
        {
            name: "Strona z prjektami",
            link: "",
            desc: "Moja osobista strona portfolio",
            image: "" // Brak obrazka
        }
        // Przykład nowego projektu:
        // ,
        // {
        //     name: "Nowy Super Projekt",
        //     link: "www.nowy-projekt.com",
        //     desc: "Opis nowego, wspaniałego projektu.",
        //     image: "https://link.do/twojego/obrazka.jpg"
        // }
    ];
    // --- KONIEC EDYCJI ---

    // Funkcja do wyświetlania projektów na stronie
    const displayProjects = (projects) => {
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = '<p>Brak projektów do wyświetlenia. Dodaj je w pliku script.js.</p>';
            return;
        }

        projectsGrid.innerHTML = ''; // Wyczyść siatkę przed dodaniem nowych kart

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`; // Opóźnienie dla animacji

            // Dodaj obrazek tła, jeśli istnieje
            const imageElement = project.image ? `<div class="card-image" style="background-image: url('${project.image}')"></div>` : '';

            card.innerHTML = `
                ${imageElement}
                <div class="card-content">
                    <h3 class="card-title">${project.name}</h3>
                    <p class="card-description">${project.desc}</p>
                    <a href="https://${project.link}" target="_blank" rel="noopener noreferrer" class="card-link">Zobacz projekt &rarr;</a>
                </div>
            `;

            projectsGrid.appendChild(card);
        });
    };

    // Uruchomienie - teraz bezpośrednio wywołujemy funkcję z naszą listą
    displayProjects(myProjects);
});
