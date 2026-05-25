/**
 * SÚPER MAJES — Formulario de Reporte de Visita
 * Cómo usar:
 *  1. Ve a script.google.com
 *  2. Crea un nuevo proyecto
 *  3. Pega este código y ejecuta crearFormularioSuperMajes()
 *  4. Autoriza los permisos cuando se soliciten
 *  5. El formulario aparecerá en tu Google Drive
 */

function crearFormularioSuperMajes() {

  var form = FormApp.create('🌟 SÚPER MAJES — Reporte de Visita');

  form.setDescription(
    'Formulario de reporte diario para el equipo de mercaderistas.\n' +
    'Completa todos los campos requeridos al finalizar tu jornada.'
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  form.setConfirmationMessage(
    '✅ ¡Reporte enviado con éxito! Gracias por tu gestión, Súper Maje. 💪'
  );

  // ─────────────────────────────────────────────────────────
  // SECCIÓN 1 — INFORMACIÓN BÁSICA
  // ─────────────────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('1. Información Básica')
    .setHelpText('Datos de identificación de la visita');

  form.addTextItem()
    .setTitle('Nombre del mercaderista')
    .setHelpText('Escribe tu nombre completo')
    .setRequired(true);

  form.addDateItem()
    .setTitle('Fecha')
    .setRequired(true);

  form.addListItem()
    .setTitle('Ciudad o zona')
    .setChoiceValues([
      'Tegucigalpa',
      'San Pedro Sula',
      'La Ceiba',
      'Choloma',
      'El Progreso',
      'Comayagua',
      'Choluteca',
      'Siguatepeque',
      'Otra'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Nombre de tienda o cliente visitado')
    .setHelpText('Nombre del punto de venta')
    .setRequired(true);

  // ─────────────────────────────────────────────────────────
  // SECCIÓN 2 — COBERTURA Y VISITA
  // ─────────────────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('2. Cobertura y Visita')
    .setHelpText('Datos para medir la intervención en campo');

  form.addMultipleChoiceItem()
    .setTitle('¿La tienda fue visitada?')
    .setChoiceValues(['Sí', 'No'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Se realizó actividad en punto de venta?')
    .setChoiceValues(['Sí', 'No'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Cantidad de tiendas impactadas en la jornada')
    .setHelpText('Escribe un número. Ej: 12')
    .setValidation(
      FormApp.createTextValidation()
        .requireNumber()
        .build()
    )
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Se realizó degustación?')
    .setChoiceValues(['Sí', 'No'])
    .setRequired(true);

  // ─────────────────────────────────────────────────────────
  // SECCIÓN 3 — EJECUCIÓN COMERCIAL
  // ─────────────────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('3. Ejecución Comercial')
    .setHelpText('Combos armados y penetración de referencias');

  form.addMultipleChoiceItem()
    .setTitle('¿Se armó combo promocional?')
    .setChoiceValues(['Sí', 'No'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Referencia trabajada')
    .setHelpText('Puedes seleccionar más de una')
    .setChoiceValues([
      'Trululu Nanos',
      'Trululu Nanos — Edición Estelar',
      'Bianchi Leche',
      'OkaLoka Novedades',
      'Next Refrescante',
      'Otra referencia'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Cantidad de combos armados')
    .setHelpText('Escribe 0 si no se armó ninguno')
    .setValidation(
      FormApp.createTextValidation()
        .requireNumber()
        .build()
    )
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Se instaló material de apoyo (POP / exhibidor / branding)?')
    .setChoiceValues(['Sí', 'No'])
    .setRequired(true);

  // ─────────────────────────────────────────────────────────
  // SECCIÓN 4 — EVIDENCIA
  // ─────────────────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('4. Evidencia')
    .setHelpText('Clave para validar la ejecución en campo');

  form.addFileUploadItem()
    .setTitle('Carga de fotografía del punto de venta')
    .setHelpText('Sube 1 o más fotos que evidencien la actividad realizada')
    .setAllowedFileTypes([
      FormApp.FileType.IMAGE
    ])
    .setMaxFiles(5)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Observaciones del punto de venta')
    .setHelpText(
      'Anota novedades, inconvenientes, oportunidades o cualquier dato relevante del cliente'
    )
    .setRequired(false);

  // ─────────────────────────────────────────────────────────
  // LOG DE URLS
  // ─────────────────────────────────────────────────────────
  var editUrl      = form.getEditUrl();
  var publishedUrl = form.getPublishedUrl();
  var shortenedUrl = form.shortenFormUrl(publishedUrl);

  Logger.log('═══════════════════════════════════════');
  Logger.log('✅  FORMULARIO CREADO EXITOSAMENTE');
  Logger.log('───────────────────────────────────────');
  Logger.log('🔧 Editar:    ' + editUrl);
  Logger.log('🔗 Compartir: ' + shortenedUrl);
  Logger.log('═══════════════════════════════════════');

  // Muestra las URLs en un popup
  var ui = SpreadsheetApp.getUi ? SpreadsheetApp.getUi() : null;
  SpreadsheetApp.getActiveSpreadsheet && Browser.msgBox(
    '✅ Formulario SÚPER MAJES creado\n\n' +
    '🔗 Enlace para compartir:\n' + shortenedUrl
  );
}
