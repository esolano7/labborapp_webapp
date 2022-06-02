var formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'CRC',
})

async function getPeople() {
  const query = new URLSearchParams(window.location.search)
  const id = query.get('id')
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/people/${id}`,
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

async function init() {
  let people = await getPeople()
  if (people.length === 1) {
    let estadoBadge = ''
    let estado = {}
    if (people[0].estado === 'aprobacion') {
      estado.label = 'Pend. Aprob.'
      estado.color = 'warning'
      estadoBadge = `<span class="badge mx-1 bg-${estado.color} text-white">${estado.label}</span>`
    } else if (people[0].estado === 'activo') {
      estado.label = 'Activo'
      estado.color = 'success'
      estadoBadge = `<span class="badge mx-1 bg-${estado.color} text-white">${estado.label}</span>`
    }
    let datos = ''
    datos += `<p><strong>Cédula: </strong>${people[0].cedula}</p>`
    datos += `<p><strong>Nombre: </strong>${people[0].nom}</p>`
    datos += `<p><strong>Apellidos: </strong>${people[0].ap}</p>`
    datos += `<p><strong>Teléfono: </strong>${people[0].telefono}</p>`
    if (people[0].email) {
      datos += `<p><strong>Email: </strong>${people[0].email}</p>`
    }
    datos += `<p><strong>Actividad Económica: </strong>${people[0].actividadeconomica}</p>`
    datos += `<p><strong>Ingreso: </strong>${formatter.format(
      people[0].ingresobruto
    )}</p>`
    //$('#estado').html(estadoBadge)
    //
    //telefonoInputObj.setNumber(people[0].telefono)
    //$('#nom').val(people[0].nom)
    //$('#ap').val(people[0].ap)
    //$('#email').val(people[0].email)
    //$('#cedula').val(people[0].cedula)
    //$('#actividadEconomica').val(people[0].actividadeconomica)
    //$('#ingresobruto').val(people[0].ingresobruto)
    $('#datos').html(datos)
    let fotosCedula = JSON.parse(people[0].fotosCedula)
    archivos(fotosCedula)
    let paquete = await getPaquetes(people[0].paquete)
    $('#paquete').html(paquete)
  }

  setTimeout(function () {
    window.print()
  }, 2000)
}

function archivos(fotosCedula) {
  for (archivo of fotosCedula) {
    let content = `<div class="list-group list-group-flush">
    <div class="list-group-item d-flex align-items-center">
    <div class="text-center">
      <img src="${archivo.uploadURL}" class="rounded" style="width: 300px">
    </div>
    </div>
  </div>`
    $('#archivos').append(content)
  }
}

async function getPaquetes(idPaquete) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `https://api.labbor.app/paquetes/?id=${idPaquete}`,
      success: (response) => {
        let paquete = response[0]
        let { incluye } = JSON.parse(paquete.incluyeApp)
        incluye.forEach((incluye) => {
          let content = `<p><strong>Paquete:</strong> ${paquete.nombre} ${paquete.precio}</p>`
          resolve(content)
        })
      },
      error: (err) => {
        reject(err)
        cuentaErrores++
      },
    })
  })
}

isLoginDashboard()
init()
