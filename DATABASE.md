# 📊 Estructura de la Base de Datos

## Información General

- **Sistema:** MongoDB 6.0+
- **URI de Conexión:** `mongodb://localhost:27017/json-to-toon`
- **Modelos:** 5 colecciones principales

---

## 🗂️ Colecciones

### 1. **users**
Almacena información de usuarios con sistema de gamificación.

```javascript
{
  _id: ObjectId,
  username: String (unique, required, 3-30 chars),
  email: String (unique, required, validado),
  password: String (hashed con bcrypt, required),
  
  // Gamificación
  level: Number (default: 1),
  experience: Number (default: 0),
  reputation: Number (default: 0),
  achievements: [{
    achievementId: ObjectId (ref: AchievementDefinition),
    unlockedAt: Date (default: now)
  }],
  
  // Estadísticas
  conversionsCount: Number (default: 0),
  forumPostsCount: Number (default: 0),
  
  // Preferencias
  preferences: {
    theme: String (enum: terminal-green, cyberpunk, neon, crt, amber, matrix),
    notifications: Boolean (default: true),
    language: String (default: 'es')
  },
  
  // Control
  isActive: Boolean (default: true),
  lastLoginAt: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `{ email: 1 }` (unique)
- `{ username: 1 }` (unique)
- `{ level: -1, experience: -1 }` (leaderboard)
- `{ reputation: -1 }` (ranking)

---

### 2. **conversions**
Historial de conversiones JSON ↔ TOON.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  
  // Tipo de conversión
  conversionType: String (enum: 'json-to-toon', 'toon-to-json', required),
  
  // Datos
  inputData: Mixed (required),
  outputData: Mixed (required),
  
  // Métricas
  metrics: {
    inputSize: Number (bytes),
    outputSize: Number (bytes),
    executionTime: Number (ms),
    compressionRatio: Number (porcentaje),
    errors: Number (default: 0),
    warnings: Number (default: 0)
  },
  
  // Metadata
  name: String (opcional, para guardar favoritos),
  tags: [String] (opcional),
  isPublic: Boolean (default: false),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `{ userId: 1, createdAt: -1 }` (historial por usuario)
- `{ conversionType: 1 }`
- `{ 'metrics.executionTime': 1 }` (performance)

---

### 3. **forumposts**
Posts del sistema de foros.

```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User, required),
  
  // Contenido
  title: String (required, 5-200 chars),
  content: String (required, 10-10000 chars),
  category: String (enum: 'general', 'help', 'showcase', 'bug-report', required),
  tags: [String] (max 5 tags),
  
  // Votación
  upvotes: Number (default: 0),
  downvotes: Number (default: 0),
  voters: [{
    userId: ObjectId (ref: User),
    vote: Number (enum: 1, -1)
  }],
  
  // Comentarios
  comments: [{
    author: ObjectId (ref: User),
    content: String (required, 1-2000 chars),
    upvotes: Number (default: 0),
    downvotes: Number (default: 0),
    voters: [{
      userId: ObjectId (ref: User),
      vote: Number (enum: 1, -1)
    }],
    createdAt: Date (default: now)
  }],
  
  // Estado
  isSolved: Boolean (default: false),
  solvedAt: Date,
  isPinned: Boolean (default: false),
  views: Number (default: 0),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `{ author: 1, createdAt: -1 }`
- `{ category: 1, createdAt: -1 }`
- `{ tags: 1 }`
- `{ upvotes: -1 }` (posts populares)
- `{ isSolved: 1 }`

---

### 4. **notifications**
Sistema de notificaciones en tiempo real.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  
  // Contenido
  type: String (enum: 'achievement', 'reply', 'vote', 'mention', 'system', required),
  title: String (required),
  message: String (required),
  
  // Referencia
  link: String (URL de referencia, opcional),
  
  // Estado
  isRead: Boolean (default: false),
  readAt: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `{ userId: 1, isRead: 1, createdAt: -1 }` (notificaciones no leídas)
- `{ createdAt: 1 }` con TTL de 30 días (auto-eliminación)

---

### 5. **achievementdefinitions**
Definición de todos los achievements disponibles.

```javascript
{
  _id: ObjectId,
  key: String (unique, required),
  
  // Información
  title: String (required),
  description: String (required),
  icon: String (emoji, default: '🏆'),
  
  // Clasificación
  category: String (enum: 'conversion', 'social', 'special', required),
  rarity: String (enum: 'common', 'rare', 'epic', 'legendary', required),
  
  // Recompensas
  experienceReward: Number (default: 0),
  reputationReward: Number (default: 0),
  
  // Requisitos
  requirements: {
    type: String (enum: 'count', 'milestone', 'special'),
    target: Number (opcional),
    condition: String (opcional)
  },
  
  // Estado
  isActive: Boolean (default: true),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
- `{ key: 1 }` (unique)
- `{ category: 1, rarity: 1 }`

---

## 🚀 Inicialización

### Opción 1: Automática con el servidor
Los índices y achievements se crean automáticamente al iniciar el servidor por primera vez.

### Opción 2: Script manual
```bash
# Solo inicializar índices y achievements
npm run db:init

# Inicializar con datos de prueba
npm run db:init -- --seed
```

### Opción 3: MongoDB Shell
```bash
mongosh mongodb://localhost:27017/json-to-toon
```

```javascript
// Verificar colecciones
show collections

// Ver estadísticas de una colección
db.users.stats()

// Listar índices
db.users.getIndexes()

// Contar documentos
db.users.countDocuments()
db.conversions.countDocuments()
```

---

## 🛠️ Scripts NPM Disponibles

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "db:init": "node backend/scripts/initDatabase.js",
    "db:seed": "node backend/scripts/initDatabase.js --seed",
    "db:backup": "mongodump --uri=mongodb://localhost:27017/json-to-toon --out=./backups",
    "db:restore": "mongorestore --uri=mongodb://localhost:27017/json-to-toon ./backups/json-to-toon"
  }
}
```

---

## 📈 Tamaño Estimado

Para 1000 usuarios activos:

| Colección | Docs Estimados | Tamaño Aprox. |
|-----------|---------------|---------------|
| users | 1,000 | ~1 MB |
| conversions | 50,000 | ~25 MB |
| forumposts | 500 | ~2 MB |
| notifications | 5,000 | ~1 MB |
| achievementdefinitions | 50 | ~50 KB |
| **TOTAL** | **~56,550** | **~29 MB** |

---

## 🔐 Seguridad

- ✅ Passwords hasheados con bcrypt (salt rounds: 10)
- ✅ Índices únicos en email y username previenen duplicados
- ✅ TTL index en notifications (auto-limpieza a 30 días)
- ✅ Validación de datos con Mongoose schemas
- ✅ No se exponen IDs sensibles en las APIs

---

## 🔄 Migraciones

Si necesitas hacer cambios al schema en el futuro:

1. Crear script en `backend/scripts/migrations/`
2. Ejecutar: `node backend/scripts/migrations/001-add-field.js`
3. Documentar el cambio en este archivo

---

## 📊 Monitoreo

### Consultas útiles:

```javascript
// Top 10 usuarios por experiencia
db.users.find().sort({ experience: -1 }).limit(10)

// Conversiones más rápidas
db.conversions.find().sort({ 'metrics.executionTime': 1 }).limit(10)

// Posts sin resolver
db.forumposts.find({ isSolved: false }).count()

// Notificaciones no leídas por usuario
db.notifications.find({ userId: ObjectId("..."), isRead: false })

// Achievements más raros desbloqueados
db.achievementdefinitions.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "achievements.achievementId",
      as: "unlockedBy"
    }
  },
  { $match: { rarity: "legendary" } },
  { $project: { title: 1, unlockedCount: { $size: "$unlockedBy" } } },
  { $sort: { unlockedCount: -1 } }
])
```

---

## 🔧 Mantenimiento

### Backup automático (cron)
```bash
# Linux/Mac: crontab -e
0 2 * * * mongodump --uri=mongodb://localhost:27017/json-to-toon --out=/backups/$(date +\%Y\%m\%d)

# Windows: Task Scheduler
mongodump --uri=mongodb://localhost:27017/json-to-toon --out=C:\backups\%date%
```

### Limpiar notificaciones viejas (manual)
```javascript
db.notifications.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
})
```

---

## 📚 Referencias

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/)
- [Schema Design Best Practices](https://docs.mongodb.com/manual/core/data-model-design/)
