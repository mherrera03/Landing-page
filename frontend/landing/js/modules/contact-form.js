// Formulario de contacto
// TEMPORAL: en la siguiente fase enviará los datos a la API (/api/solicitudes).
export function initContactForm(){
  document.getElementById('contactForm').addEventListener('submit',e=>{
    e.preventDefault();
    alert('Mockup: formulario enviado. En producción se conectaría a correo o base de datos.');
    e.target.reset();
  });
}
