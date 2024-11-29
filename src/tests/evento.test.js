const mongoose = require('mongoose');
const Evento = require('../models/evento');

// Aumentar timeout global para todas las pruebas
jest.setTimeout(30000);

describe('Evento Model Test', () => {
    beforeAll(async () => {
        try {
            // Reemplaza con tu URL de conexión de MongoDB Atlas
            const mongoUri = "mongodb+srv://uservibe:vive1717@cluster0.fztdd.mongodb.net/VibeTickets?retryWrites=true&w=majority";
            await mongoose.connect(mongoUri);
            console.log('Conectado a MongoDB Atlas exitosamente');
        } catch (error) {
            console.error('Error conectando a MongoDB Atlas:', error);
            throw error;
        }
    });

    afterEach(async () => {
        try {
            await Evento.deleteMany({});
        } catch (error) {
            console.error('Error limpiando la base de datos:', error);
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error cerrando la conexión:', error);
        }
    });

    // Datos dummy para pruebas
    const eventoValido = {
        titulo: 'Concierto de Rock',
        precio: 25000,
        lugar: 'San José',
        fecha: new Date('2024-12-25'),
        hora: '20:00',
        categoria: 'Conciertos',
        imagen: 'https://ejemplo.com/imagen.jpg'
    };

    // Test 1: Crear evento válido
    test('crear y guardar evento exitosamente', async () => {
        expect.assertions(7);
        const nuevoEvento = new Evento(eventoValido);
        const eventoGuardado = await nuevoEvento.save();
        
        // Verificar que el evento se guardó correctamente
        expect(eventoGuardado._id).toBeDefined();
        expect(eventoGuardado.titulo).toBe(eventoValido.titulo);
        expect(eventoGuardado.precio).toBe(eventoValido.precio);
        expect(eventoGuardado.lugar).toBe(eventoValido.lugar);
        expect(eventoGuardado.categoria).toBe(eventoValido.categoria);
        
        // Verificar que el evento existe en la base de datos
        const eventoEncontrado = await Evento.findById(eventoGuardado._id);
        expect(eventoEncontrado).toBeTruthy();
        expect(eventoEncontrado.titulo).toBe(eventoValido.titulo);
    }, 10000);

    // Test adicional: Verificar múltiples eventos
    test('crear múltiples eventos y verificar su existencia', async () => {
        expect.assertions(3);
        
        const evento1 = new Evento(eventoValido);
        const evento2 = new Evento({
            ...eventoValido,
            titulo: 'Concierto de Pop',
            precio: 30000
        });
        
        await evento1.save();
        await evento2.save();
        
        const eventos = await Evento.find();
        expect(eventos).toHaveLength(2);
        expect(eventos[0].titulo).toBe('Concierto de Rock');
        expect(eventos[1].titulo).toBe('Concierto de Pop');
    }, 10000);

    // Test 2: Validación de campos requeridos
    test('falla al insertar evento sin campos requeridos', async () => {
        expect.assertions(1);
        const eventoInvalido = new Evento({});
        
        await expect(eventoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    }, 10000);

    // Test 3: Validación de categoría
    test('falla al usar categoría inválida', async () => {
        expect.assertions(1);
        const eventoCategInvalida = new Evento({
            ...eventoValido,
            categoria: 'CategoriaInvalida'
        });

        await expect(eventoCategInvalida.save()).rejects.toThrow(mongoose.Error.ValidationError);
    }, 10000);
});