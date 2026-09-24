# Instalar PWA + Conectar Firebase

## Archivos a subir a tu repo (junto a index.html)
- manifest.json
- sw.js
- carpeta icons/  (todos los PNG)
(index.html ya trae los enlaces; súbelo también en su nueva versión.)

Con eso, al abrir https://chokorad.github.io/recetas/ en el celular:
- Aparece el botón "⬇️ App" en la barra (Android/Chrome) para instalarla, o
- Menú del navegador → "Agregar a pantalla de inicio".
Queda como app con tu ícono, a pantalla completa y funciona offline.

## Firebase (sincronizar pacientes y medicamentos)
1. Entra a https://console.firebase.google.com → "Agregar proyecto" (nombre: recetas). Sin Analytics está bien.
2. En el proyecto: icono </> (Web) → registra una app (nombre: recetas). Copia el objeto `firebaseConfig` (apiKey, authDomain, projectId, appId...).
3. Menú izquierdo → Build → Authentication → Get started → pestaña "Sign-in method" → habilita "Correo electrónico/Contraseña".
4. Menú izquierdo → Build → Firestore Database → Crear base de datos → modo producción → ubicación (us-central o la más cercana).
5. En Firestore → pestaña "Reglas", pega esto y publica:

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{uid} {
          allow read, write: if request.auth != null && request.auth.uid == uid;
        }
      }
    }

6. En la app: ⚙️ Opciones → "Sincronización en la nube (Firebase)":
   - Pega el JSON de config (solo el objeto, ej. {"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."})
   - Pon tu correo y una contraseña (la primera vez crea la cuenta sola).
   - "Conectar y sincronizar".
7. Repite el paso 6 en tu otro dispositivo con el MISMO correo y contraseña → se sincronizan.

Notas:
- Los PACIENTES se guardan CIFRADOS con tu contraseña (ni Google los lee). Si cambias la contraseña, los pacientes viejos no se podrán descifrar.
- El catálogo de MEDICAMENTOS va sin cifrar (no es dato sensible).
- Sin internet, la app sigue funcionando local; sincroniza cuando vuelve la conexión.
