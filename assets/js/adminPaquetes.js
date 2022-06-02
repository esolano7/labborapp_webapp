// Create our number formatter.
var formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'CRC',
})

$(document).ready(function () {
  $('#paqueteprecio').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#paqueteprecio').val().length > 7) e.preventDefault()
  })
})

$(document).ready(function () {
  let t = $('#tablapaquetes').DataTable({
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
        target: 2,
        render: function (precio) {
          return formatter.format(precio)
        },
      },

      {
        target: 4,
        render: function (p) {
          return `<span class="badge mx-1 bg-primary text-white" style="cursor: pointer;" onClick=detallesPaquete(${p})><i class="bi bi-pencil" style="font-size: 13px;"></i></span>

          <span class="badge mx-1 bg-danger text-white" style="cursor: pointer;" onClick=borrarPaquete(${p})><i class="bi bi-trash" style="font-size: 13px;"></i></span>
          `
        },
      },
    ],
  })
})

async function showPaquetes() {
  $('#tablaPersonas').collapse('hide')
  $('#tablaUsuarios').collapse('hide')
  $('#tablaPaquetes').collapse('show')
  $('#tablapaquetes').DataTable().clear().draw()

  await populatePaquetes()
  if (paquetesDisponibles.length != 0) {
    let counter = 1
    for (p of paquetesDisponibles) {
      addRowPaquete(p)
    }
  }
}

function addRowPaquete(p) {
  let t = $('#tablapaquetes').DataTable()
  t.row.add([p.id, p.nombre, p.precio, p.descripcionApp, p.id]).draw(false)
}

$(document).ready(function () {
  $('#precioPaquete').on('keypress', function (e) {
    if (isNaN(e.key)) e.preventDefault()
    if ($('#precioPaquete').val().length > 7) e.preventDefault()
  })
})

const paquetesModal = new bootstrap.Modal('#paquetesModal')
const myModalPaquetes = document.getElementById('paquetesModal')
myModalPaquetes.addEventListener('hide.bs.modal', (event) => {
  $('#paqueteTit').html('Paquete')
  $('#paqueteButton').html('Guardar cambios')
  $('#paqueteid').val('')
  $('#paquetenombre').val('')
  $('#paquetedescripcion').val('')
  $('#paqueteincluye').val('')
  $('#paquetedisclaimer').val('')
  $('#paqueteprecio').val('')
})

async function detallesPaquete(id) {
  let paqueteselected = paquetesDisponibles.find((p) => p.id == id)
  let incluyeText = JSON.parse(paqueteselected.incluyeApp).incluye
  $('#paqueteid').val(paqueteselected.id)
  $('#paquetenombre').val(paqueteselected.nombre)
  $('#paquetedescripcion').val(paqueteselected.descripcionApp)
  $('#paqueteincluye').val(incluyeText)
  $('#paquetedisclaimer').val(paqueteselected.disclaimerApp)
  $('#paqueteprecio').val(paqueteselected.precio)
  paquetesModal.show()
}

async function actualizarPaquete() {
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

  let incluyeinput = $('#paqueteincluye').val()
  let incluyeitems = incluyeinput.split(',')
  let data = {
    nombre: $('#paquetenombre').val(),
    descripcionApp: $('#paquetedescripcion').val(),
    incluyeApp: JSON.stringify({ incluye: incluyeitems }),
    disclaimerApp: $('#paquetedisclaimer').val(),
    precio: $('#paqueteprecio').val(),
  }
  let id = $('#paqueteid').val()
  if (id) {
    console.log(data)

    try {
      await updatePaquete(id, data)
      Swal.fire({
        icon: 'success',
        title: 'Los datos fueron actualizados',
        showConfirmButton: false,
        timer: 1500,
      })
      paquetesModal.hide()
      showPaquetes()
    } catch (error) {
      swalErrors('¡Alto!', error)
    }
  } else {
    try {
      await createPaquete(data)
      Swal.fire({
        icon: 'success',
        title: 'Los datos fueron actualizados',
        showConfirmButton: false,
        timer: 1500,
      })
      paquetesModal.hide()
      showPaquetes()
    } catch (error) {
      swalErrors('¡Alto!', error)
    }
  }
}

async function createPaquete(data) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'POST',
      url: `https://api.labbor.app/paquetes/`,
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
async function updatePaquete(id, data) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'PATCH',
      url: `https://api.labbor.app/paquetes/${id}/`,
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

async function borrarPaquete(id) {
  Swal.fire({
    title: '¿Está seguro(a)',
    text: 'de eliminar el paquete?',
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
        await deletePaquete(id)
        Swal.fire({
          icon: 'success',
          title: 'El paquete fue eliminado',
          showConfirmButton: false,
          timer: 1500,
        })
        showPaquetes()
      } catch (error) {
        swalErrors('¡Alto!', error)
      }
    }
  })
}

async function deletePaquete(id) {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'DELETE',
      url: `https://api.labbor.app/paquetes/${id}/`,
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

function newPaquete() {
  $('#paqueteTit').html('Nuevo paquete')
  $('#paqueteButton').html('Crear paquete')
  paquetesModal.show()
}
