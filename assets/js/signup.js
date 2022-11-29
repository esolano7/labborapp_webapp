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
  let pruebaValidacion = await validacion(nextTab, who)
  if (!pruebaValidacion) return
  Swal.close()
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
    $('#actividadEconomica').attr('placeholder', 'Escribí aquí en que trabajás')
    $('#ingresobruto').attr('placeholder', '¿Cuánto ganás por mes?')
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
    $('#actividadEconomica').attr(
      'placeholder',
      'Escribí aquí en que trabaja tu colaborador'
    )
    $('#ingresobruto').attr(
      'placeholder',
      '¿Cuánto percibe tu colaborador al mes?'
    )
  }
}

function prev(currentTab) {
  let prevTab = currentTab - 1
  $(`#formCollapse${currentTab}`).collapse('hide')
  $(`#formCollapse${prevTab}`).collapse('show')
}

async function validacion(pagina, who) {
  if (pagina === 2 || pagina === 4 || pagina === 6) return 1
  if (pagina === 3) {
    if ($('#usernom').val().length === 0) {
      swalErrors(
        '¡Alto!',
        'Tenés que digitar tu nombre (por el que te llama tu mamá cuando se enoja, por ejemplo)'
      )
      return 0
    }
    if ($('#userap').val().length === 0) {
      swalErrors(
        '¡Alto!',
        'Tenés que digitar tus apellidos, hacé que tus papás se sientan orgullosos'
      )
      return 0
    }
    if (!phoneInputObj.isValidNumber()) {
      swalErrors(
        '¡Aquí hay algo raro!',
        '¿Colocaste bien tu número de teléfono? Revisá que tenga 8 dígitos, por favor'
      )
      return 0
    }
    if (!validar('password', $('#password1').val())) {
      swalErrors(
        '¡Alto! Que aquí nos vamos a poner delicados',
        'Revisá que la contraseña tenga 8 caracteres (incluidos número, mayúsculas y minúsculas)'
      )
      return 0
    }
    if ($('#password1').val() !== $('#password2').val()) {
      swalErrors(
        '¡Atención!',
        'Tenés que colocar la contraseña exactamente igual en ambos espacios'
      )
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

    let telefono = phoneInputObj.getNumber()
    let checkUserValidation = await checkUser(telefono)
    return checkUserValidation
  }
  if (pagina === 5) {
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

    if (who && who === 'personal') {
      if ($('#actividadEconomica').val().length == 0) {
        swalErrors('¡Alto!', 'Te faltó contarnos a que te dedicás')
        return 0
      }
      if ($('#ingresobruto').val().length == 0) {
        swalErrors(
          '¡Alto!',
          'Te faltó escribir cuánto ganás por mes. Tranquilo, prometemos no contar'
        )
        return 0
      }
    } else if (who && who === 'colaborador') {
      if ($('#actividadEconomica').val().length == 0) {
        swalErrors(
          '¡Alto!',
          'Te faltó contarnos a que se dedica tu colaborador'
        )
        return 0
      }
      if ($('#ingresobruto').val().length == 0) {
        swalErrors(
          '¡Alto!',
          'Te faltó escribir cuánto percibe tu colaborador al mes'
        )
        return 0
      }
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
    let checkPeopleValidacion = await checkPeople(tipoid, cedula)
    return checkPeopleValidacion
  }
  if (pagina === 7) {
    if (UppyWrapper.core.getFiles().length < 2) {
      swalErrors('¡Alto!', 'Asegurate de adjuntar las 2 fotografías')
      return 0
    }
    return 1
  }
  if (pagina === 8) {
    resumen()
    return 1
  }
}

async function checkUser(telefono) {
  return new Promise((resolve, reject) => {
    $.ajax({
      async: true,
      method: 'GET',
      url: `https://labbor-app.onrender.com/checkusuarios/${telefono}/`,
      success: (response) => {
        console.log(response)
        if (response) {
          swalErrors('¡Alto!', 'Esta cuenta ya existe en nuestro sistema')
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
      url: `https://labbor-app.onrender.com/checkpeople/${tipoid}/${cedula}/`,
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

  UppyWrapper.core.getPlugin('Webcam').setOptions({
    onBeforeSnapshot: () => Promise.resolve(),
    countdown: false,
    modes: ['picture'],
    mirror: false,
    videoConstraints: {
      facingMode: 'environment',
      width: { min: 720, ideal: 1280, max: 1420 },
      height: { min: 480, ideal: 800, max: 1000 },
    },
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

let paquetesDisponibles = {}
function populatePaquetes() {
  $.ajax({
    method: 'GET',
    url: 'https://labbor-app.onrender.com/paquetes/',
    success: (response) => {
      paquetesDisponibles = response
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

        content += `<!-- Button -->
        <button type="button" class="btn w-full btn-warning mb-10" onClick="seleccionarPaquete(${paquete.id},8)">¡Quiero el paquete ${paquete.nombre}!</button></div>`
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

let formulario = [
  {
    nompreText: 'Nombre',
    id: 'nom',
  },
  {
    nompreText: 'Apellidos',
    id: 'ap',
  },
  {
    nompreText: 'Tipo de identificacion',
    id: 'tipoid',
  },
  {
    nompreText: 'Identificación',
    id: 'cedula',
  },
  {
    nompreText: 'Teléfono',
    id: 'telefono',
  },
  {
    nompreText: 'Correo Electrónico',
    id: 'email',
  },
  {
    nompreText: 'Actividad Económica',
    id: 'actividadEconomica',
  },
  {
    nompreText: 'Ingreso mensual percibido',
    id: 'ingresobruto',
  },
  {
    nompreText: 'Paquete seleccionado',
    id: 'paquete',
  },
]

function resumen() {
  let content = ''
  let valor = ''
  for (campo of formulario) {
    if (campo.id === 'telefono') {
      valor = telefonoInputObj.getNumber()
    } else if (campo.id === 'tipoid') {
      valor = 'Cédula Física'
    } else if (campo.id === 'paquete' && $(`#${campo.id}`).val() !== '') {
      let paqueteSeleccionado = paquetesDisponibles.find(
        (p) => p.id == $(`#${campo.id}`).val()
      )
      valor = paqueteSeleccionado.nombre + ' ¢' + paqueteSeleccionado.precio
    } else {
      valor = $(`#${campo.id}`).val()
    }
    content += `<li class="py-1 d-flex align-items-center">
      <div>
        <span class="text-xl text-success me-3 svg-icon svg-align-baseline">
          <i class="bi bi-check"></i>
        </span>
      </div>
      <p class="">
        ${campo.nompreText}: ${valor}
      </p>
    </li>`
  }
  $('#resumen').html(content)
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
    ingresobruto: Number($('#ingresobruto').val()),
    paquete: Number($('#paquete').val()),
    fotosCedula: JSON.stringify(UppyWrapper.core.getFiles()),
    nombreUser: $('#usernom').val() + ' ' + $('#userap').val(),
    telefonoUser: phoneInputObj.getNumber(),
    passwordUser: $('#password1').val(),
  }

  if ($('#email').val() !== '') {
    data = { email: $('#email').val(), ...data }
  }

  try {
    await signUp(data)
    let { token, userid, user } = await signIn(
      data.telefonoUser,
      data.passwordUser
    )
    localStorage.setItem('at', token)
    localStorage.setItem('uid', userid)
    localStorage.setItem('user', JSON.stringify(user))
    window.location = 'dashboard.html'
  } catch (error) {
    swalErrors('¡Alto!', error)
  }
}

async function signUp(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `https://labbor-app.onrender.com/signup/`,
      data,
      success: (response) => {
        resolve(response)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}

async function signIn(telefonoUser, passwordUser) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `https://labbor-app.onrender.com/usuarios/signin/`,
      data: {
        telefono: telefonoUser,
        password: passwordUser,
      },
      success: (response) => {
        resolve(response)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
