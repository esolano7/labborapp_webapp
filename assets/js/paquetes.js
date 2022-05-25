function getPaquetes(api, id) {
  $.ajax({
    method: 'GET',
    url: `${api}/paquetes/`,
    success: (response) => {
      console.log(response)
    },
  })
}
