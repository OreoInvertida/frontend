document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const button = document.getElementById('signup-button');

    form.addEventListener('input', () => {
        button.disabled = !form.checkValidity();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/signup-endpoint', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Cuenta registrada exitosamente');
            } else {
                alert('Hubo un error al registrar la cuenta');
            }
        });
    });
});