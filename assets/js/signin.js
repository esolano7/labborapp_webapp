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

async function login() {
  if (!phoneInputObj.isValidNumber()) {
    swalErrors(
      '¡Aquí hay algo raro!',
      '¿Colocaste bien tu número de teléfono? Revisá que tenga 8 dígitos, por favor'
    )
    return 0
  }
  if ($('#password').val() === '') {
    swalErrors('¡Alto!', 'Digitá tu contraseña')
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

  let telefonoUser = phoneInputObj.getNumber()
  let passwordUser = $('#password').val()

  try {
    let { token, userid, user } = await signIn(telefonoUser, passwordUser)
    localStorage.setItem('at', token)
    localStorage.setItem('uid', userid)
    localStorage.setItem('user', JSON.stringify(user))
    let onesignal_push_id = localStorage.getItem('onesignal_push_id')
    if (localStorage.getItem('onesignal_push_id')) {
      await onesignal_id(token, userid, onesignal_push_id)
    }
    if (user.rol === 'admin') {
      window.location = 'admin.html'
    } else {
      window.location = 'dashboard.html'
    }
  } catch (error) {
    if (cuentaErrores > 2) {
      clearInterval(timerInterval)
      Swal.fire({
        title: '¡Ups!',
        text: 'Parece que olvidaste tu contraseña. ¿Querés recuperarla?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No gracias',
        confirmButtonText: 'Quiero Recuperarla',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = 'passrecovery.html'
        }
      })
    } else {
      swalErrors('¡Alto!', 'Parece que tus datos no son los correctos')
    }
  }
}

async function signIn(telefonoUser, passwordUser) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `https://labbor-app.onrender.com/usuarios/signin/`,
      data: { telefono: telefonoUser, password: passwordUser },
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

async function onesignal_id(token, id, onesignal_id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `https://labbor-app.onrender.com/usuario/${id}/`,
      data: { onesignal_id },
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
