document.addEventListener('DOMContentLoaded', function() {
    // Obtener el formulario
    const form = document.getElementById('contactForm');
    
    // Función para validar el formulario
    function validateForm() {
        'use strict';
        
        // Fetch all forms with needs-validation class
        const forms = document.querySelectorAll('.needs-validation');
        
        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }
    
    // Inicializar la validación del formulario
    validateForm();
    
    // Manejar el envío del formulario
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar el indicador de carga
            const loading = form.querySelector('.loading');
            const errorMessage = form.querySelector('.error-message');
            const sentMessage = form.querySelector('.sent-message');
            
            loading.style.display = 'block';
            errorMessage.style.display = 'none';
            sentMessage.style.display = 'none';
            
            try {
                // Preparar los datos del formulario
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Enviar los datos a la API de Django
                const response = await fetch('/api/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') // Función para obtener el token CSRF
                    },
                    body: JSON.stringify(data)
                });
                
                // Procesar la respuesta
                if (response.ok) {
                    // Mostrar mensaje de éxito
                    loading.style.display = 'none';
                    sentMessage.style.display = 'block';
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    throw new Error('Error al enviar el mensaje');
                }
            } catch (error) {
                // Mostrar mensaje de error
                loading.style.display = 'none';
                errorMessage.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';
                errorMessage.style.display = 'block';
            }
        });
    }
    
    // Función para obtener el token CSRF de Django
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}); 