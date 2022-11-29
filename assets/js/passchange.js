function swalErrors(title, text) {
  Swal.fire({
    title: title,
    html: text,
    icon: 'error',
    confirmButtonText: 'Ok',
  })
}

async function validarActual() {
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
    let password = $('#password').val()
    let password1 = $('#password1').val()
    let { telefono, id } = getUserData()
    await signIn(telefono, password)

    let { token, userid } = await setMyPass(getJwtToken(), id, password1)
    localStorage.setItem('at', token)
    localStorage.setItem('uid', userid)
    //localStorage.setItem('user', JSON.stringify(user))
    window.location = 'dashboard.html'
    Swal.close()
  } catch (error) {
    swalErrors('¡Alto!', 'Parece que tus datos no son los correctos')
  }
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

async function setMyPass(tokenLastStep, useridLastStep, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `https://labbor-app.onrender.com/usuario/password/${useridLastStep}/`,
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

function validacionNewPass() {
  if ($('#password').val() == '') {
    swalErrors('¡Alto!', 'Revisá que contraseña actual')
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
  return 1
}

isLoginDashboard()
