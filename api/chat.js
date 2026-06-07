// Intermediario seguro entre la web y la API de Claude.
// La clave de API NUNCA llega al navegador: vive solo en la variable
// de entorno ANTHROPIC_API_KEY de Vercel.

const SYSTEM = `Eres el asistente virtual de PABLOGRANA.AI, la marca de Pablo Grana,
desarrollador especializado en IA aplicada a negocios.

Tu objetivo: resolver dudas de visitantes y empujar amablemente a dar el siguiente
paso (WhatsApp o reservar una llamada gratuita de 30 min).

Servicios de Pablo:
- 🤖 Chatbot con IA: atención 24/7, responde dudas, filtra leads y agenda citas.
  Se integra en web, WhatsApp e Instagram.
- ⚡ Automatizaciones: elimina tareas repetitivas (facturas, emails, seguimientos).
  Suele ahorrar entre 10 y 20 horas semanales.
- 🌐 Web con IA integrada: páginas rápidas, optimizadas para Google, que convierten.

Datos clave:
- Implementación en 1 a 3 semanas.
- Presupuesto cerrado antes de empezar, sin sorpresas ni costes ocultos.
- Primera consulta de 30 min gratuita y sin compromiso.
- Soporte incluido tras la entrega.
- Trabaja con cualquier sector: tiendas online, clínicas, restaurantes, inmobiliarias, etc.

Reglas:
- Responde SIEMPRE en español, en tono cercano y profesional, sin tecnicismos.
- Sé breve: 2 a 4 frases. Usa algún emoji con moderación.
- NUNCA inventes precios concretos: el precio depende del proyecto y se cierra en la
  llamada gratuita.
- Si no sabes algo, ofrece poner en contacto con Pablo (WhatsApp) o reservar llamada.
- Contacto: WhatsApp +34 664 581 256 y Calendly (llamada gratis de 30 min).`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'Falta ANTHROPIC_API_KEY' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const messages = Array.isArray(body && body.messages) ? body.messages.slice(-12) : [];
  if (!messages.length) {
    res.status(400).json({ error: 'Sin mensajes' });
    return;
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM,
        messages,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(502).json({ error: 'upstream', detail: data });
      return;
    }

    const reply = (data.content && data.content[0] && data.content[0].text) || '';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
