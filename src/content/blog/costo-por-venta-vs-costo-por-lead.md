---
title: 'Costo por venta vs costo por lead en una concesionaria: qué mirar primero'
seoTitle: 'Costo por venta vs costo por lead automotriz'
description: 'Por qué el costo por lead solo no alcanza para decidir en qué campaña invertir y cómo pasar a mirar el costo por venta en una concesionaria.'
summary: 'El costo por lead mide cuánto cuesta cada contacto, pero no cuánto cuesta cada auto vendido. Una campaña con leads baratos puede terminar costando más por venta si convierte peor. Para decidir dónde invertir, una concesionaria necesita cruzar el gasto por canal con las ventas que ese canal realmente produce, no solo con los leads que genera.'
category: 'medicion-y-atribucion'
author: 'nicolas-lew-deveali'
publishedAt: 2026-11-11
image: '../../assets/blog/costo-por-venta-vs-costo-por-lead.webp'
imageAlt: 'Ilustración de dos embudos violeta, uno que termina en un lead y otro que termina en un auto, conectados por una balanza con un elemento naranja.'
keyTakeaways:
  - 'El costo por lead mide el gasto por contacto. El costo por venta mide el gasto por auto vendido, y es el número que explica el resultado del mes.'
  - 'Un canal con leads baratos puede tener el costo por venta más alto del mes si su tasa de cierre es baja.'
  - 'Calcular el costo por venta por canal pide cruzar el gasto, los leads y las ventas con el mismo origen, no promediarlos a nivel cuenta.'
  - 'El cruce solo sirve si cada lead queda etiquetado con su canal de origen desde que entra, y ese dato se sostiene hasta el cierre de la venta.'
faq:
  - q: '¿Qué diferencia hay entre costo por lead y costo por venta?'
    a: 'El costo por lead divide el gasto de una campaña por la cantidad de contactos que generó. El costo por venta divide ese mismo gasto por la cantidad de autos que esos contactos terminaron comprando. El primero mide la eficiencia para generar interés, el segundo mide la eficiencia para generar ventas, y pueden moverse en direcciones opuestas.'
  - q: '¿Por qué una campaña con leads baratos puede salir cara igual?'
    a: 'Porque el costo por venta depende de dos números, no de uno: cuánto cuesta cada lead y qué proporción de esos leads termina en una venta. Una campaña puede tener el lead más barato del mes y la tasa de cierre más baja, y terminar con el costo por venta más alto. Sin mirar los dos números juntos, esa campaña parece la más eficiente.'
  - q: '¿Qué hace falta para calcular el costo por venta por canal?'
    a: 'Tres datos cruzados con el mismo origen: el gasto de cada canal, los leads que generó y las ventas que de verdad salieron de esos leads. El punto débil habitual es el tercero: si el vendedor registra la venta sin conservar el canal de origen del lead, el cruce se rompe y el cálculo vuelve a depender de promedios generales.'
related: ['que-campana-vende-autos', 'tiempo-de-respuesta-a-leads', 'bdc-vs-agente-de-ia']
cta: '/calculadora-roi/'
draft: false
---

## Costo por lead y costo por venta no miden lo mismo

El costo por lead es el número que más se mira al evaluar una campaña: gasto dividido por contactos generados. Es útil para comparar qué tan barato es captar atención, pero no dice nada sobre si esa atención se convierte en una venta. El costo por venta sí lo dice: gasto dividido por autos vendidos que salieron de ese canal.

Son números que pueden moverse en direcciones opuestas. Una campaña puede bajar su costo por lead y subir su costo por venta al mismo tiempo, si los leads nuevos que atrae convierten peor que los anteriores. Decidir dónde invertir el próximo mes mirando solo el costo por lead es mirar la mitad del problema.

Esta confusión está relacionada con otra parecida: la de [qué campaña vende autos](/blog/que-campana-vende-autos/), que explica cómo atribuir una venta a su origen real cuando el cliente pasó por varios canales antes de comprar. El costo por venta es el paso siguiente: una vez que sabes de qué canal vino cada venta, puedes dividir el gasto de ese canal por esas ventas y comparar.

## Por qué un lead barato puede salir caro

Piénsalo con dos campañas hipotéticas del mismo mes. La primera trae leads a un costo bajo, pero son contactos poco calificados: preguntan precio y desaparecen. La segunda trae leads más caros, pero más calificados: ya saben qué modelo quieren y en qué plazo piensan comprar.

Si la primera campaña convierte menos de la mitad que la segunda, puede terminar con un costo por venta más alto aunque su costo por lead sea el más bajo del mes. El gasto total se reparte entre menos ventas, y eso pesa más que el precio de entrada de cada contacto.

Esto no quiere decir que el costo por lead sea un dato inútil. Sirve para sostener un volumen de contactos y para comparar campañas dentro del mismo canal. El problema aparece cuando se usa solo, para decidir entre canales distintos, porque ahí la tasa de cierre de cada uno pesa tanto como el precio del contacto.

## Cómo se arma el cruce

Calcular el costo por venta por canal pide tres datos con el mismo origen:

1. **Gasto por canal**, el número que ya existe en cualquier reporte de medios.
2. **Leads por canal**, que cualquier formulario o integración suele registrar.
3. **Ventas por canal**, el dato que casi siempre falta, porque se pierde entre el lead y el cierre.

| Dato | Dónde suele estar | Por qué se pierde |
|---|---|---|
| Gasto por canal | Reporte de medios o planilla de pauta | No se pierde, pero vive separado del resto |
| Leads por canal | CRM o formulario de contacto | Se registra bien si el canal queda etiquetado al entrar |
| Ventas por canal | Sistema de ventas o DMS | El vendedor cierra la venta sin anotar de dónde vino el lead |

El tercer dato es el que rompe el cálculo en la mayoría de las concesionarias. Un lead entra con su canal de origen claro, pero a los pocos días esa etiqueta se pierde: pasa de WhatsApp a una llamada, de una llamada a una visita presencial, y nadie vuelve a escribir de dónde vino originalmente. Cuando llega el cierre, la venta queda sin origen, y el costo por venta solo se puede calcular a nivel cuenta, no por canal.

## Qué hace falta para que el dato no se pierda

La forma de sostener el cruce es que el canal de origen quede guardado junto con el lead desde el primer contacto, y que ese registro viaje con la conversación hasta el cierre. En ConcesionarIA, cada conversación que entra por WhatsApp queda con su origen, su calificación y su seguimiento en un mismo registro, así que llegar a la venta no depende de que alguien lo transcriba a mano en una planilla aparte.

Esto no reemplaza al equipo comercial: el vendedor sigue siendo quien cierra. Lo que cambia es que el dato de origen no depende de que alguien se acuerde de anotarlo. El detalle de cómo se reparte el trabajo entre el equipo humano y un agente de IA está en la comparación entre [BDC humano y agente de IA](/blog/bdc-vs-agente-de-ia/).

## De los datos al número que importa

Una vez que gasto, leads y ventas están cruzados por canal, el costo por venta sale de dividir el primero por el tercero. El paso siguiente es compararlo contra la ganancia bruta que deja cada auto vendido, que es exactamente el cálculo que arma la [calculadora de ROI para concesionarias](/calculadora-roi/): cuántos autos extra hacen falta vender para que una inversión se pague, con tus propios números de leads, tasa de cierre y ganancia por auto.

En Grupo Garden, el agente de IA de ConcesionarIA clasifica automáticamente el 94% de los leads que entran por WhatsApp, según el [caso publicado](https://hyppo.io/casos/garden/). Esa clasificación es la que después permite cruzar cada venta con el canal y la campaña de las que vino, sin depender de que alguien lo cargue a mano.

## Para ir probando esto ya

No hace falta esperar a tener el sistema perfecto para empezar a mirar el costo por venta. Alcanza con elegir dos canales que hoy se comparan solo por costo por lead, revisar manualmente las últimas ventas de cada uno y ver si el canal "más barato" sigue siéndolo una vez que se cuentan las ventas y no solo los contactos. Si la diferencia es grande, ya hay una señal de que vale la pena ordenar el cruce completo.

El resto del trabajo (que el canal quede etiquetado desde el primer mensaje y que ese dato llegue intacto hasta el cierre) es lo que une a una concesionaria con intención de ordenar su medición al [sistema de ventas para concesionarias](/para-concesionarias/) pensado para concesionarios oficiales, multimarca y grupos automotrices.
