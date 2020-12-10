import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', ()=> {
    const formsEliminar = document.querySelectorAll('.eliminar-comentario')

    if(formsEliminar.length) {
        formsEliminar.forEach(form => {
            form.addEventListener('submit', deleteComment)
        })

    }
})

function deleteComment(e) {
    e.preventDefault()
    Swal.fire({
        title: 'Eliminar comentario?',
        text: 'Un comentario eliminado',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3095d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar',
        cancelButtonText: 'cancelar'
    }).then(result => {
        if(result.value) {
            // id del comentario
            const comentarioId = this.children[0].value
            
            // crear obj
            const datos = {
                comentarioId
            }

            // axios
            axios.post(this.action, datos)
                .then(res => {
                    Swal.fire('Eliminado', res.data)    
                    // eliminar del DOM
                    this.parentElement.parentElement.remove()
                })
                .catch(error => {
                    if(error.response.status === 404 || error.response.status === 403) {
                        Swal.fire('Error', error.response.data, 'error')    
                    }
                })       
        }
    })
}