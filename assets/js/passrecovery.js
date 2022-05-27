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
      window.location = 'signin.html'
    },
  })

  let telefonoUser = phoneInputObj.getNumber()

  try {
    await passRecovery(telefonoUser)
    localStorage.clear()
  } catch (error) {
    swalErrors('¡Alto!', 'Algo ha sucedido')
  }
}

async function passRecovery(telefonoUser) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `https://api.labbor.app/usuario/resetmypassword/`,
      data: { telefono: telefonoUser },
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
