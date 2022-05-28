var phoneInput = document.querySelector('#phone')
var phoneInputObj = window.intlTelInput(phoneInput, {
  onlyCountries: ['cr'],
  autoPlaceholder: 'polite',
  utilsScript: '../assets/js/intlTelUtils.js',
})

$(document).ready(function () {
  $('#phone').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#phone').val().length > 7) e.preventDefault()
  })
})

let cuentaErrores = 0

function swalErrors(title, text) {
  Swal.fire({
    title: title,
    html: text,
    icon: 'error',
    confirmButtonText: 'Ok',
  })
}

async function sendCode() {
  if (!phoneInputObj.isValidNumber()) {
    swalErrors(
      '¡Aquí hay algo raro!',
      '¿Colocaste bien tu número de teléfono? Revisá que tenga 8 dígitos, por favor'
    )
    return 0
  }

  let response = grecaptcha.getResponse()
  if (response.length == 0) {
    swalErrors('¡Alto!', 'Demostranos que no sos un robot')
    return 0
  }

  clearOTP()
  let timerInterval
  Swal.fire({
    title: '¡Estamos validando los datos!',
    html: 'Si tu teléfono se encuentra registrado, te enviaremos un código de acceso temporal',
    timer: 5000,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {}, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
      $('#formCollapse1').collapse('hide')
      $('#formCollapse2').collapse('show')
      timerEnviar()
      localStorage.clear()
    },
  })

  let telefonoUser = phoneInputObj.getNumber()

  try {
    let respuesta = await passRecovery(telefonoUser)
    if (respuesta == 0) {
      swalErrors('¡Alto!', 'No tenemos tu número de teléfono registrado')
      return 0
    }
  } catch (error) {
    swalErrors('¡Alto!', 'Algo ha sucedido')
  }
}

async function validarCodigo() {
  const otp = getOTP()
  if (otp.length === 0) {
    swalErrors('¡Alto!', 'Por favor digitá el código que te enviamos')
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

  try {
    let telefonoUser = phoneInputObj.getNumber()
    let { token, userid } = await signIn(telefonoUser, otp)
    localStorage.setItem('at', token)
    localStorage.setItem('u', userid)
    Swal.close()
    $('#formCollapse2').collapse('hide')
    $('#formCollapse3').collapse('show')
  } catch (error) {
    swalErrors('¡Alto!', 'Parece que tus datos no son los correctos')
  }
}

async function signIn(telefonoUser, passwordUser) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `https://api.labbor.app/usuarios/signin/`,
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

async function login() {
  let pruebaValidacion = validacionNewPass()
  if (!pruebaValidacion) return

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

  try {
    let tokenLastStep = localStorage.getItem('at')
    let useridLastStep = localStorage.getItem('u')
    let password = $('#password1').val()
    let { token, userid } = await setMyPass(
      tokenLastStep,
      useridLastStep,
      password
    )
    localStorage.setItem('at', token)
    localStorage.setItem('u', userid)
    window.location = 'dashboard.html'
  } catch (error) {
    swalErrors('¡Alto!', 'Parece que tus datos no son los correctos')
  }
}

async function setMyPass(tokenLastStep, useridLastStep, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `https://api.labbor.app/usuario/password/${useridLastStep}/`,
      headers: { Authorization: `Bearer ${tokenLastStep}` },
      data: { password },
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

function timerEnviar() {
  $('#buttonTimer').prop('disabled', true)
  var timeleft = 60
  var downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
      $('#buttonTimer').prop('disabled', false)
      $('#buttonTimer').html('Renviar código')
      clearInterval(downloadTimer)
      return
    }
    $('#buttonTimer').html(`Renviar en ${timeleft} segundos`)
    timeleft -= 1
  }, 1000)
}

async function passRecovery(telefonoUser) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `https://api.labbor.app/usuario/resetmypassword/`,
      data: { telefono: telefonoUser },
      success: (response) => {
        let { respuesta } = response
        resolve(respuesta)
      },
      error: (err) => {
        reject(err)
        cuentaErrores++
      },
    })
  })
}

function validacionNewPass() {
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
  return 1
}

function getOTP() {
  const inputs = document.querySelectorAll('#otp > *[id]')
  let otp = ''
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value) otp += inputs[i].value
  }
  return otp
}

function clearOTP() {
  const inputs = document.querySelectorAll('#otp > *[id]')
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = ''
  }
  $('#validarCod').prop('disabled', true)
}

document.addEventListener('DOMContentLoaded', function (event) {
  function OTPInput() {
    const inputs = document.querySelectorAll('#otp > *[id]')
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
          inputs[i].value = ''
          if (i !== 0) inputs[i - 1].focus()
        } else if (isNaN(event.key)) {
          event.preventDefault()
        } else {
          if (i === inputs.length - 1 && inputs[i].value !== '') {
            return true
          } else if (event.keyCode > 47 && event.keyCode < 58) {
            inputs[i].value = event.key
            if (i !== inputs.length - 1) inputs[i + 1].focus()
            event.preventDefault()
          } else if (event.keyCode > 64 && event.keyCode < 91) {
            inputs[i].value = String.fromCharCode(event.keyCode)
            if (i !== inputs.length - 1) inputs[i + 1].focus()
            event.preventDefault()
          }
        }
        if (getOTP().length === 6) {
          $('#validarCod').prop('disabled', false)
        } else {
          $('#validarCod').prop('disabled', true)
        }
      })
    }
  }
  OTPInput()
})
