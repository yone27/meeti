import { OpenStreetMapProvider } from 'leaflet-geosearch'
// https://esri.github.io/esri-leaflet/examples/reverse-geocoding.html

if (document.getElementById('mapa')) {
    // obtener valores de la db
    const lat = document.querySelector('#lat').value || 10.500000
    const lng = document.querySelector('#lng').value || -66.916664
    const direccion = document.querySelector('#direccion').value || ''
    const map = L.map('mapa').setView([lat, lng], 15)

    let markers = new L.featureGroup().addTo(map)
    let marker

    // utilizar el provider y geoCoder
    const geocodeService = L.esri.Geocoding.geocodeServide()
    const provider = new OpenStreetMapProvider()

    // colocar el pin en edición 
    if (lat && lng) {
        // agregar el pin
        marker = new L.marker([lat, lng], {
            draggable: true,
            autoPan: true
        })
            .addTo(map)
            .bindPopup(direccion)
            .openPopup()

        // asignar al contenedor markes
        markers.addLayer(marker)

        // detectar movimiento del marker
        marker.on('moveend', function (e) {
            marker = e.target
            const position = marker.getLatLng()
            map.panTo(new L.LatLng(position.lat, position.lng))
            // reverse geocoding, cuando el usuario reubica el pin

            geocodeService.reverse().latlng(position, 15).run(function (error, result) {
                llenarInputs(result)
                // asigna los valores al popup del marker
                marker.bindPopup(result.address.LongLabel)
            })
        })
    }

    document.addEventListener('DOMContentLoaded', () => {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Buscar la direccion
        document.getElementById('formbuscador')
            .addEventListener('input', buscarDireccion)
    })

    function buscarDireccion(e) {
        if (e.target.value.length > 10) {
            // si existe un pin anterior limpiarlo
            markers.clearLayers()

            provider.search({ query: e.target.value })
                .then(res => {
                    geocodeService.reverse().latlng(res[0].bounds[0], 15).run(function (error, result) {
                        llenarInputs(result)
                        // mostrar el mapa
                        map.setView(res[0].bounds[0], 15)

                        // agregar el pin
                        marker = new L.marker(res[0].bounds[0], {
                            draggable: true,
                            autoPan: true
                        })
                            .addTo(map)
                            .bindPopup(res[0].label)
                            .openPopup()

                        // asignar al contenedor markes
                        markers.addLayer(marker)

                        // detectar movimiento del marker
                        marker.on('moveend', function (e) {
                            marker = e.target
                            const position = marker.getLatLng()
                            map.panTo(new L.LatLng(position.lat, position.lng))
                            // reverse geocoding, cuando el usuario reubica el pin

                            geocodeService.reverse().latlng(position, 15).run(function (error, result) {
                                llenarInputs(result)
                                // asigna los valores al popup del marker
                                marker.bindPopup(result.address.LongLabel)
                            })
                        })
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    function llenarInputs(res) {
        document.querySelector('#direccion').value = res.address.Address || ''
        document.querySelector('#ciudad').value = res.address.City || ''
        document.querySelector('#estado').value = res.address.Region || ''
        document.querySelector('#pais').value = res.address.CountryCode || ''
        document.querySelector('#lat').value = res.address.lat || ''
        document.querySelector('#lng').value = res.address.lng || ''
    }
}