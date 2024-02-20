document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login bem-sucedido:', data);
            window.location.href = '/home.html'; // Redireciona para a página Home
        } else {
            // Aqui, tratamos a resposta de erro do servidor
            console.error('Falha no login:', response.statusText);
            // Exibe uma mensagem de erro para o usuário
            displayErrorMessage('Login inválido. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        displayErrorMessage('Erro na conexão. Por favor, tente novamente mais tarde.');
    }
});

function displayErrorMessage(message) {
    // Remove a mensagem anterior, se houver
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Cria e exibe a nova mensagem de erro
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add('error-message');
    errorMessage.style.color = 'red'; // Estilize conforme necessário
    document.getElementById('loginForm').prepend(errorMessage);
}