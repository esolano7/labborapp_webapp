function getJwtToken() {
  return localStorage.getItem('at')
}

function getUserData() {
  let user = JSON.parse(localStorage.getItem('user'))
  return user
}

function isLoginIndex() {
  const jwtToken = getJwtToken()
  if (jwtToken) {
    window.location = '/dashboard.html'
  }
}

function isLoginDashboard() {
  const jwtToken = getJwtToken()
  if (!jwtToken) {
    window.location = '/index.html'
  }
}

function isClientDashboard() {
  let user = localStorage.getItem('user')
  user = JSON.parse(user)
  if (user.rol !== 'client') {
    window.location = '/admin.html'
  }
}

function isAdminDashboard() {
  let user = localStorage.getItem('user')
  user = JSON.parse(user)
  if (user.rol !== 'admin') {
    window.location = '/dashboard.html'
  }
}

async function logout() {
  let id = localStorage.getItem('uid')
  let token = localStorage.getItem('at')
  await onesignal_id(token, id, '0')
  localStorage.setItem('uid', '')
  localStorage.setItem('at', '')
  localStorage.setItem('user', '')
  window.location = '/index.html'
}

async function onesignal_id(token, id, onesignal_id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `https://api.labbor.app/usuario/${id}/`,
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
