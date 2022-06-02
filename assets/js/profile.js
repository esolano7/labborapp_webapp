var telefonoInput = document.querySelector('#telefono')
var telefonoInputObj = window.intlTelInput(telefonoInput, {
  onlyCountries: ['cr'],
  autoPlaceholder: 'polite',
  utilsScript: '../assets/js/intlTelUtils.js',
})

$(document).ready(function () {
  $('#telefono').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#telefono').val().length > 7) e.preventDefault()
  })
  $('#cedula').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#cedula').val().length > 8) e.preventDefault()
  })
  $('#ingresobruto').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#ingresobruto').val().length > 8) e.preventDefault()
  })
})

const query = new URLSearchParams(window.location.search)
const idPersona = query.get('id')

async function myPeople() {
  let people = await getMyPeople(idPersona)
  if (people.length === 1) {
    let estadoBadge = ''
    if (people[0].estado === 'aprobacion') {
      estado.label = 'Pend. Aprob.'
      estado.color = 'warning'
      estadoBadge = `<span class="badge mx-1 bg-${estado.color} text-white">${estado.label}</span>`
    } else if (people[0].estado === 'activo') {
      estado.label = 'Activo'
      estado.color = 'success'
      estadoBadge = `<span class="badge mx-1 bg-${estado.color} text-white">${estado.label}</span>`
    }
    $('#estado').html(estadoBadge)

    telefonoInputObj.setNumber(people[0].telefono)
    $('#nom').val(people[0].nom)
    $('#ap').val(people[0].ap)
    $('#email').val(people[0].email)
    $('#cedula').val(people[0].cedula)
    $('#actividadEconomica').val(people[0].actividadeconomica)
    $('#ingresobruto').val(people[0].ingresobruto)
    let fotosCedula = JSON.parse(people[0].fotosCedula)
    archivos(fotosCedula)
    let paquete = await getPaquetes(people[0].paquete)
    $('#paquete').html(paquete)
  }
}

function archivos(fotosCedula) {
  for (archivo of fotosCedula) {
    let foto = archivo.uploadURL
    let content = `<div class="list-group list-group-flush">
    <div class="list-group-item d-flex align-items-center">
    <div class="text-center">
      <img src="${foto.replace(
        'labborapptemp',
        'labborappfiles'
      )}" class="rounded">
    </div>
    </div>
  </div>`
    $('#archivos').append(content)
  }
}

function swalErrors(title, text) {
  Swal.fire({
    title: title,
    html: text,
    icon: 'error',
    confirmButtonText: 'Ok',
  })
}

function validarFormulario() {
  if ($('#nom').val().length === 0) {
    swalErrors('¡Alto!', 'Por favor, digitá el nombre')
    return 0
  }
  if ($('#ap').val().length === 0) {
    swalErrors('¡Alto!', 'Por favor, digitá los apellidos')
    return 0
  }
  if ($('#tipoid').val() == '01' && $('#cedula').val().length < 9) {
    swalErrors('¡Alto!', 'El número de cédula debe tener 9 dígitos')
    return 0
  }
  if (!telefonoInputObj.isValidNumber()) {
    swalErrors(
      '¡Error!',
      'Revisa el número de teléfono que digitaste. Algo no anda bien'
    )
    return 0
  }
  if ($('#email').val().length > 0 && !validar('email', $('#email').val())) {
    swalErrors(
      '¡Alto!',
      'Revisa el correo electrónico que digitaste. Algo no anda bien'
    )
    return 0
  }

  if ($('#actividadEconomica').val().length == 0) {
    swalErrors('¡Alto!', 'Digitá la actividad económica')
    return 0
  }
  if ($('#ingresobruto').val().length == 0) {
    swalErrors('¡Alto!', 'Te faltó escribir el ingreso bruto')
    return 0
  }

  console.log('validacion correcta')
  return 1

  let timerInterval
  Swal.fire({
    title: '¡Estamos validando los datos!',
    html: 'Por favor, esperá unos segundos',
    timer: 22000,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {}, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    },
  })

  return checkPeopleValidacion
}

async function getMyPeople(idPersona) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    let { id } = getUserData()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/userspeople/getMyPeople/${id}/?idPersona=${idPersona}`,
      headers: { Authorization: `Bearer ${token}` },
      success: (response) => {
        resolve(response)
      },
      error: (err) => {
        reject(err)
        cuentaErrores++
      },
    })
  })
}

async function getPaquetes(idPaquete) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/paquetes/?id=${idPaquete}`,
      success: (response) => {
        let paquete = response[0]
        let incluyeFormated = ''
        let { incluye } = JSON.parse(paquete.incluyeApp)
        incluye.forEach((incluye) => {
          incluyeFormated += `<li class="py-2 d-flex align-items-center">
            <!-- Icon -->
            <div
              class="icon icon-xs text-base icon-shape rounded-circle bg-soft-primary text-primary me-3"
            >
              <i class="bi bi-check"></i>
            </div>
            <!-- Text -->
            <p>${incluye}</p>
          </li>
        
        `
        })
        let content = `<div><h2 class="mb-3 text-muted font-semibold mt-6">${paquete.nombre}</h2>
        <!-- Price -->
        <div class="display-5 d-flex mt-5 text-heading">
          <div>¢<span class="">${paquete.precio}</span></div>
          <div
            class="text-muted text-base font-semibold align-self-end ms-1"
          >
            <span class="d-block mt-n8"> / mes</span>
          </div>
        </div>
        <!-- Text -->`
        if (paquete.descripcionApp != null) {
          content += `
          <p class="text-muted text-sm mt-3">
            ${paquete.descripcionApp}
          </p>
          `
        }
        content += `<hr class="opacity-0 my-2" />
        <!-- List -->
        <ul class="list-unstyled mb-5 paquete">
        ${incluyeFormated}
        </ul>`

        if (paquete.disclaimerApp != null) {
          content += `
          <p class="text-muted text-xs mt-3 mb-5 text-center">
            ${paquete.disclaimerApp}
          </p>
          `
        }

        resolve(content)
      },
      error: (err) => {
        reject(err)
        cuentaErrores++
      },
    })
  })
}

isLoginDashboard()
myPeople()
