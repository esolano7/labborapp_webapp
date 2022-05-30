const query = new URLSearchParams(window.location.search)
const onesignal_push_id = query.get('onesignal_push_id')
if (onesignal_push_id) {
  localStorage.clear()
  localStorage.setItem('onesignal_push_id', onesignal_push_id)
}
