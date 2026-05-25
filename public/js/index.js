    const API_URL = 'http://localhost:3000/accounts';
    const tableBody = document.getElementById('accountsTableBody');
    
    document.addEventListener('DOMContentLoaded', loadAccounts);

    async function loadAccounts() {
        try {
            const response = await fetch(API_URL);
            const accounts = await response.json();

            tableBody.innerHTML = '';

            if (accounts.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; color: #7c7c8a;">No account registered..</td>
                    </tr>
                `;
                return;
            }

            accounts.forEach(account => {
            const tr = document.createElement('tr');
            
            `
                <img
                    src="./assets/view.png"
                    style="width: 18px; height: 18px;"
                >
            `

            tr.innerHTML = `
                <td>${account.dominio}</td>
                <td>
                <div class="copy-field">
                    ${
                        account.email
                            ? `
                            <button
                                class="btn-copy"
                                onclick="copyText('${account.email}')"
                                title="Copy email"
                            >
                                            <img
                            src="./assets/copy.png"
                            style="width: 18px; height: 18px;"
                        >
                            </button>
                            `
                            : ''
                    }

                <span id="email-${account.id}">
                ${account.email || '-'}
                </span>
            </div>
        </td>

        <td>
            <div class="copy-field">
                ${
                    account.user
                        ? `
                        <button
                            class="btn-copy"
                            onclick="copyText('${account.user}')"
                            title="Copy user"
                        >
                                        <img
                        src="./assets/copy.png"
                        style="width: 18px; height: 18px;"
                    >
                        </button>
                        `
                        : ''
                }

                <span id="user-${account.id}">
                    ${account.user || '-'}
                </span>
            </div>
        </td>

        <td>
            <div class="copy-field">
                <button
                    class="btn-copy"
                    onclick="copyText('${account.password}')"
                    title="Copy password"
                >
                                <img
                        src="./assets/copy.png"
                        style="width: 18px; height: 18px;"
                    >
                </button>

                <span
                    id="password-${account.id}"
                    data-password="${account.password}"
                >
                    ********
                </span>
            </div>
        </td>

                <td>${account.additional_info || '-'}</td>

                <td class="actions">
                    <button 
                        class="btn-view"
                        onclick="togglePassword('${account.id}')"
                        title="Show password"
                    >
                        <img
                            src="./assets/view.png"
                            alt="Mostrar senha"
                            style="width: 18px; height: 18px;"
                        >
                    </button>

                    <button 
                        class="btn-edit" 
                        onclick="goToEdit('${account.id}')"
                    >
                        Edit
                    </button>

                    <button 
                        class="btn-delete" 
                        onclick="deleteAccount('${account.id}')"
                    >
                        Delete
                    </button>
                </td>
            `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error when searching for accounts:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #f75a68;">Error connecting to the server..</td>
                </tr>
            `;
        }
    }

    async function deleteAccount(id) {

        console.log("Deleting -> ",id)

        let response;

        if (confirm('Are you sure you want to delete this Domain??')) {
            try {
                response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }

        if (response && response.ok) {
            console.log("Account deleted. Redirecting...")
            loadAccounts();
        } else {
            const errorText = await response.text();
            console.log("Error deleting account:", errorText)
        }

    }

    function goToEdit(id) {
        window.location.href = `create.html?edit=${id}`;
    }

    function togglePassword(id) {
        const passwordElement = document.getElementById(`password-${id}`);
        const realPassword = passwordElement.dataset.password;

        if (passwordElement.textContent === '********') {
            passwordElement.textContent = realPassword;
        } else {
            passwordElement.textContent = '********';
        }
    }

    function copyText(text) {
        navigator.clipboard.writeText(text);
        showPopup("Copied!");
    }

    function showPopup(message ) {
        const popup = document.createElement("div");
    
        popup.textContent = message;
    
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
    
        popup.style.background = "#333";
        popup.style.color = "#fff";
        popup.style.padding = "12px 20px";
        popup.style.borderRadius = "8px";
        popup.style.zIndex = "9999";
        popup.style.fontSize = "14px";
    
        document.body.appendChild(popup);
    
        setTimeout(() => {
            popup.remove();
        }, 2000);
    }