import axios from 'axios'

document.addEventListener('DOMContentLoaded', () => {
    const asistencia = document.querySelector('#confirmar-asistencia')
    if(asistencia) {
        asistencia.addEventListener('submit', confirmAssistance)
    }
})

function confirmAssistance(e) {
    e.preventDefault()
    const btn = document.querySelector('#confirmar-asistencia input[type="submit"]')
    let accion = document.querySelector('#accion').value
    const datos = {
        accion
    }

    axios.post(this.action, datos)
        .then(res => {
            if(accion === 'Confirmar') {
                document.querySelector('#accion').value = 'Cancelar'
                btn.value = 'Cancelar'
                btn.classList.remove('btn-azul')
                btn.classList.add('btn-rojo')
            }else{
                document.querySelector('#accion').value = 'Confirmar'
                btn.value = 'Si'
                btn.classList.remove('btn-rojo')
                btn.classList.add('btn-azul')
            }
        })
}