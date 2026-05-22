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
            tr.innerHTML = `
                <td>${account.dominio}</td>
                <td>${account.email || '-'}</td>
                <td>${account.user || '-'}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span id="password-${account.id}" data-password="${account.password}">
                            ********
                        </span>

                        <button 
                            type="button"
                            onclick="togglePassword('${account.id}')"
                            style="
                                background: none;
                                border: none;
                                cursor: pointer;
                                font-size: 16px;
                            "
                        >
                            <img
                                src="./assets/view.png" 
                                alt="Mostrar senha"
                                style="width: 20px; height: 20px;"
                            >
                        </button>
                    </div>
                </td>
                <td>${account.additional_info || '-'}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="goToEdit('${account.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteAccount('${account.id}')">Delete</button>
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
    if (confirm('Are you sure you want to delete this Domain??')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadAccounts(); 
        } catch (error) {
            console.error('Error deleting account:', error);
        }
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