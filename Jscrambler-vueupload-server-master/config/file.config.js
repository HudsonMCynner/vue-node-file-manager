module.exports = {
    supportedMimes: {
      'text/csv': 'csv',
      'image/jpg': 'jpg',
      'image/jpeg': 'jpeg',
      'application/zip': 'zip',
      // 'video/mp4': 'mp4'
    },
    maxFileSize: '2GB',
    uploadsFolder: 'F:/uploads',
    baseDirectories: ['Documentos', 'Trabalho', 'Estudo', 'Outros'],
    dbConnection: 'mongodb://127.0.0.1:27017/fileuploaddb'
}
