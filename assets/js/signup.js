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

function next(nextTab, who) {
  if (!validacion(nextTab)) return
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
    $('#email').attr('placeholder', 'Tu correo electrónico')
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
    $('#email').attr('placeholder', 'Correo electrónico del colaborador')
    $('#telefono').attr('placeholder', 'Teléfono del colaborador')
  }
}

function prev(currentTab) {
  let prevTab = currentTab - 1
  $(`#formCollapse${currentTab}`).collapse('hide')
  $(`#formCollapse${prevTab}`).collapse('show')
}

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
})

function validacion(pagina) {
  return 1
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
    return 1
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
    return 1
  }
  if (pagina === 7) {
    if (UppyWrapper.core.getFiles().length === 0) {
      swalErrors('Por favor, adjuntá las 2 fotografías de la cédula')
      return 0
    }
  }
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

//UppyWrapper.core.getFiles()
//UppyWrapper.core.getState().currentUploads
