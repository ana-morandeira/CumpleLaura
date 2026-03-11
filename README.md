# 🎀 Feliz Cumpleaños Laura

App interactiva de cumpleaños donde los amigos pueden tirar de las orejas de Laura y desencadenar efectos visuales y sonoros.

🔗 **[Ver en vivo](https://ana-morandeira.github.io/CumpleLaura/)**

---

## ✨ Funcionalidades

- 👂 **Orejas interactivas** — clic para estirarlas con animación física
- 🔊 **Sonidos graciosos aleatorios** — squeek, boing, wobble, fart, pop
- 💥 **Confetti** con emojis en cada tirón
- 😂 **Emoji de reacción** aleatorio en cada interacción
- 🏆 **Mensajes de hito** al alcanzar 1, 5, 10, 25, 50 y 100 tirones
- 📊 **Gráfico de actividad** en tiempo real (últimos 30 segundos)
- 💾 **Contador persistente** guardado en localStorage

---

## 📁 Estructura del proyecto

```
cumple-laura/
├── index.html        # Estructura HTML
├── styles.css        # Estilos y animaciones
├── app.js            # Lógica JavaScript
├── LauraCartoon.png  # Imagen de Laura (no incluida en el repo)
└── README.md
```

---

## 🚀 Uso local

1. Clona el repositorio:
```bash
git clone https://github.com/ana-morandeira/cumple-laura.git
cd cumple-laura
```

2. Añade la imagen `LauraCartoon.png` en la raíz del proyecto

3. Abre `index.html` en el navegador — no necesita servidor ni instalaciones

---

## 🌐 Despliegue en GitHub Pages

El proyecto está desplegado automáticamente desde la rama `main`.

Para actualizarlo:
```bash
git add .
git commit -m "Update"
git push origin main
```

GitHub Pages publica desde la raíz del repositorio en la rama `main`. Configuración en **Settings → Pages → Branch: main / root**.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura |
| CSS3 | Estilos y animaciones |
| JavaScript (ES6+) | Lógica de la app |
| Tailwind CSS (CDN) | Utilidades de apoyo |
| Web Audio API | Generación de sonidos |
| Canvas API | Motor de confetti |
| localStorage | Persistencia del contador |

---

## 📐 Arquitectura del código (`app.js`)

El código está organizado en secciones claramente separadas:

```
app.js
├── Constants       — valores configurables
├── State           — variables de estado
├── DOM References  — referencias al HTML
├── Persistence     — localStorage
├── Audio engine    — funciones de sonido
├── UI helpers      — funciones de interfaz
├── Activity bars   — gráfico de actividad
├── Confetti engine — motor de partículas
├── Main action     — lógica principal (handleEarPull)
├── Event listeners — eventos
└── Init            — inicialización
```

---

## 🎨 Paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Fucsia | `#FF2D9A` | Color principal, orejas, flash |
| Dorado | `#FFD700` | Contador, borde del marco |
| Violeta | `#9B5DE5` | Acento |
| Cian | `#00D4FF` | Acento |
| Lima | `#AAFF00` | Acento |

---

*Hecho con 💖 para el cumpleaños de Laura*
