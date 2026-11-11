---
title: 'Cómo saber qué campaña vende autos (y no solo cuál trae leads)'
seoTitle: 'Cómo saber qué campaña vende autos'
description: 'Saber cuántos leads trae cada campaña no alcanza. Cómo unir el lead de la pauta con la factura del ERP para ver qué campaña de tu concesionaria vende autos.'
summary: 'Para saber qué campaña vende autos hay que unir cada lead con su venta: guardar el origen del lead, registrar la conversación de WhatsApp en el mismo perfil y cruzarlo con la factura del ERP por teléfono, documento o email. Con ese circuito cerrado, la concesionaria compara campañas por autos vendidos y no por leads.'
category: 'medicion-y-atribucion'
author: 'nicolas-lew-deveali'
publishedAt: 2026-11-10
image: '../../assets/blog/que-campana-vende-autos.webp'
imageAlt: 'Ilustración de una línea que une un megáfono con un auto en una plataforma giratoria y termina en un documento cerrado.'
keyTakeaways:
  - 'Muchas concesionarias miden leads por campaña porque el dato de la venta vive en otro sistema y nadie lo une con el lead.'
  - 'El circuito se cierra guardando el origen de cada lead, registrando la conversación en el mismo perfil y cruzándolo con la factura del ERP.'
  - 'Para reconocer a la misma persona entre sistemas sirven tres claves: los últimos seis dígitos del teléfono, el documento y el email.'
  - 'En Grupo Garden, el 100% de los leads nuevos tiene trazabilidad desde el primer mensaje de WhatsApp hasta la factura en SAP, según el caso publicado.'
faq:
  - q: '¿Cómo saber qué campaña generó la venta de un auto?'
    a: 'Hay que guardar el origen de cada lead cuando entra (campaña, portal, formulario o showroom) y después cruzar a ese lead con la venta registrada en el ERP de la concesionaria. El cruce se hace reconociendo a la misma persona en los dos sistemas por teléfono, documento o email. Con eso, cada factura queda asociada a la campaña que trajo al comprador.'
  - q: '¿Por qué los leads de WhatsApp rompen la atribución?'
    a: 'Porque la conversación suele seguir en el teléfono personal de un vendedor y la venta se carga después en el ERP sin ninguna referencia al anuncio que la originó. El dato de origen queda en la plataforma de anuncios y el dato de venta en el sistema de facturación, sin nada que los una. La solución es registrar la conversación en un perfil del cliente que guarde su origen.'
  - q: '¿Qué ventana de atribución usar en una concesionaria?'
    a: 'Una ventana larga, porque la compra de un auto puede llevar meses entre la primera consulta y la factura. ConcesionarIA trabaja por defecto con una ventana de 180 días, que se ajusta según el ciclo de venta de cada concesionaria. Una ventana corta, de las que usan las plataformas de anuncios, deja afuera buena parte de las ventas.'
  - q: '¿Qué hago con el dato de ventas por campaña?'
    a: 'Tres cosas: mover presupuesto hacia las campañas que venden y no solo las que traen consultas baratas, revisar qué modelos se venden desde cada canal, y ver qué vendedores convierten mejor los leads de cada origen. Con la venta identificada, también se puede devolver esa señal a las plataformas de anuncios como conversión.'
related: ['tiempo-de-respuesta-a-leads', 'leads-de-plan-de-ahorro', 'bdc-vs-agente-de-ia']
cta: '/calculadora-roi/'
draft: false
---

## Por qué casi ninguna concesionaria sabe qué campaña vende

Casi ninguna concesionaria sabe qué campaña vende autos porque el dato de la campaña y el dato de la venta viven en sistemas que no se hablan. La plataforma de anuncios sabe quién hizo clic. El ERP sabe quién compró. En el medio hay una conversación de WhatsApp que no dejó registro, y ahí se corta el circuito.

El resultado es conocido: el equipo de marketing optimiza por costo por lead, el equipo comercial dice que los leads son malos y el dueño no puede saber quién tiene razón.

### El circuito se corta en WhatsApp

El lead hace clic en un anuncio, escribe por WhatsApp y la conversación sigue en el teléfono de un vendedor. Semanas después, esa persona compra y la venta se carga en el ERP. Nadie anotó de qué anuncio venía. La campaña que trajo a ese comprador no recibe el crédito, y la que trajo cien consultas que nunca compraron parece la mejor.

### El mismo número, tres versiones

Cuando cada área mira su propio sistema, cada una tiene su cifra. En el [caso Grupo Garden](/casos/grupo-garden/), el responsable de medios del grupo cuenta que antes el mismo indicador daba tres números distintos según quién lo reportara: marketing, gestión de leads o el equipo comercial. Nadie estaba equivocado; cada uno miraba un pedazo distinto.

## Cómo cerrar el circuito entre el lead y la factura

Cerrar el circuito es unir, para cada cliente, de dónde vino y qué compró. Se hace en cinco pasos y ninguno exige cambiar el ERP de la concesionaria.

1. **Guarda el origen de cada lead cuando entra.** Campaña, portal, formulario web, código QR en un evento o visita al showroom. Cada contacto registra su origen y su suborigen.
2. **Registra la conversación en el mismo perfil.** Cada mensaje de WhatsApp queda asociado a esa persona, con su origen ya guardado.
3. **Reconoce a la misma persona en el ERP.** ConcesionarIA cruza los registros con tres claves: los últimos seis dígitos del teléfono, el documento y el email. Con una sola coincidencia alcanza para unir el lead con la venta.
4. **Define una ventana de atribución.** La compra de un auto puede llevar meses. La configuración estándar de ConcesionarIA usa 180 días entre el contacto y la venta.
5. **Mira el resultado por campaña, canal, modelo y vendedor.** Recién ahí se puede comparar campañas por autos vendidos.

Qué sistemas se pueden conectar para hacer este cruce (SAP, Microsoft Dynamics, CRMs y DMS propios) está detallado en la página de [integraciones](/integraciones/).

### Por qué tres claves y no una

Una persona puede dejar un teléfono distinto en el formulario y en el salón, o escribir con un número que no coincide con el de la factura. Usar solo el email o solo el teléfono deja ventas sin unir. Con tres claves, basta con que una coincida.

## Leads por campaña contra ventas por campaña

La diferencia entre medir leads y medir ventas cambia las decisiones de pauta. Esta tabla resume qué responde cada enfoque:

| Pregunta | Midiendo leads por campaña | Midiendo ventas por campaña |
|---|---|---|
| ¿Qué campaña rinde más? | La que trae consultas más baratas | La que trae compradores |
| ¿Qué modelo conviene pautar? | El que genera más preguntas | El que más se vende desde ese canal |
| ¿Los leads son malos? | No se puede saber | Se ve en qué etapa se caen y por qué |
| ¿Qué vendedor convierte mejor? | No se puede comparar | Se ve por origen del lead |

## Qué hacer cuando ya sabes qué campaña vende

Con el circuito cerrado, el dato de ventas por campaña se usa en tres frentes.

### En la pauta

Mover presupuesto hacia las campañas que traen compradores, aunque su costo por lead sea más alto. Una campaña con leads caros que compran puede rendir más que una con leads baratos que no avanzan. Conviene revisarlo con una cadencia fija, por ejemplo una vez por mes, y siempre con la misma ventana de atribución: si la ventana cambia entre un mes y otro, las campañas dejan de ser comparables y la discusión vuelve a ser de opiniones. Con la venta identificada, además, se puede devolver esa señal a las plataformas de anuncios como conversión, para que optimicen por compradores y no por clics.

### En el producto

Ver qué modelos se venden desde cada canal. Hay modelos que generan muchas consultas y pocas ventas, y otros al revés. Ese cruce ayuda a decidir qué modelo pautar en cada plataforma y qué stock empujar desde el salón, en lugar de repartir el presupuesto por intuición.

### En el equipo

El tablero de ConcesionarIA muestra el ranking de vendedores, el rendimiento por modelo y por campaña y la atribución de cada venta a la campaña que la originó. Si un canal trae buenos compradores y un vendedor los convierte mucho menos que el resto, el problema no es la pauta. Muchas veces la diferencia está en la velocidad: lo explicamos en la guía sobre [tiempo de respuesta a leads](/blog/tiempo-de-respuesta-a-leads/).

## Lo que muestra el caso Grupo Garden

En Grupo Garden, el mayor retailer de vehículos de Paraguay, el 100% de los leads nuevos tiene trazabilidad desde el primer mensaje de WhatsApp hasta la factura en SAP, según el caso publicado en [hyppo.io](https://hyppo.io/casos/garden/). Los formularios web, los formularios de TikTok, los códigos QR de eventos y los registros de showroom entran a la misma capa de perfiles, así que un lead que escaneó un QR un sábado y entró al salón el martes se reconoce como una sola persona.

## Calcula cuánto vale cerrar el circuito

Antes de cambiar nada, conviene estimar cuánto representa para tu concesionaria vender algunos autos más con los mismos leads. La [calculadora de ROI](/calculadora-roi/) hace esa cuenta con tus propios números: leads por mes, tasa de cierre y ganancia por auto.
