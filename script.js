import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- Konfiguracja Firebase ---
    const firebaseConfig = {
        apiKey: "AIzaSyCRKyqcz7xd4ykSB7R1Tm_c_bmE8UVLiLE",
        authDomain: "topfund-1d82e.firebaseapp.com",
        projectId: "topfund-1d82e",
        storageBucket: "topfund-1d82e.firebasestorage.app",
        messagingSenderId: "1027710020899",
        appId: "1:1027710020899:web:2e70d77b312ce19242b096"
    };

    // --- Inicjalizacja Firebase ---
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const projectsGrid = document.getElementById('projects-grid');
    const loginButton = document.getElementById('login-button');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginErrorElement = document.getElementById('loginError');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdminPanel = document.getElementById('closeAdminPanel');
    const adminTabs = document.getElementById('admin-tabs');
    const permissionsContainer = document.getElementById('permissions-container');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const passwordUserSelect = document.getElementById('passwordUserSelect');
    const newPasswordInput = document.getElementById('newPassword');
    const passwordChangeStatus = document.getElementById('passwordChangeStatus');

    // --- TWOJE PROJEKTY ---
    const myProjects = [
        {
            id: "buybit",
            name: "BuyBit - Crypto Trading Game",
            link: "topsoft-dev.github.io/BuyBit-Crypto-Trading-Game/",
            desc: "Gra o trejdowaniu kryptowalutami. Kupuj tanio, sprzedawaj drogo!",
            image: "https://topsoft-dev.github.io/BuyBit-Crypto-Trading-Game/Logo.jpg"
        },
        {
            id: "calc",
            name: "Kalkulator Procentu Składanego",
            link: "topsoft-dev.github.io/Calc/",
            desc: "Szybki, sprawny, kalkulator procentu składanego z wbudowanymi kursami walut pobieranymi z internetu",
            image: "https://topsoft-dev.github.io/Calc/Logo.jpg"
        },
        {
            id: "btc-pension",
            name: "Kalkulator Emerytury BTC",
            link: "topsoft-dev.github.io/BTC-Pension/",
            desc: "Kalkulator szacujący wartośc emerytury HODLowanej w BTC",
            image: "https://topsoft-dev.github.io/BTC-Pension/Logo.jpg"
        },
        {
            id: "position-calc",
            name: "Kalkulator Pozycji",
            link: "topsoft-dev.github.io/Position-Calc/",
            desc: "Zaawansowany kalkulator do wyliczania pozycji pod autorską strategię",
            image: "https://topsoft-dev.github.io/Position-Calc/Logo.jpg",
            requiresLogin: true
        },
        {
            id: "topfund-terminal",
            name: "TopFund Terminal",
            link: "topsoft-dev.github.io/TopFund-Terminal/",
            desc: "Terminal TopFund",
            image: "https://topsoft-dev.github.io/TopFund-Terminal/Logo.jpg",
            requiresLogin: true
        }
    ];
    // --- KONIEC EDYCJI ---

    const displayProjects = (projects) => {
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = '<p>Brak projektów do wyświetlenia. Dodaj je w pliku script.js.</p>';
            return;
        }

        projectsGrid.innerHTML = '';

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`;

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

    displayProjects(myProjects);

    async function hashPassword(password) {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    loginButton.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;
        const hashedPassword = await hashPassword(password);

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", username));
            const usersSnapshot = await getDocs(q);

            if (usersSnapshot.empty) {
                loginErrorElement.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło.';
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc.data();

            if (userData.hashedPassword === hashedPassword) {
                if (userData.name === 'Topciu') {
                    loginModal.classList.add('hidden');
                    openAdminPanel();
                } else {
                    loginErrorElement.textContent = 'Brak uprawnień do panelu administracyjnego.';
                }
            } else {
                loginErrorElement.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło.';
            }
        } catch (error) {
            console.error("Błąd logowania: ", error);
            loginErrorElement.textContent = 'Wystąpił błąd podczas logowania.';
        }
    });

    async function openAdminPanel() {
        adminPanel.classList.remove('hidden');
        try {
            const allUsers = await fetchUsers();
            
            // Wszyscy użytkownicy (w tym Topciu) do zmiany hasła
            renderPasswordUsers(allUsers);

            // Tylko inni użytkownicy do zarządzania uprawnieniami
            const usersToManage = allUsers.filter(user => user.name !== 'Topciu');
            if (usersToManage.length > 0) {
                renderPermissions(usersToManage);
            } else {
                permissionsContainer.innerHTML = "<p>Brak innych użytkowników do zarządzania.</p>";
            }
        } catch (error) {
            console.error("Błąd podczas otwierania panelu admina:", error);
            permissionsContainer.innerHTML = "<p>Wystąpił błąd podczas ładowania danych.</p>";
        }
    }

    async function fetchUsers() {
        try {
            const usersRef = collection(db, "users");
            const snapshot = await getDocs(usersRef);
            const users = [];
            snapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            return users;
        } catch (error) {
            console.error("Błąd w fetchUsers:", error);
            return [];
        }
    }

    function renderPermissions(users) {
        permissionsContainer.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-permissions';
            let checkboxes = myProjects.filter(p => p.requiresLogin).map(project => `
                <div>
                    <input type="checkbox" id="${user.id}-${project.id}" data-user-id="${user.id}" data-project-id="${project.id}" ${user.permissions && user.permissions.includes(project.id) ? 'checked' : ''}>
                    <label for="${user.id}-${project.id}">${project.name}</label>
                </div>
            `).join('');

            userDiv.innerHTML = `<h4>${user.name}</h4>${checkboxes}`;
            permissionsContainer.appendChild(userDiv);
        });

        permissionsContainer.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox') {
                const userId = e.target.dataset.userId;
                const projectId = e.target.dataset.projectId;
                
                const allUsers = await fetchUsers();
                const user = allUsers.find(u => u.id === userId);
                let permissions = user.permissions || [];

                if (e.target.checked) {
                    if (!permissions.includes(projectId)) {
                        permissions.push(projectId);
                    }
                } else {
                    permissions = permissions.filter(p => p !== projectId);
                }
                
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { permissions });
            }
        });
    }

    function renderPasswordUsers(users) {
        passwordUserSelect.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            passwordUserSelect.appendChild(option);
        });
    }
    
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = passwordUserSelect.value;
        const newPassword = newPasswordInput.value;
    
        if (!newPassword) {
            passwordChangeStatus.textContent = 'Hasło nie może być puste.';
            return;
        }
    
        const hashedPassword = await hashPassword(newPassword);
        const userRef = doc(db, "users", userId);
    
        try {
            await updateDoc(userRef, { hashedPassword });
            passwordChangeStatus.textContent = `Hasło dla użytkownika ${passwordUserSelect.options[passwordUserSelect.selectedIndex].text} zostało zmienione.`;
            newPasswordInput.value = '';
        } catch (error) {
            console.error("Błąd zmiany hasła: ", error);
            passwordChangeStatus.textContent = 'Wystąpił błąd podczas zmiany hasła.';
        }
    });

    adminTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-link')) {
            document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab).classList.add('active');
        }
    });

    closeAdminPanel.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });
});