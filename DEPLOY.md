# Desplegar PABLOGRANA.AI con chatbot de IA real (Vercel)

La web ya funciona en GitHub Pages, pero **el chatbot con IA real solo funciona en
Vercel**, porque necesita un backend seguro (`api/chat.js`) para guardar la clave de
API sin exponerla. En GitHub Pages el chatbot sigue funcionando con respuestas
predefinidas como respaldo.

## Pasos (10 minutos, sin programar)

### 1. Consigue tu clave de API de Anthropic
1. Entra en https://console.anthropic.com
2. Crea una cuenta y añade un método de pago (el uso de un chatbot web cuesta
   céntimos; el modelo configurado es **Claude Haiku**, el más económico).
3. Ve a **API Keys → Create Key**, cópiala (empieza por `sk-ant-...`).
   ⚠️ Guárdala bien: solo se muestra una vez.

### 2. Conecta el repo a Vercel
1. Entra en https://vercel.com y regístrate con tu cuenta de **GitHub**.
2. **Add New → Project** → importa el repo `pablograna.ai`.
3. No cambies nada de la configuración (Vercel detecta la web y la función `/api`).

### 3. Añade tu clave como variable de entorno
1. Antes de pulsar Deploy (o luego en **Settings → Environment Variables**):
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu clave `sk-ant-...`
2. Guarda y pulsa **Deploy**.

### 4. Listo
Vercel te da una URL tipo `https://pablograna-ai.vercel.app`.
Ahí el chatbot responde con IA real de Claude. Usa esa URL como tu web principal
(y puedes conectar tu dominio `pablograna.ai` en **Settings → Domains**).

---

## Notas
- La clave de API **nunca** está en el código ni en el navegador: solo vive en la
  variable de entorno de Vercel.
- Modelo configurado en `api/chat.js`: `claude-haiku-4-5-20251001`. Puedes cambiarlo
  a un modelo más potente (p. ej. Sonnet) si quieres respuestas más elaboradas.
- El comportamiento y el tono del asistente se ajustan en la variable `SYSTEM`
  dentro de `api/chat.js`.
