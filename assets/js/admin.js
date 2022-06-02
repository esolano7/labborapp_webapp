// Create our number formatter.
var formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'CRC',
})

let estadoSeleccionado = ''
let tituloSeleccionado = ''

async function showList(estado, titulo) {
  $('#tablaUsuarios').collapse('hide')
  $('#tablaPersonas').collapse('show')
  estadoSeleccionado = estado
  tituloSeleccionado = titulo
  $('#titulo').html(titulo)
  $('#personas').DataTable().clear().draw()

  let people = await getPeople(estado)
  if (people.length != 0) {
    let counter = 1
    for (person of people) {
      let estado = {}
      if (person.estado === 'aprobacion') {
        estado.label = 'Pend. Aprob.'
        estado.color = 'warning'
      } else if (person.estado === 'activo') {
        estado.label = 'Activo'
        estado.color = 'success'
      } else if (person.estado === 'inactivo') {
        estado.label = 'Inactivo'
        estado.color = 'danger'
      }

      person.ingresoFormat = formatter.format(person.ingresobruto)
      addRow(person, estado)
      counter++
    }
  }
}

async function getPeople(estado) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/people/`,
      data: {
        estado,
      },
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

async function getPerson(id) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/people/${id}/`,
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

function addRow(person, estado) {
  let t = $('#personas').DataTable()
  counter = 1
  t.row
    .add([
      person.id,
      person.cedula,
      person.nom,
      person.ap,
      person.telefono,
      person.email,
      person.actividadeconomica,
      person.ingresoFormat,
      estado,
      person.id,
    ])
    .draw(false)
}

isLoginDashboard()

$(document).ready(function () {
  let t = $('#personas').DataTable({
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
    },
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excelHtml5',
        exportOptions: {
          columns: ':visible',
        },
      },
      {
        extend: 'pdfHtml5',
        exportOptions: {
          columns: ':visible',
        },
      },
      'colvis',
    ],
    scrollX: true,
    scrollCollapse: true,
    fixedColumns: true,
    columnDefs: [
      {
        target: 0,
        visible: false,
        searchable: false,
      },
      {
        target: 8,
        render: function (estado) {
          return `<span class="badge mx-1 bg-${estado.color} text-white">${estado.label}</span>`
        },
      },
      {
        target: 9,
        render: function (idPersona) {
          return `<span class="badge mx-1 bg-primary text-white" style="cursor: pointer;" onClick=detalles(${idPersona})><i class="bi bi-pencil" style="font-size: 13px;"></i></span>
          <span class="badge mx-1 bg-info text-white" style="cursor: pointer;" onClick=print(${idPersona})><i class="bi bi-printer" style="font-size: 13px;"></i></span>`
        },
      },
    ],
  })

  showList('activo')
})

var telefonoInput = document.querySelector('#telefono')
var telefonoInputObj = window.intlTelInput(telefonoInput, {
  onlyCountries: ['cr'],
  autoPlaceholder: 'polite',
  utilsScript: '../assets/js/intlTelUtils.js',
})

async function print(id) {
  window.open(`print.html?id=${id}`)
}

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

const peopleModal = new bootstrap.Modal('#peopleModal')
const myModalEl = document.getElementById('peopleModal')
myModalEl.addEventListener('hide.bs.modal', (event) => {
  const homeTab = new bootstrap.Tab('#home-tab')
  homeTab.show()
  $('#id').val('')
  $('#nom').val('')
  $('#ap').val('')
  $('#cedula').val('')
  $('#cedulaOriginal').val('')
  $('#tipoidOriginal').val('')
  telefonoInputObj.setNumber('')
  $('#actividadEconomica').val('')
  $('#ingresobruto').val('')
  $('#archivos').empty()
})

async function detalles(id) {
  let person = await getPerson(id)
  let datos = person[0]
  $('#id').val(datos.id)
  $('#nom').val(datos.nom)
  $('#ap').val(datos.ap)
  $('#cedula').val(datos.cedula)
  $('#cedulaOriginal').val(datos.cedula)
  $('#tipoidOriginal').val(datos.tipoid)
  telefonoInputObj.setNumber(datos.telefono)
  $('#actividadEconomica').val(datos.actividadeconomica)
  $('#ingresobruto').val(datos.ingresobruto)
  $('#paquetes').val(datos.paquete)
  $(`#estado-${datos.estado}`).prop('checked', true)
  let fotosCedula = JSON.parse(datos.fotosCedula)
  archivos(fotosCedula)
  peopleModal.show()
}

function archivos(fotosCedula) {
  for (archivo of fotosCedula) {
    let content = `<div class="list-group list-group-flush">
    <div class="list-group-item align-items-center">
    <div class="text-center">
      <img src="${archivo.uploadURL}" class="rounded">
    </div>
    <div class="text-center">
      <a href="${archivo.uploadURL}" target="_blank" class="btn btn-primary mt-5">Descargar</a>
    </div>
    </div>
    
  </div>`
    $('#archivos').append(content)
  }
}

let paquetesDisponibles = {}
function populatePaquetes() {
  $.ajax({
    method: 'GET',
    url: 'https://api.labbor.app/paquetes/',
    success: (response) => {
      response.forEach((paquete) => {
        $('#paquetes').append(
          `<option value="${paquete.id}">${paquete.nombre} - ${formatter.format(
            paquete.precio
          )}</option>`
        )
      })
    },
  })
}

populatePaquetes()

async function actualizarPersona() {
  Swal.fire({
    title: '¿Está seguro(a)',
    text: 'de actualizar los datos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, actualizar!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      let pruebaValidacion = await validacion()
      if (!pruebaValidacion) return
      finalizar()
    }
  })
}

async function finalizar() {
  let timerInterval
  Swal.fire({
    title: '¡Estamos procesando la información!',
    html: 'Por favor, esperá unos segundos',
    timer: 22000,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      timerInterval = setInterval(() => {}, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    },
  })
  let data = {
    nom: $('#nom').val(),
    ap: $('#ap').val(),
    tipoid: $('#tipoid').val(),
    cedula: $('#cedula').val(),
    telefono: telefonoInputObj.getNumber(),
    actividadEconomica: $('#actividadEconomica').val(),
    ingresobruto: $('#ingresobruto').val(),
    paquete: $('#paquetes').val(),
  }
  if ($('#email').val() !== '') {
    data = { email: $('#email').val(), ...data }
  }

  if ($('#estado-activo').prop('checked')) {
    data = { estado: 'activo', ...data }
  }
  if ($('#estado-inactivo').prop('checked')) {
    data = { estado: 'inactivo', ...data }
  }
  if ($('#estado-aprobacion').prop('checked')) {
    data = { estado: 'aprobacion', ...data }
  }

  let id = $('#id').val()
  try {
    await updatePeople(id, data)
    Swal.fire({
      icon: 'success',
      title: 'Los datos fueron actualizados',
      showConfirmButton: false,
      timer: 1500,
    })
    peopleModal.hide()
    showList(estadoSeleccionado, tituloSeleccionado)
  } catch (error) {
    swalErrors('¡Alto!', error)
  }
}

async function updatePeople(id, data) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'PATCH',
      url: `https://api.labbor.app/people/${id}/`,
      data,
      headers: { Authorization: `Bearer ${token}` },
      success: (response) => {
        resolve(response)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}

async function validacion() {
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
    swalErrors('¡Alto!', 'Por favor digitá la actividad económica')
    return 0
  }
  if ($('#ingresobruto').val().length == 0) {
    swalErrors('¡Alto!', 'Por favor digitá el ingreso')
    return 0
  }

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

  let tipoid = $('#tipoid').val()
  let cedula = $('#cedula').val()
  let tipoidOriginal = $('#tipoidOriginal').val()
  let cedulaOriginal = $('#cedulaOriginal').val()

  if (`${tipoid}${cedula}` !== `${tipoidOriginal}${cedulaOriginal}`) {
    let checkPeopleValidacion = await checkPeople(tipoid, cedula)
    if (!checkPeopleValidacion) {
      return 0
    }
  }
  return 1
}

async function checkPeople(tipoid, cedula) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/checkpeople/${tipoid}/${cedula}/`,
      success: (response) => {
        if (response) {
          swalErrors(
            '¡Alto!',
            'El número de cédula digitado ya existe en nuestro sistema'
          )
          resolve(0)
        } else {
          resolve(1)
        }
      },
      error(err) {
        reject(err)
      },
    })
  })
}

function swalErrors(title, text) {
  Swal.fire({
    title: title,
    html: text,
    icon: 'error',
    confirmButtonText: 'Ok',
  })
}
