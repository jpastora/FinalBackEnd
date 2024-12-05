const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadMiddleware = (type) => {
    // Asegurar que la ruta sea correcta y relativa a la raíz del proyecto
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads', type);
    console.log('Upload directory:', uploadDir); // Para debugging
    
    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('No es una imagen válida'), false);
        }
    };

    const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    });

    return upload;
};

// Crear instancias específicas para cada tipo
module.exports = {
    eventos: createUploadMiddleware('eventos'),
    profiles: createUploadMiddleware('profiles')
};