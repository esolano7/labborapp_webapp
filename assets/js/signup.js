var phoneInput = document.querySelector('#phone')
var phoneInputObj = window.intlTelInput(phoneInput, {
  onlyCountries: ['cr'],
  autoPlaceholder: 'polite',
  utilsScript: '../assets/js/intlTelUtils.js',
})

var telefonoInput = document.querySelector('#telefono')
var telefonoInputObj = window.intlTelInput(telefonoInput, {
  onlyCountries: ['cr'],
  autoPlaceholder: 'polite',
  utilsScript: '../assets/js/intlTelUtils.js',
})

$(document).ready(function () {
  $('#phone').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#phone').val().length > 7) e.preventDefault()
  })
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

async function next(nextTab, who) {
  let pruebaValidacion = await validacion(nextTab)
  console.log(pruebaValidacion)
  if (!pruebaValidacion) return
  let currentTab = nextTab - 1
  $(`#formCollapse${currentTab}`).collapse('hide')
  $(`#formCollapse${nextTab}`).collapse('show')
  if (who && who === 'personal') {
    $('#nom').val($('#usernom').val())
    $('#ap').val($('#userap').val())
    telefonoInputObj.setNumber(phoneInputObj.getNumber())
    $('#who').val(who)
    $('#nom').attr('placeholder', 'Tu nombre')
    $('#ap').attr('placeholder', 'Tus apellidos')
    $('#cedula').attr('placeholder', 'Tu número de identificación')
    $('#email').attr('placeholder', 'Tu correo electrónico (opcional)')
    $('#telefono').attr('placeholder', 'Tu teléfono')
  }
  if (who && who === 'colaborador') {
    $('#nom').val('')
    $('#ap').val('')
    telefonoInputObj.setNumber('')
    $('#who').val(who)
    $('#nom').attr('placeholder', 'Nombre del colaborador')
    $('#ap').attr('placeholder', 'Apellidos del colaborador')
    $('#cedula').attr('placeholder', 'Número de identificación del colaborador')
    $('#email').attr(
      'placeholder',
      'Correo electrónico del colaborador (opcional)'
    )
    $('#telefono').attr('placeholder', 'Teléfono del colaborador')
  }
}

function prev(currentTab) {
  let prevTab = currentTab - 1
  $(`#formCollapse${currentTab}`).collapse('hide')
  $(`#formCollapse${prevTab}`).collapse('show')
}

async function validacion(pagina) {
  if (pagina === 2 || pagina === 4) return 1
  if (pagina === 3) {
    if ($('#usernom').val().length === 0) {
      swalErrors('Por favor, digitá tu nombre')
      return 0
    }
    if ($('#userap').val().length === 0) {
      swalErrors('Por favor, digitá tus apellidos')
      return 0
    }
    if (!phoneInputObj.isValidNumber()) {
      swalErrors(
        'Revisa el número de teléfono que digitaste. <br>Algo no anda bien'
      )
      return 0
    }
    if (!validar('password', $('#password1').val())) {
      swalErrors(
        'La contraseña debe tener al menos 8 caracteres entre números y letras mayúsculas y minúsculas'
      )
      return 0
    }
    if ($('#password1').val() !== $('#password2').val()) {
      swalErrors('Las contraseñas que digitaste no coinciden')
      return 0
    }

    let timerInterval
    Swal.fire({
      title: '¡Estamos validando los datos!',
      html: 'Por favor, esperá unos segundos',
      timer: 22000,
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

    let telefono = phoneInputObj.getNumber()
    let checkUserValidation = await checkUser(telefono)
    return checkUserValidation
  }
  if (pagina === 5) {
    if ($('#nom').val().length === 0) {
      swalErrors('Por favor, digitá el nombre')
      return 0
    }
    if ($('#ap').val().length === 0) {
      swalErrors('Por favor, digitá los apellidos')
      return 0
    }
    if ($('#tipoid').val() == '01' && $('#cedula').val().length < 9) {
      swalErrors('Digita la cédula con los 9 dígitos')
      return 0
    }
    if (!telefonoInputObj.isValidNumber()) {
      swalErrors(
        'Revisa el número de teléfono que digitaste. <br>Algo no anda bien'
      )
      return 0
    }
    if ($('#email').val().length > 0 && !validar('email', $('#email').val())) {
      swalErrors(
        'Revisa el correo electrónico que digitaste. <br>Algo no anda bien'
      )
      return 0
    }
    if ($('#actividadEconomica').val().length == 0) {
      swalErrors('Digitá la actividad económica')
      return 0
    }
    if ($('#ingresobruto').val().length == 0) {
      swalErrors('Digitá el ingreso mensual percibido')
      return 0
    }

    let timerInterval
    Swal.fire({
      title: '¡Estamos validando los datos!',
      html: 'Por favor, esperá unos segundos',
      timer: 22000,
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
    let checkPeopleValidacion = await checkPeople(tipoid, cedula)
    return checkPeopleValidacion
  }
  if (pagina === 7) {
    if (UppyWrapper.core.getFiles().length === 0) {
      swalErrors('Por favor, adjuntá las 2 fotografías de la cédula')
      return 0
    }
    return 1
  }
}

async function checkUser(telefono) {
  return new Promise((resolve, reject) => {
    $.ajax({
      async: true,
      method: 'GET',
      url: `https://api.labbor.app/checkusuarios/${telefono}/`,
      success: (response) => {
        console.log(response)
        if (response) {
          swalErrors('Esta cuenta ya existe en nuestro sistema')
          resolve(0)
        } else {
          resolve(1)
        }
      },
    })
  })
}

async function checkPeople(tipoid, cedula) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/checkpeople/${tipoid}/${cedula}/`,
      success: (response) => {
        if (response) {
          swalErrors(
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

function swalErrors(text) {
  Swal.fire({
    title: 'Error!',
    html: text,
    icon: 'error',
    confirmButtonText: 'Ok',
  })
}

const UppyWrapper = new uppyWrapper()

$(function () {
  UppyWrapper.init({
    target: '#uppy-container',
  })
  UppyWrapper.core.getPlugin('Dashboard').setOptions({
    width: '100%',
    height: '350px',
    showLinkToFileUploadResult: true,
    showRemoveButtonAfterComplete: true,
    proudlyDisplayPoweredByUppy: true,
  })
  UppyWrapper.core.setOptions({
    restrictions: { allowedFileTypes: ['image/*'], maxNumberOfFiles: 2 },
    onBeforeFileAdded: (currentFile, files) => {
      const re = /(?:\.([^.]+))?$/
      let extension = re.exec(currentFile.name)[1]
      let tempFileName = currentFile.name.replace(extension, '')
      let cleanFileName = tempFileName.replace(/[^-_A-Za-z0-9]/g, '')
      let modifiedFile = currentFile
      modifiedFile.name = `${cleanFileName}.${extension}`
      return modifiedFile
    },
  })
  UppyWrapper.core.on('upload', (data) => {
    $('#siguienteFiles').prop('disabled', true)
    $('#atrasFiles').prop('disabled', true)
  })
  UppyWrapper.core.on('complete', (result) => {
    $('#siguienteFiles').prop('disabled', false)
    $('#atrasFiles').prop('disabled', false)
  })
})

function populatePaquetes() {
  $.ajax({
    method: 'GET',
    url: 'https://api.labbor.app/paquetes/',
    success: (response) => {
      response.forEach((paquete) => {
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
        <!-- Text -->
        <p class="text-muted text-sm mt-3">
          ${paquete.descripcionApp}
        </p>
        <hr class="opacity-0 my-2" />
        <!-- List -->
        <ul class="list-unstyled mb-5 paquete">
        ${incluyeFormated}
        </ul>
        <!-- Button -->
        <button type="button" class="btn w-full btn-warning" onClick="seleccionarPaquete(${paquete.id},8)">Seleccionar</button></div>`
        $('#paquetes').append(content)
      })
    },
  })
}
populatePaquetes()

function seleccionarPaquete(id, nextTab) {
  $('#paquete').val(id)
  next(nextTab)
}
//UppyWrapper.core.getFiles()
//UppyWrapper.core.getState().currentUploads
