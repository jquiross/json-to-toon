/**
 * Database Initialization Script
 * Crea índices, inicializa achievements y opcionalmente carga datos de prueba
 */

import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { initializeAchievements } from '../services/achievement.service.js';
import User from '../models/User.model.js';
import Conversion from '../models/Conversion.model.js';
import ForumPost from '../models/ForumPost.model.js';
import Notification from '../models/Notification.model.js';
import AchievementDefinition from '../models/AchievementDefinition.model.js';
import bcrypt from 'bcryptjs';

const initDatabase = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Conectado a MongoDB');

    // 1. Crear índices para mejor rendimiento
    console.log('\n📊 Creando índices...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ level: -1, experience: -1 });
    await User.collection.createIndex({ reputation: -1 });
    console.log('  ✓ Índices de User creados');

    // Conversion indexes
    await Conversion.collection.createIndex({ userId: 1, createdAt: -1 });
    await Conversion.collection.createIndex({ conversionType: 1 });
    await Conversion.collection.createIndex({ 'metrics.executionTime': 1 });
    console.log('  ✓ Índices de Conversion creados');

    // ForumPost indexes
    await ForumPost.collection.createIndex({ author: 1, createdAt: -1 });
    await ForumPost.collection.createIndex({ category: 1, createdAt: -1 });
    await ForumPost.collection.createIndex({ tags: 1 });
    await ForumPost.collection.createIndex({ upvotes: -1 });
    await ForumPost.collection.createIndex({ isSolved: 1 });
    console.log('  ✓ Índices de ForumPost creados');

    // Notification indexes
    await Notification.collection.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
    await Notification.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 días
    console.log('  ✓ Índices de Notification creados');

    // AchievementDefinition indexes
    await AchievementDefinition.collection.createIndex({ key: 1 }, { unique: true });
    await AchievementDefinition.collection.createIndex({ category: 1, rarity: 1 });
    console.log('  ✓ Índices de AchievementDefinition creados');

    // 2. Inicializar Achievements
    console.log('\n🏆 Inicializando Achievements...');
    await initializeAchievements();
    console.log('  ✓ Achievements inicializados');

    // 3. Verificar si cargar datos de prueba
    const userCount = await User.countDocuments();
    if (process.argv.includes('--seed')) {
      console.log('\n🌱 Cargando datos de prueba...');
      
      // Limpiar datos existentes primero
      await User.deleteMany({});
      await Conversion.deleteMany({});
      await ForumPost.deleteMany({});
      await Notification.deleteMany({});
      
      await seedData();
      console.log('  ✓ Datos de prueba cargados');
    }

    console.log('\n✨ Base de datos inicializada correctamente');
    console.log('\n📋 Resumen:');
    console.log(`  • Usuarios: ${await User.countDocuments()}`);
    console.log(`  • Conversiones: ${await Conversion.countDocuments()}`);
    console.log(`  • Posts del foro: ${await ForumPost.countDocuments()}`);
    console.log(`  • Achievements: ${await AchievementDefinition.countDocuments()}`);
    console.log(`  • Notificaciones: ${await Notification.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Función para cargar datos de prueba (opcional)
const seedData = async () => {
  // Crear usuario demo
  const demoUser = await User.create({
    username: 'demo_user',
    email: 'demo@json-to-toon.dev',
    password: await bcrypt.hash('demo123', 10),
    level: 5,
    experience: 1200,
    reputation: 150,
    preferences: {
      theme: 'retro-green',
      notifications: true
    }
  });

  // Crear conversión de ejemplo
  await Conversion.create({
    user: demoUser._id,
    name: 'Demo Conversion',
    description: 'Conversión de ejemplo JSON a TOON',
    inputType: 'json',
    outputType: 'toon',
    inputData: JSON.stringify({ name: 'Demo', value: 42 }),
    outputData: 'name: Demo\nvalue: 42',
    isPublic: true,
    tags: ['demo', 'ejemplo'],
    metadata: {
      inputSize: 26,
      outputSize: 23,
      processingTime: 5,
      errorCount: 0,
      warningCount: 0
    }
  });

  // Crear post de ejemplo en el foro
  const post = await ForumPost.create({
    author: demoUser._id,
    title: '¡Bienvenidos a JSON-to-TOON!',
    content: 'Este es un post de ejemplo donde puedes compartir tus conversiones JSON ↔ TOON y hacer preguntas.\n\n¿Tienes algún JSON complejo que quieres convertir? ¡Compártelo aquí!\n\n¡Esperamos ver tus proyectos creativos! 🎮✨',
    category: 'general',
    tags: ['bienvenida', 'introduccion', 'json', 'toon'],
    upvotes: [demoUser._id],
    downvotes: [],
    views: 42,
    comments: [{
      user: demoUser._id,
      content: '¡Gracias por crear esta increíble plataforma! Me encanta el tema retro. 🕹️',
      upvotes: [],
      downvotes: []
    }]
  });

  // Crear más posts de ejemplo
  await ForumPost.create({
    author: demoUser._id,
    title: 'Tutorial: Convertir APIs complejas con JSON-to-TOON',
    content: 'En este tutorial aprenderás a convertir respuestas de APIs complejas usando nuestro convertidor.\n\nPaso 1: Analiza la estructura JSON\nPaso 2: Identifica los datos anidados\nPaso 3: Usa el convertidor\n\n¿Alguien ha probado con APIs de GraphQL?',
    category: 'tutorials',
    tags: ['tutorial', 'api', 'json', 'guia'],
    upvotes: [demoUser._id],
    downvotes: [],
    views: 28,
    isPinned: true
  });

  await ForumPost.create({
    author: demoUser._id,
    title: 'Feature Request: Soporte para YAML',
    content: '¿Sería posible agregar soporte para convertir YAML ↔ TOON también?\n\nCreo que sería muy útil para configuraciones de Docker y Kubernetes.',
    category: 'feature-request',
    tags: ['yaml', 'feature', 'docker', 'kubernetes'],
    upvotes: [],
    downvotes: [],
    views: 15
  });

  await ForumPost.create({
    author: demoUser._id,
    title: '[BUG] Error con arrays muy grandes',
    content: 'He encontrado un bug cuando intento convertir arrays con más de 1000 elementos.\n\nPasos para reproducir:\n1. Crear JSON con array grande\n2. Intentar conversión\n3. Error de timeout\n\n¿Alguien más ha experimentado esto?',
    category: 'bug-report',
    tags: ['bug', 'arrays', 'performance'],
    upvotes: [],
    downvotes: [],
    views: 8,
    status: 'solved',
    acceptedAnswer: null
  });

  console.log('  ✓ Usuario demo creado: demo@json-to-toon.dev / demo123');
};

// Ejecutar
initDatabase();
