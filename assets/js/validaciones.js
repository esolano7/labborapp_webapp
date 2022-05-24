function validar(tipo, valor) {
  if (tipo === 'password') {
    const regex = new RegExp(
      '(?=.*[\\d])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}'
    )
    return regex.test(valor)
  }
  if (tipo === 'email') {
    const regex = new RegExp(
      '^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$'
    )
    return regex.test(valor)
  }
}
