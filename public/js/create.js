const API_URL = 'http://127.0.0.1:3000/accounts';

const accountForm = document.getElementById('accountForm');
const accountIdInput = document.getElementById('id');
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
            const response = await fetch(`${API_URL}/?id=${goToEdit}`);
            if (response.ok) {
                const account = await response.json();
            
                accountIdInput.value = account.id
                dominioInput.value = account.dominio;
                emailInput.value = account.email;
                userInput.value = account.user;
                passwordInput.value = account.password;
                additionalInfoInput.value = account.additional_info || '';
            }
        } catch (error) {
            console.error('Error retrieving data for editing:', error);
        }
    }
}

document.addEventListener('submit', async function(event) {

    if (!event.target && event.target.id !== 'accountForm') {
        return;
    }

    event.preventDefault()

    const idField = event.target.querySelector('#id');

    const id = idField ? idField.value : null;
    
    const accountData = {
        dominio: event.target.querySelector('#dominio').value,
        email: event.target.querySelector('#email').value,
        user: event.target.querySelector('#user').value,
        password: event.target.querySelector('#password').value,
        additional_info: event.target.querySelector('#additional_info').value,
    };

    try {
        let response;
        if (id) {

            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' , 'Accept': 'application/json'},
                body: JSON.stringify(accountData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountData)
            });
        }

        if (response && response.ok) {
            console.log("Data saved. Redirecting...")
            window.location.href = 'index.html';
        } else {
            const errorText = await response.text();
            console.error('Error saving account:', error);
            alert(`Server rejected data: ${errorText}`);
        }

    } catch (error) {
        console.error('Error saving account:', error, `${API_URL}/${id}`);
        alert('Error saving data.');
    }

});


btnLimpar.addEventListener('click', () => {
    accountForm.reset();
    accountIdInput.value = '';
    window.location.search = ''; 
});