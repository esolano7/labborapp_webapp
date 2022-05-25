'use strict'
const Uppy = require('@uppy/core')
const Dashboard = require('@uppy/dashboard')
const Webcam = require('@uppy/webcam')
const AwsS3 = require('@uppy/aws-s3')
const ES = require('@uppy/locales/lib/es_ES')

class uppyWrapper {
  constructor() {
    this.core
  }

  init({ target }) {
    const serverUrl = `https://api.labbor.app/companion/`
    const uppyConfig = { inline: true, target }
    const idiomaConCambios = ES

    idiomaConCambios.strings = {
      ...ES.strings,
      dropPasteImportBoth:
        'Tomá la foto o buscá una que ya tengas en tu teléfono',
      dropPasteImportFiles:
        'Tomá la foto o buscá una que ya tengas en tu teléfono',
      dropPasteImportFolders:
        'Tomá la foto o buscá una que ya tengas en tu teléfono',
      myDevice: 'Mi teléfono',
    }

    this.core = new Uppy({ autoProceed: true, locale: idiomaConCambios })
      .use(Dashboard, uppyConfig)
      .use(Webcam, {
        target: Dashboard,
        countdown: true,
        modes: ['picture'],
        showRecordingLength: true,
        showVideoSourceDropdown: true,
      })
      .use(AwsS3, { companionUrl: serverUrl, limit: 1 })

    this.core.getPlugin('Dashboard').setOptions({
      width: '100%',
      height: '350px',
      showLinkToFileUploadResult: true,
      showRemoveButtonAfterComplete: true,
      proudlyDisplayPoweredByUppy: true,
    })
  }
}

module.exports = uppyWrapper
