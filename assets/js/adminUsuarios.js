$(document).ready(function () {
  let t = $('#usuarios').DataTable({
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
    },
    columnDefs: [
      {
        target: 0,
        visible: false,
        searchable: false,
      },
      {
        target: 3,
        render: function (notificar) {
          return `<span class="badge mx-1 bg-${notificar.color} text-white">${notificar.label}</span>`
        },
      },
      {
        target: 4,
        render: function (u) {
          return `<span class="badge mx-1 bg-primary text-white" style="cursor: pointer;" onClick=detallesUsuario(${u})><i class="bi bi-pencil" style="font-size: 13px;"></i></span>

          <span class="badge mx-1 bg-danger text-white" style="cursor: pointer;" onClick=borrarUser(${u})><i class="bi bi-trash" style="font-size: 13px;"></i></span>
          `
        },
      },
    ],
  })
})

async function showUsuarios() {
  $('#tablaPersonas').collapse('hide')
  $('#tablaUsuarios').collapse('show')
  $('#usuarios').DataTable().clear().draw()

  let usuarios = await getUsuarios()
  if (usuarios.length != 0) {
    let counter = 1
    for (u of usuarios) {
      let notificar = {}
      if (u.notificar == 1) {
        notificar.label = 'Sí'
        notificar.color = 'success'
      } else {
        notificar.label = 'No'
        notificar.color = 'danger'
      }

      addRowUser(u, notificar)
      counter++
    }
  }
}

function addRowUser(u, notificar) {
  let t = $('#usuarios').DataTable()
  counter = 1
  t.row.add([u.id, u.nombre, u.telefono, notificar, u.id]).draw(false)
}

var telefonoUsuarioInput = document.querySelector('#telefonoUsuario')
var telefonoUsuarioInputObj = window.intlTelInput(telefonoUsuarioInput, {
  onlyCountries: ['cr'],
  autoPlaceholder: 'polite',
  utilsScript: '../assets/js/intlTelUtils.js',
})

$(document).ready(function () {
  $('#telefonoUsuario').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#telefono').val().length > 7) e.preventDefault()
  })
})

const userModal = new bootstrap.Modal('#userModal')
const myModalUser = document.getElementById('userModal')
myModalUser.addEventListener('hide.bs.modal', (event) => {
  $('#userTit').html('Usuario')
  $('#userButton').html('Guardar cambios')
  $('#id').val('')
  $('#nombre').val('')
  $(`#notificar-0`).prop('checked', true)
  $(`#telefonoUsuario`).prop('readonly', false)
  telefonoUsuarioInputObj.setNumber('')
})

async function detallesUsuario(id) {
  let person = await getUsuario(id)
  let datos = person[0]
  $('#userid').val(datos.id)
  $('#nombre').val(datos.nombre)
  telefonoUsuarioInputObj.setNumber(datos.telefono)
  $(`#telefonoUsuario`).prop('readonly', true)
  $(`#notificar-${datos.notificar}`).prop('checked', true)
  userModal.show()
}

async function actualizarUsuario() {
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
    nombre: $('#nombre').val(),
    telefono: telefonoUsuarioInputObj.getNumber(),
    rol: 'admin',
  }
  if ($('#notificar-1').prop('checked')) {
    data = { notificar: '1', ...data }
  }
  if ($('#notificar-0').prop('checked')) {
    data = { notificar: '0', ...data }
  }
  let id = $('#userid').val()

  if (id) {
    try {
      await updateUser(id, data)
      Swal.fire({
        icon: 'success',
        title: 'Los datos fueron actualizados',
        showConfirmButton: false,
        timer: 1500,
      })
      userModal.hide()
      showUsuarios()
    } catch (error) {
      swalErrors('¡Alto!', error)
    }
  } else {
    try {
      let existe = await checkUser(data)
      if (existe) {
        swalErrors('¡Alto!', 'El número de teléfono ya está registrado')
        return
      }
      await createUser(data)
      Swal.fire({
        icon: 'success',
        title: 'Los datos fueron actualizados',
        showConfirmButton: false,
        timer: 1500,
      })
      userModal.hide()
      showUsuarios()
    } catch (error) {
      swalErrors('¡Alto!', error)
    }
  }
}

async function checkUser(data) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/checkusuarios/${data.telefono}/`,
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

async function createUser(data) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'POST',
      url: `https://api.labbor.app/usuarios/`,
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
async function updateUser(id, data) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'PATCH',
      url: `https://api.labbor.app/usuarios/${id}/`,
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
async function getUsuario(id) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/usuarios/${id}/`,
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

async function getUsuarios() {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/usuarios/?estado=1&rol=admin`,
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

async function borrarUser(id) {
  Swal.fire({
    title: '¿Está seguro(a)',
    text: 'de eliminar el usuario?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
  }).then(async (result) => {
    if (result.isConfirmed) {
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
      try {
        await deleteUser(id)
        Swal.fire({
          icon: 'success',
          title: 'El usuario fue eliminado',
          showConfirmButton: false,
          timer: 1500,
        })
        showUsuarios()
      } catch (error) {
        swalErrors('¡Alto!', error)
      }
    }
  })
}

async function deleteUser(id) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'DELETE',
      url: `https://api.labbor.app/usuarios/${id}/`,
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

function newUser() {
  $('#userTit').html('Nuevo usuario')
  $('#userButton').html('Crear usuario')
  $(`#notificar-0`).prop('checked', true)
  $(`#telefonoUsuario`).prop('readonly', false)
  userModal.show()
}

isLoginDashboard()
