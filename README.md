# Roba, Dispara, Whisky 🤠

Un duelo del salvaje oeste con mecánica piedra-papel-tijera. Juego de cartas para 2 jugadores con modo local (Pass & Play) y modo online en tiempo real.

## Cómo jugar

- **Robar** le gana a **Whisky**
- **Whisky** le gana a **Disparar**
- **Disparar** le gana a **Robar**

### Condiciones de victoria

- Juntar 9 pepitas de oro
- Acertar 4 disparos
- Vaciar la botella de whisky (3 tragos)

## Stack

- [Astro](https://astro.build/) + [Svelte 5](https://svelte.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore) (modo online)
- [QRCode](https://www.npmjs.com/package/qrcode) (para unirse a salas)

## Instalación

```bash
git clone https://github.com/tu-usuario/roba-dispara-whisky.git
cd roba-dispara-whisky
npm install
```

## Configuración de Firebase (modo online)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Cloud Firestore** (en modo test para desarrollo)
3. Registra una **Web App** en Project Settings
4. Copia las credenciales y crea un archivo `.env`:

```bash
cp .env.example .env
```

5. Llena el `.env` con tus credenciales:

```
PUBLIC_FIREBASE_API_KEY=tu_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## Desarrollo

```bash
npm run dev
```

## Build y Deploy

```bash
npm run build
npm run preview
```

Para deploy en Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Estructura del proyecto

```
src/
├── components/
│   ├── shared/          # Componentes reutilizados en local y online
│   ├── App.svelte       # Orquestador principal
│   ├── Juego.svelte     # Modo local (Pass & Play)
│   ├── JuegoOnline.svelte # Modo online (Firebase)
│   ├── Tutorial.svelte  # Tutorial interactivo
│   └── ...
├── lib/
│   ├── gameLogic.js     # Lógica del juego
│   ├── firebase.js      # Configuración Firebase
│   └── roomService.js   # Servicio de salas online
└── pages/
    └── index.astro
```

## Pendientes

- [ ] Responsividad móvil (revelación, tablero, cartas)
- [ ] Tutorial responsivo

## Licencia

MIT
