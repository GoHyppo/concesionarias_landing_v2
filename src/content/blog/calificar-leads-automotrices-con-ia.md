---
title: 'Cómo calificar leads automotrices con IA: Hot, Warm y Cold'
seoTitle: 'Calificar leads automotrices con IA'
description: 'Cómo un agente de IA califica leads de autos por WhatsApp según el plazo de compra, qué datos tiene que juntar y qué hacer con cada grupo en la concesionaria.'
summary: 'Calificar un lead automotriz con IA es dejar que un agente de WhatsApp junte en la conversación el modelo, la forma de pago y el plazo de compra, y clasifique al lead como Hot (compra en 60 días), Warm (más de 60 días) o Cold (consulta general). Cada grupo recibe otro trato y el vendedor atiende primero a los Hot.'
category: 'whatsapp-e-ia'
author: 'tomas-lagomarsino'
publishedAt: 2026-11-10
image: '../../assets/blog/calificar-leads-automotrices-con-ia.webp'
imageAlt: 'Ilustración de una máquina que reparte fichas con forma de globo de chat en tres carriles violetas, con una ficha naranja en el carril más brillante.'
keyTakeaways:
  - 'Un lead automotriz se califica por plazo de compra, modelo y forma de pago, no por cuántas preguntas respondió.'
  - 'Hot es intención de compra en los próximos 60 días, Warm es a más de 60 días y Cold es una consulta general.'
  - '"Sin Respuesta" describe a la concesionaria que no contestó, no al lead, y es la categoría que más ventas esconde.'
  - 'En Grupo Garden, el 94% de los leads se clasifica sin intervención humana en la decisión de ruteo, según el caso publicado.'
faq:
  - q: '¿Qué datos necesita un agente de IA para calificar un lead de autos?'
    a: 'Como mínimo, qué modelo o tipo de vehículo busca, cómo piensa pagarlo (contado, financiación o crédito) y en qué plazo piensa comprar. Con esos tres datos se puede clasificar al lead y decidir quién lo atiende. El resto, como la versión, el uso o la sucursal preferida, mejora la conversación del vendedor pero no cambia la clasificación.'
  - q: '¿Qué diferencia hay entre un lead Hot, Warm y Cold?'
    a: 'Un lead Hot tiene intención de compra en los próximos 60 días y entra en un seguimiento intenso y rápido. Un lead Warm piensa comprar en más de 60 días y recibe un seguimiento más espaciado. Un lead Cold hizo una consulta general sin intención clara y se deriva a una reactivación humana. La clasificación la decide el agente con lo que el cliente dijo en la conversación.'
  - q: '¿La calificación con IA reemplaza el criterio del vendedor?'
    a: 'No. La IA ordena la fila: decide qué conversación necesita a un vendedor ya y cuál puede esperar un seguimiento automático. El vendedor sigue usando su criterio en la conversación y puede corregir la clasificación cuando conoce mejor al cliente. Lo que se gana es que nadie pierda tiempo filtrando consultas que nunca iban a comprar.'
  - q: '¿Cómo se sabe si la calificación automática está funcionando?'
    a: 'Mirando la conversión por grupo a lo largo del tiempo. Si los leads Hot terminan en test drive y en venta más seguido que los Warm, y los Warm más que los Cold, el criterio está separando bien. Si los tres grupos convierten parecido, las preguntas de calificación no están capturando la intención real y hay que ajustarlas.'
related: ['seguimiento-de-leads-por-whatsapp', 'tiempo-de-respuesta-a-leads', 'bdc-vs-agente-de-ia']
cta: '/demo/'
draft: false
---

## Qué significa calificar un lead automotriz

Calificar un lead automotriz es decidir, con datos de la conversación, qué tan cerca está esa persona de comprar un auto y quién la tiene que atender. No es un formulario largo ni un puntaje abstracto: es responder tres preguntas sobre cada consulta antes de que un vendedor le dedique tiempo.

En muchas concesionarias esa decisión la toma el vendedor, a ojo, mientras atiende. El problema es que el vendedor filtra en lugar de vender, y que cada uno filtra con un criterio distinto. Un agente de IA hace ese trabajo con el mismo criterio para todos los leads, a cualquier hora.

## Los tres datos que definen a un lead de autos

Un lead de autos se califica con tres datos. Todo lo demás ayuda a la conversación, pero no cambia a quién se le asigna.

1. **Qué busca.** Un modelo concreto, un tipo de vehículo o solo "algo para la familia". Cuanto más concreto, más avanzada está la decisión.
2. **Cómo piensa pagar.** Contado, financiación de la concesionaria o crédito bancario. Define qué información necesita y quién tiene que intervenir.
3. **Cuándo piensa comprar.** Es el dato más importante y el que menos se pregunta. Una persona que compra este mes y otra que compra el año que viene pueden escribir el mismo mensaje.

El agente de ConcesionarIA junta esos datos conversando, sin que el cliente sienta que llena una planilla: pregunta por el modelo mientras entrega el catálogo, menciona la financiación cuando el cliente pide precio y pregunta el plazo cuando ofrece un test drive.

## Hot, Warm y Cold: clasificar por plazo de compra

La clasificación que usa el sistema en producción en Grupo Garden, publicada en el [caso de hyppo.io](https://hyppo.io/casos/garden/), se basa en el horizonte de compra:

| Grupo | Criterio | Qué recibe |
|---|---|---|
| Hot | Intención de compra en los próximos 60 días | Prioridad para el vendedor y seguimiento intenso dentro de la ventana de 24 horas de WhatsApp |
| Warm | Intención de compra a más de 60 días | Nurturing más lento, de siete días |
| Cold | Consulta general, sin intención clara | Derivación al call center para una reactivación humana |

Cuando el agente juntó suficiente información, una tarea de IA asigna el grupo y lo guarda en el perfil del cliente. Ese único dato maneja toda la automatización que viene después.

### Sin Respuesta: el grupo que no es culpa del lead

El tablero de calidad de leads de ConcesionarIA suma una cuarta categoría: "Sin Respuesta". Significa que la concesionaria no le respondió al lead, no que el lead no contestó. Es una distinción que importa, porque esos leads van a la cola del supervisor, que alerta al equipo y reasigna la conversación. Sobre el tiempo de respuesta y por qué decide la venta, escribimos en [esta guía](/blog/tiempo-de-respuesta-a-leads/).

## Cómo califica un agente de IA sin interrogar al cliente

Un buen agente no hace las tres preguntas seguidas. Las reparte a lo largo de la conversación, en el momento en que tienen sentido para el cliente. El agente que corre en Grupo Garden está construido sobre habilidades separadas, cada una con su trabajo:

- **Conversación inicial:** saluda, identifica qué busca la persona y ofrece ayuda concreta.
- **Selección de modelo:** muestra opciones y catálogo según lo que el cliente describe.
- **Crédito:** explica las opciones de financiación y detecta cómo piensa pagar.
- **Test drive:** propone y agenda la prueba de manejo.
- **Interés en otras marcas:** detecta cuando el cliente busca algo que vende otra marca del grupo.
- **Derivación a una persona:** pasa la conversación a un vendedor cuando hace falta.

Debajo de la conversación corren tareas de IA que clasifican el lead, validan los datos y generan los mensajes de seguimiento. Puedes ver cómo encaja todo en la página de [cómo funciona ConcesionarIA](/producto/).

### Lo que el agente no debería hacer

El agente no negocia precio ni promete condiciones que no estén cargadas. Cuando la conversación llega a ese punto, deriva a un vendedor, en el mismo hilo, con el contexto completo. La IA califica; el vendedor cierra.

## Qué hacer con cada grupo

La calificación solo sirve si cambia lo que pasa después. Cada grupo necesita un destino distinto:

1. **Hot va primero al vendedor.** Con alerta inmediata y la ficha del lead a la vista.
2. **Warm entra en un seguimiento automático** con contenido útil para su decisión: versiones, financiación, novedades del modelo que consultó.
3. **Cold va a una reactivación humana** o a una campaña de baja frecuencia, sin ocupar al vendedor.
4. **Sin Respuesta va al supervisor**, que lo reasigna antes de que se enfríe.

El detalle de las cadencias está en la guía de [seguimiento de leads por WhatsApp](/blog/seguimiento-de-leads-por-whatsapp/).

## Cómo saber si la calificación funciona

La calificación funciona cuando separa leads que convierten distinto. Si los Hot llegan al test drive y a la venta más seguido que los Warm, y los Warm más que los Cold, el criterio está bien. Si los tres grupos convierten parecido, las preguntas no están capturando la intención real.

### Automatización sin perder control

En Grupo Garden, el 94% de los leads se clasifica como Hot, Warm o Cold sin intervención humana en la decisión de ruteo, según el [caso Grupo Garden](/casos/grupo-garden/). El resto de los casos pasa por una persona, que es lo esperable: la automatización resuelve la mayoría y deja a la vista lo que necesita criterio humano.

### El motivo de descarte también es un dato

Cuando un lead se cierra sin venta, el motivo queda guardado en su perfil. Con el tiempo, eso muestra en qué etapa y por qué se pierden los leads de cada grupo, que es la información que necesitas para ajustar las preguntas de calificación.

La forma más directa de evaluar si este criterio sirve para tu concesionaria es verlo funcionar en una conversación real. En la [demo](/demo/) puedes escribirle al agente y ver cómo clasifica tu consulta.
