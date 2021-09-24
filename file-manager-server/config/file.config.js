module.exports = {
    supportedMimes: {
      'text/csv': 'csv',
      'image/jpg': 'jpg',
      'image/jpeg': 'jpeg',
      'image/png': 'png',
      'application/zip': 'zip',
      'video/mp4': 'mp4',
      'application/pdf': 'pdf'
    },
    maxFileSize: 2147483648, // Bytes 2GB
    uploadsFolder: 'F:/uploads', // Root
    baseDirectories: ['Documentos', 'Trabalho', 'Estudo', 'Outros'],
    dbConnection: 'mongodb://127.0.0.1:27017/fileuploaddb'
}
