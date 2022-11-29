// Create our number formatter.
var formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'CRC',
})

async function myPeople() {
  let people = await getMyPeople()
  if (people.length != 0) {
    let counter = 1
    for (person of people) {
      let estado = {}
      if (person.estado === 'aprobacion') {
        estado.label = 'Pend. Aprob.'
        estado.color = 'warning'
      } else if (person.estado === 'activo') {
        estado.label = 'Activo'
        estado.color = 'success'
      } else if (person.estado === 'inactivo') {
        estado.label = 'Inctivo'
        estado.color = 'danger'
      }

      person.ingresoFormat = formatter.format(person.ingresobruto)
      addRow(person, estado)
      counter++
    }
  }
}

async function getMyPeople() {
  return new Promise((resolve, reject) => {
    let token = getJwtToken()
    let { id } = getUserData()
    $.ajax({
      method: 'GET',
      url: `https://labbor-app.onrender.com/userspeople/getMyPeople/${id}/`,
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

function edit(id) {
  window.location = `profile.html?id=${id}`
}

function addRow(person, estado) {
  let content = `<div class="list-group list-group-flush" onClick="edit(${person.id})">
    <div class="list-group-item px-3">
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="progress-text mb-0 d-block">${person.nom} ${person.ap}</h6>
        </div>
        <div class="text-end">
          <span class="h6 text-sm">${person.ingresoFormat}</span>
        </div>
      </div>
      <p class="text-muted">
        Céd: ${person.cedula}<br>
        ${person.actividadeconomica}
      </p>
      <div class="d-flex mx-n1">
        <span class="badge mx-1 bg-${estado.color} text-white"
          >${estado.label}</span
        >
      </div>
    </div>
  </div>
  <hr>`
  $('#lista').append(content)
}

isLoginDashboard()
isClientDashboard()
myPeople()
