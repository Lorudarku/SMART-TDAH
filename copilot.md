@ -0,0 +1,30 @@
# 📘 Directrices para GitHub Copilot Chat

Estas son las normas y preferencias que debe seguir Copilot Chat al asistir en este proyecto.

## 🧠 Estilo de código

- Sigue prácticas modernas de código limpio: modularidad, funciones puras, SRP (Single Responsibility Principle).
- Usa comentarios **claros y contextuales** (los comentarios deben explicar todas las partes del código).
- No elimines partes que ya estén comentadas en el código a no ser que sea para modificar los comentarios o corregirlos.
- Sigue las convenciones de estilo propias de React, Node.js y PostgreSQL.

## 💬 Estilo de respuesta

- **Sé directo y técnico**. Evita explicaciones innecesarias si no se solicitan.
- Prioriza la **claridad** sobre la brevedad.
- Cuando se pida ayuda para depurar, explica las causas probables **y sugiere cómo verificar cada una**.

## 🧪 Tests y validaciones

- Siempre que implementes nuevas funciones con lógica no trivial, **sugiere o incluye pruebas automáticas** si es posible.
- Para funciones relacionadas con la base de datos, sugiere validaciones básicas o estructuras de control de errores.

## 🧩 Contexto de proyecto

Este proyecto es el TFG de una aplicación de estadísticas de ejercicios para niños con TDAH, usada por profesores para visualizar progreso. El código debe ser **claro, mantenible y orientado a interpretación de datos**. Se implementará un chatbot con IA como punto clave.

---

> ⚠️ Estas directrices deben considerarse en todas las interacciones dentro del proyecto.
