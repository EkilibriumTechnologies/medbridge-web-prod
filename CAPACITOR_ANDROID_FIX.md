# Capacitor Android - Fix para Cargar Assets Locales

## Problema Identificado

La app Android carga desde `http://localhost` o `https://localhost` en lugar de servir assets locales, causando errores 404 para archivos `_next/static/...`.

## Causa Raíz

1. **Android ignora archivos que comienzan con `_`**: Por defecto, Android's `aapt` tool ignora archivos/carpetas que comienzan con `_` (como `_next` de Next.js) durante el empaquetado.

2. **Configuración de servidor en Capacitor**: Si `server.url` o `server.androidScheme` está configurado, Capacitor intenta cargar desde un servidor remoto en lugar de assets locales.

## Solución Implementada

### 1. Configuración de Capacitor (`capacitor.config.ts`)

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medbridge.app',
  appName: 'MedBridge',
  webDir: 'out',
  // NO configurar server.url o server.hostname para producción
  // Esto forzaría a Capacitor a cargar desde un servidor remoto
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
```

**Importante**: 
- ❌ NO configurar `server.url` para producción
- ❌ NO configurar `server.hostname` para producción  
- ✅ `webDir: 'out'` debe apuntar al directorio de export estático de Next.js

### 2. Configuración de Next.js (`next.config.mjs`)

```javascript
const nextConfig = {
  reactStrictMode: true,
  // Habilitar export estático solo cuando se construye para Capacitor
  ...(process.env.CAPACITOR_BUILD === "true" && {
    output: "export",
    basePath: "",
    assetPrefix: "",
    trailingSlash: false,
  }),
  images: {
    // Imágenes sin optimizar requeridas para export estático
    ...(process.env.CAPACITOR_BUILD === "true" && { unoptimized: true }),
  },
};
```

### 3. Configuración de Android (`android/app/build.gradle`)

**CRÍTICO**: Agregar `aaptOptions` en `defaultConfig` para incluir archivos que comienzan con `_`:

```groovy
android {
    defaultConfig {
        applicationId "com.medbridge.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
        
        // CRÍTICO: Incluir archivos que comienzan con _ (como _next de Next.js)
        // Android's aapt tool ignora archivos que comienzan con _ por defecto
        aaptOptions {
            ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'
            // El patrón anterior asegura que la carpeta _next/ NO sea ignorada
        }
    }
}
```

### 4. Script de Build (`package.json`)

```json
{
  "scripts": {
    "build:capacitor": "cross-env CAPACITOR_BUILD=true next build && node scripts/fix-capacitor-paths.js",
    "cap:sync": "npx cap sync"
  }
}
```

## Comandos Exactos para Build

```bash
# 1. Construir Next.js con export estático
npm run build:capacitor

# 2. Sincronizar con Capacitor (copia assets a android/app/src/main/assets/public)
npx cap sync android

# 3. Verificar que los assets están en el lugar correcto
# Debe existir: android/app/src/main/assets/public/index.html
# Debe existir: android/app/src/main/assets/public/_next/static/...

# 4. Construir APK
cd android
./gradlew assembleDebug
# O para release:
./gradlew assembleRelease

# 5. Instalar en dispositivo
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Verificación usando Android Logs

```bash
# Limpiar logs
adb logcat -c

# Abrir la app
adb shell am start -n com.medbridge.app/.MainActivity

# Esperar 10 segundos y verificar logs
adb logcat -d | grep -E "Capacitor|MedBridgeMainActivity|Unable to open asset|Handling local request"

# Logs esperados (éxito):
# - "Capacitor: Handling local request: https://localhost/..." -> OK
# - "onPageFinished: https://localhost/"
# - "Page title: MedBridge - Your Digital Medical Emergency Card"
# - NO "Unable to open asset URL"

# Logs de error (problema):
# - "Unable to open asset URL: https://localhost/_next/static/..."
# - "HTTP error: 404"
```

## Estructura de Assets Esperada

```
android/app/src/main/assets/
└── public/
    ├── index.html
    ├── favicon.ico
    └── _next/
        └── static/
            ├── chunks/
            │   ├── main-*.js
            │   ├── framework-*.js
            │   ├── webpack-*.js
            │   └── pages/
            │       ├── _app-*.js
            │       └── index-*.js
            ├── css/
            │   └── *.css
            └── [buildId]/
                ├── _buildManifest.js
                └── _ssgManifest.js
```

## Troubleshooting

### Problema: "Unable to open asset URL"
- **Causa**: Los archivos `_next/` no están en el APK
- **Solución**: Verificar que `aaptOptions` está configurado en `build.gradle` y hacer `gradlew clean` antes de rebuild

### Problema: App carga desde servidor remoto
- **Causa**: `server.url` está configurado en `capacitor.config.ts`
- **Solución**: Eliminar o comentar la configuración `server` en `capacitor.config.ts`

### Problema: Assets no se copian
- **Causa**: `npx cap sync android` no se ejecutó después del build
- **Solución**: Siempre ejecutar `npm run build:capacitor` seguido de `npx cap sync android`

## Referencias

- [Capacitor Android Configuration](https://capacitorjs.com/docs/android/configuration)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Android aapt ignoreAssetsPattern](https://developer.android.com/studio/command-line/aapt2)




