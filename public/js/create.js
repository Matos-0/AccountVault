const API_URL = 'http://localhost:3000/accounts';

const accountForm = document.getElementById('accountForm');
const accountIdInput = document.getElementById('accountId');
const dominioInput = document.getElementById('dominio');
const emailInput = document.getElementById('email');
const userInput = document.getElementById('user');
const passwordInput = document.getElementById('password');
const additionalInfoInput = document.getElementById('additional_info');
const btnSalvar = document.getElementById('btnSalvar');
const btnLimpar = document.getElementById('btnLimpar');
const formTitle = document.getElementById('formTitle');

document.addEventListener('DOMContentLoaded', verifyEditMode);

async function verifyEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const goToEdit = urlParams.get('edit');

    if (goToEdit) {
        formTitle.innerText = 'Update Account';
        btnSalvar.innerText = 'Update Account';
        
        try {
            const response = await fetch(`${API_URL}/${goToEdit}`);
            if (response.ok) {
                const account = await response.json();
                
                accountIdInput.value = account.id;
                dominioInput.value = account.dominio;
                emailInput.value = account.email;
                userInput.value = account.user;
                passwordInput.Value = account.password;
                additionalInfoInput.value = account.additional_info || '';
            }
        } catch (error) {
            console.error('Error retrieving data for editing:', error);
        }
    }
}

accountForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const id = accountIdInput.value;
    const accountData = {
        dominio: dominioInput.value,
        email: emailInput.value,
        user: userInput.value,
        password: passwordInput.value,
        additional_info: additionalInfoInput.value,
    };

    try {
        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountData)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountData)
            });
        }
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error saving account:', error);
        alert('Error saving data.');
    }
});

btnLimpar.addEventListener('click', () => {
    accountForm.reset();
    accountIdInput.value = '';
    window.location.search = ''; 
});