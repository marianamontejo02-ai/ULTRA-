from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# ── Page margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Cm(1.8)
    section.bottom_margin = Cm(1.8)
    section.left_margin   = Cm(2.2)
    section.right_margin  = Cm(2.2)

# ── Palette ───────────────────────────────────────────────────────────────────
LIME   = RGBColor(0x80, 0xCC, 0x00)
DARK   = RGBColor(0x1C, 0x1C, 0x1C)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
LGRAY  = RGBColor(0x66, 0x66, 0x66)
MGRAY  = RGBColor(0x99, 0x99, 0x99)

# ── Core helpers ──────────────────────────────────────────────────────────────

def set_font(run, size=11, bold=False, color=None, italic=False, name='Calibri'):
    run.font.name   = name
    run.font.size   = Pt(size)
    run.font.bold   = bold
    run.font.italic = italic
    if color: run.font.color.rgb = color

def no_space(para, before=0, after=0):
    para.paragraph_format.space_before = Pt(before)
    para.paragraph_format.space_after  = Pt(after)

def para_shade(para, hex6):
    pPr = para._p.get_or_add_pPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'),   'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'),  hex6)
    pPr.append(shd)

def cell_shade(cell, hex6):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd  = OxmlElement('w:shd')
    shd.set(qn('w:val'),   'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'),  hex6)
    tcPr.append(shd)

def cell_no_border(cell):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcB  = OxmlElement('w:tcBorders')
    for side in ['top','left','bottom','right','insideH','insideV']:
        el = OxmlElement(f'w:{side}')
        el.set(qn('w:val'),   'none')
        el.set(qn('w:sz'),    '0')
        el.set(qn('w:color'), 'auto')
        tcB.append(el)
    tcPr.append(tcB)

def cell_border(cell, sides, color='80CC00', sz=12):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcB  = OxmlElement('w:tcBorders')
    for side in ['top','left','bottom','right','insideH','insideV']:
        el = OxmlElement(f'w:{side}')
        if side in sides:
            el.set(qn('w:val'),   'single')
            el.set(qn('w:sz'),    str(sz))
            el.set(qn('w:color'), color)
        else:
            el.set(qn('w:val'),   'none')
            el.set(qn('w:sz'),    '0')
            el.set(qn('w:color'), 'auto')
        tcB.append(el)
    tcPr.append(tcB)

def add_heading(doc, text, level=1):
    p = doc.add_paragraph()
    no_space(p, before=14 if level==1 else 8, after=4)
    r = p.add_run(text)
    if level == 1:
        set_font(r, size=14, bold=True, color=DARK)
        pPr  = p._p.get_or_add_pPr()
        pBdr = OxmlElement('w:pBdr')
        bot  = OxmlElement('w:bottom')
        bot.set(qn('w:val'),   'single')
        bot.set(qn('w:sz'),    '10')
        bot.set(qn('w:color'), '80CC00')
        pBdr.append(bot)
        pPr.append(pBdr)
    else:
        set_font(r, size=11.5, bold=True, color=LIME)

def add_body(doc, text, indent=False, color=None, size=10.5, italic=False, before=0, after=3):
    p = doc.add_paragraph()
    no_space(p, before=before, after=after)
    if indent: p.paragraph_format.left_indent = Inches(0.2)
    r = p.add_run(text)
    set_font(r, size=size, color=color or LGRAY, italic=italic)
    return p

def add_bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    no_space(p, after=2)
    p.paragraph_format.left_indent = Inches(0.2)
    if bold_prefix:
        rb = p.add_run(bold_prefix + '  ')
        set_font(rb, size=10.5, bold=True, color=DARK)
    r = p.add_run(text)
    set_font(r, size=10.5, color=LGRAY)

def add_table(doc, headers, rows, col_widths=None, hbg='1C1C1C'):
    tbl = doc.add_table(rows=1+len(rows), cols=len(headers))
    tbl.style = 'Table Grid'
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hrow = tbl.rows[0]
    for i,h in enumerate(headers):
        c = hrow.cells[i]
        cell_shade(c, hbg)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        no_space(p, before=3, after=3)
        r = p.add_run(h)
        set_font(r, size=10, bold=True, color=WHITE)
    for ri, row_data in enumerate(rows):
        row = tbl.rows[ri+1]
        bg  = 'F5F5F5' if ri%2==0 else 'FFFFFF'
        for ci, val in enumerate(row_data):
            c = row.cells[ci]
            cell_shade(c, bg)
            p = c.paragraphs[0]
            no_space(p, before=2, after=2)
            r = p.add_run(val)
            set_font(r, size=10, bold=(ci==0), color=DARK if ci==0 else LGRAY)
    if col_widths:
        for row2 in tbl.rows:
            for ci2, cell2 in enumerate(row2.cells):
                cell2.width = Inches(col_widths[ci2])
    no_space(doc.add_paragraph(), after=4)
    return tbl

def lime_box(doc, title, lines):
    p0 = doc.add_paragraph()
    no_space(p0, before=8, after=0)
    para_shade(p0, '80CC00')
    r0 = p0.add_run(f'  {title}')
    set_font(r0, size=10.5, bold=True, color=WHITE)
    for line in lines:
        p = doc.add_paragraph()
        no_space(p, after=1)
        p.paragraph_format.left_indent = Inches(0.1)
        para_shade(p, 'F0FFCC')
        r = p.add_run(f'  {line}')
        set_font(r, size=10, color=DARK)
    no_space(doc.add_paragraph(), after=6)

def dark_box(doc, text, before=6, after=8):
    p = doc.add_paragraph()
    no_space(p, before=before, after=after)
    p.paragraph_format.left_indent = Inches(0.1)
    para_shade(p, '1C1C1C')
    r = p.add_run(f'  {text}')
    set_font(r, size=10.5, color=WHITE, italic=True)

# ── Step header ───────────────────────────────────────────────────────────────
def step_header(doc, tag, title, rationale):
    ph = doc.add_paragraph()
    no_space(ph, before=10, after=0)
    para_shade(ph, '1C1C1C')
    rt = ph.add_run(f'  {tag}')
    set_font(rt, size=9, bold=True, color=MGRAY)
    pt = doc.add_paragraph()
    no_space(pt, after=2)
    para_shade(pt, '80CC00')
    rtt = pt.add_run(f'  {title}')
    set_font(rtt, size=11.5, bold=True, color=WHITE)
    pr = doc.add_paragraph()
    no_space(pr, after=4)
    pr.paragraph_format.left_indent = Inches(0.1)
    para_shade(pr, 'F0FFCC')
    rr = pr.add_run(f'  ¿Por qué? {rationale}')
    set_font(rr, size=9.5, color=DARK, italic=True)

# ══════════════════════════════════════════════════════════════════════════════
# TIMELINE helper — horizontal 4-node visual
# ══════════════════════════════════════════════════════════════════════════════
def add_timeline(doc, nodes):
    """
    nodes = list of (week_label, title, bullets_list)
    Creates a 2-row table: top row = timeline bar, bottom row = content boxes
    Layout: [node | gap | node | gap | node | gap | node]
             7 columns total
    """
    n = len(nodes)
    cols = n * 2 - 1   # nodes + gaps between them

    # ── Row 1: visual bar ────────────────────────────────────────────────────
    bar = doc.add_table(rows=1, cols=cols)
    bar.style     = 'Table Grid'
    bar.alignment = WD_TABLE_ALIGNMENT.CENTER
    bar_row = bar.rows[0]

    TOTAL_W = 6.8   # inches
    node_w  = 0.72
    gap_w   = (TOTAL_W - n * node_w) / (n - 1)

    for i in range(cols):
        c = bar_row.cells[i]
        is_node = (i % 2 == 0)
        node_idx = i // 2

        cell_no_border(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        no_space(p, before=3, after=3)

        if is_node:
            cell_shade(c, '80CC00')
            c.width = Inches(node_w)
            # Week badge
            r_wk = p.add_run(nodes[node_idx][0])   # e.g. "S0"
            set_font(r_wk, size=14, bold=True, color=WHITE)
        else:
            # Connector: dark bg with a horizontal line in the middle
            cell_shade(c, '1C1C1C')
            c.width = Inches(gap_w)
            r_gap = p.add_run('─' * 6)
            set_font(r_gap, size=10, color=MGRAY)

    no_space(doc.add_paragraph(), after=0)

    # ── Row 2: content boxes ─────────────────────────────────────────────────
    content = doc.add_table(rows=1, cols=n)
    content.style     = 'Table Grid'
    content.alignment = WD_TABLE_ALIGNMENT.CENTER
    content_row = content.rows[0]

    for i, (wk, title, bullets) in enumerate(nodes):
        c = content_row.cells[i]
        cell_shade(c, 'F9F9F9' if i % 2 == 0 else 'FFFFFF')
        cell_border(c, ['top'], color='80CC00', sz=10)
        c.width = Inches(TOTAL_W / n)
        c.vertical_alignment = WD_ALIGN_VERTICAL.TOP

        # Title
        p_title = c.paragraphs[0]
        no_space(p_title, before=4, after=2)
        p_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r_t = p_title.add_run(title)
        set_font(r_t, size=10, bold=True, color=DARK)

        # Bullets
        for b in bullets:
            p_b = c.add_paragraph()
            no_space(p_b, after=2)
            p_b.paragraph_format.left_indent = Inches(0.1)
            r_b = p_b.add_run('▸  ' + b)
            set_font(r_b, size=8.8, color=LGRAY)

    no_space(doc.add_paragraph(), after=8)


# ══════════════════════════════════════════════════════════════════════════════
# COVER
# ══════════════════════════════════════════════════════════════════════════════
for text, shade, sz, bold, col in [
    ('  Super de Alimentos  ·  Trade Marketing  ·  Ecuador 🇪🇨',
     '1C1C1C', 9, False, MGRAY),
    ('  🌟  OFERTA DE CODIFICACIÓN', '1C1C1C', 22, True, WHITE),
    ('  Trululu Nanos — Edición Estelar', '1C1C1C', 14, False,
     RGBColor(0xAA, 0xFF, 0x00)),
    ('  Estrategia para el Gerente de Trade Marketing  ·  Mayo 2026',
     '80CC00', 9.5, False, WHITE),
]:
    p = doc.add_paragraph()
    no_space(p, after=2)
    para_shade(p, shade)
    r = p.add_run(text)
    set_font(r, size=sz, bold=bold, color=col)

no_space(doc.add_paragraph(), after=4)


# ══════════════════════════════════════════════════════════════════════════════
# 1. LECTURA ESTRATÉGICA
# ══════════════════════════════════════════════════════════════════════════════
add_heading(doc, '1. Lectura Estratégica del Contexto')

add_body(doc,
    'El contexto entrega tres ventajas que deben orientar cada decisión antes de '
    'construir la oferta:')

add_table(doc,
    ['Dato del contexto', 'Implicación táctica'],
    [
        ('Trululu lidera el TOM de la categoría',
         'No hay que vender la marca — ya está instalada en el consumidor. '
         'La tarea es reducir la barrera de entrada a la nueva referencia.'),
        ('80 % del volumen pasa por mayoristas',
         'El mayorista es donde el tendero compra. Activar ahí genera demanda pull '
         'antes de que el vendedor llegue a la puerta de la tienda.'),
        ('Un único distribuidor con 785 vendedores cubre el T2T',
         'El distribuidor es el canal de llegada. Si sus vendedores no están convencidos '
         'y equipados, Edición Estelar no llega a la tienda.'),
    ],
    col_widths=[2.5, 4.3])

# ── Argumento ancla reescrito ──────────────────────────────────────────────────
add_heading(doc, 'El argumento que convence al tendero', level=2)

add_body(doc,
    'La mayoría de los argumentos de lanzamiento le hablan al tendero del producto. '
    'Este le habla de su negocio:')

dark_box(doc,
    '"Tus clientes ya piden Trululu — Edición Estelar solo hay que ponerla donde la vean. '
    'No te pido que la vendas: te pido que la pongas. '
    'Con 48 unidades y la bonificación incluida, recuperas tu inversión antes de que se '
    'acabe la semana. Y el que no la tenga... le regala la venta al de enfrente."',
    before=4, after=6)

add_body(doc,
    '▸  La clave del argumento es el riesgo de oportunidad, no el beneficio del producto. '
    'Al tendero le duele más perder una venta que ganar un bono.',
    indent=True, color=DARK, size=10, italic=True)


# ══════════════════════════════════════════════════════════════════════════════
# 2. CONFIGURACIÓN DE LA OFERTA
# ══════════════════════════════════════════════════════════════════════════════
add_heading(doc, '2. Configuración de la Oferta al Tendero')

add_body(doc,
    'La oferta opera en tres pilares encadenados: el primero elimina el miedo a codificar, '
    'el segundo hace que la primera compra sea inmediatamente rentable, '
    'y el tercero convierte esa compra en reposición automática.')

add_heading(doc, 'Pilar 1 — Entrada fácil', level=2)
add_table(doc,
    ['Elemento', 'Detalle'],
    [
        ('Pack mínimo',          '2 displays × 24 und = 48 unidades'),
        ('Precio de lanzamiento','12 % de descuento vs lista — solo primera compra'),
        ('Exhibidor gratis',     'Para los primeros 200 tenderos en codificar'),
    ], col_widths=[2.5, 4.3])

add_heading(doc, 'Pilar 2 — Beneficio inmediato', level=2)
add_table(doc,
    ['Elemento', 'Detalle'],
    [
        ('Bonificación 1×12',    'Por 48 und compradas → 4 und gratis'),
        ('Sticker de fachada',   '"Punto Oficial Edición Estelar" — genera orgullo y atrae al consumidor'),
        ('Sorteo mensual',       'El mejor codificador del mes gana una tablet o televisor'),
    ], col_widths=[2.5, 4.3])

add_heading(doc, 'Pilar 3 — Acelerador de recompra', level=2)
add_table(doc,
    ['Elemento', 'Detalle'],
    [
        ('Reposición antes de 15 días', '+ 5 % de descuento adicional en segunda compra'),
        ('Programa Estrella Constante', '3 compras consecutivas = POP con el nombre del negocio'),
    ], col_widths=[2.5, 4.3])

lime_box(doc, 'RESUMEN DE LA OFERTA',
    ['Entrada:   48 und + 12 % dcto + exhibidor gratis (primeros 200)',
     'Beneficio: bonificación 1×12 + sticker de fachada + sorteo mensual',
     'Recompra:  + 5 % dcto en reposición < 15 días  |  POP personalizado a 3 compras'])


# ══════════════════════════════════════════════════════════════════════════════
# 3. TIMELINE DE LANZAMIENTO
# ══════════════════════════════════════════════════════════════════════════════
add_heading(doc, '3. Timeline de Lanzamiento — 4 Semanas')

add_body(doc,
    'La estrategia opera en cascada desde la cúpula del distribuidor hasta cada tienda. '
    'Cada semana tiene un foco único y no avanza hasta que el anterior esté cerrado:')

no_space(doc.add_paragraph(), after=4)

add_timeline(doc, [
    ('S0',
     'Activación del distribuidor',
     [
         'Reunión con Gerencia y Jefatura de Ventas',
         'Presentar oferta + margen tendero + bono vendedor',
         'Acordar metas de codificación por zona',
         'Entregar kit de lanzamiento al distribuidor',
     ]),
    ('S1',
     'Capacitación + kits a vendedores',
     [
         'Grupos de ~100 vendedores por zona (30 min)',
         'Entregar kit: muestra + flyer A6 + QR video',
         'Comunicar bono escalonado individual',
         'Activar ranking en WhatsApp del grupo',
     ]),
    ('S2–S3',
     'Ejecución activa en campo',
     [
         'Dashboard semanal compartido con distribuidor',
         'Ranking visible para todos los vendedores',
         'Ejecutivo Ecuador: 2 seguimientos/semana',
         'Mercaderistas apoyan instalación de exhibidores',
     ]),
    ('S4',
     'Cierre y reconocimiento',
     [
         'Entrega de bonos a ganadores',
         'Reconocimiento Top 10 en video / reunión grupal',
         'Corte de codificaciones y cálculo de KPIs',
         'Decisión de extensión del plan mes 2',
     ]),
])


# ══════════════════════════════════════════════════════════════════════════════
# 4. BONO ESCALONADO DEL VENDEDOR
# ══════════════════════════════════════════════════════════════════════════════
add_heading(doc, '4. Bono Escalonado del Vendedor del Distribuidor')

add_body(doc,
    'El vendedor necesita un interés propio para esforzarse más allá de su cuota habitual. '
    'El escalamiento es intencional: quien llega al nivel 1 tiene incentivo para alcanzar el 2.')

add_table(doc,
    ['Nivel', 'Tiendas codificadas en 4 semanas', 'Beneficio'],
    [
        ('Nivel 1  —  Bronce', '10 – 19 tiendas nuevas', 'Bono económico base'),
        ('Nivel 2  —  Plata',  '20 – 34 tiendas nuevas', 'Bono aumentado + reconocimiento en grupo'),
        ('Nivel 3  —  Oro',    '35+ tiendas nuevas',      'Bono máximo + mención pública con el equipo Super'),
    ],
    col_widths=[1.8, 2.6, 2.4], hbg='80CC00')


# ══════════════════════════════════════════════════════════════════════════════
# 5. KPIs — REESCRITOS
# ══════════════════════════════════════════════════════════════════════════════
add_heading(doc, '5. Indicadores de Éxito')

add_body(doc,
    'Los KPIs están anclados al universo real del distribuidor. Con 785 vendedores '
    'cubriendo un promedio estimado de 40 tiendas/ruta, el universo potencial supera '
    'las 30.000 tiendas. La meta del plan para la semana 4 es conservadora pero exigente:')

add_table(doc,
    ['Indicador', 'Línea base', 'Meta S4', 'Fuente de verificación'],
    [
        ('Tiendas con Edición Estelar codificada',
         '0 tiendas',
         '≥ 30 % del universo por zona activa',
         'BBDD del distribuidor cruzada con facturas Super'),
        ('Vendedores activos en la campaña',
         'No aplica',
         '≥ 75 % de los 785',
         'Reporte semanal del distribuidor'),
        ('Tenderos con reposición antes de día 15',
         'No aplica',
         '≥ 25 % de quienes codificaron',
         'Segunda orden registrada en distribuidor'),
        ('Exhibidores instalados',
         '0',
         '200 (límite del incentivo)',
         'Foto + registro mercaderista'),
        ('Cobertura total acumulada',
         'Línea base actual del distribuidor',
         'Avance ≥ 5 pp sobre cobertura previa',
         'Informe mensual de cobertura'),
    ],
    col_widths=[2.2, 1.2, 1.6, 1.85], hbg='1C1C1C')

add_body(doc,
    '▸  Los KPIs se revisan semanalmente — no al final. Un indicador que no mejora en S2 '
    'activa un plan de refuerzo inmediato (refuerzo de argumentario o incremento temporal del bono).',
    indent=True, color=DARK, size=10, italic=True)


# ══════════════════════════════════════════════════════════════════════════════
# 6. RESUMEN
# ══════════════════════════════════════════════════════════════════════════════
add_heading(doc, '6. Resumen Ejecutivo')

lime_box(doc, 'LA OFERTA EN UNA LÍNEA',
    ['Entrada fácil (48 und + 12 % dcto + exhibidor)  →  beneficio inmediato (1×12 + sticker + sorteo)',
     'Recompra acelerada (5 % dcto < 15 días)  →  fidelización (Estrella Constante a 3 compras)'])

lime_box(doc, 'LA LLEGADA A 785 VENDEDORES',
    ['S0: Cúpula convencida con kit + metas acordadas por zona',
     'S1: Capacitación grupal (30 min) + kit individual + bono escalonado activado',
     'S2–S3: Dashboard semanal + ranking WhatsApp + seguimiento ejecutivo 2×/semana',
     'S4: Entrega de bonos + reconocimiento Top 10 + decisión de extensión mes 2'])

dark_box(doc,
    'La ventaja más grande de esta campaña es que el trabajo de construcción de marca '
    'ya está hecho. El único trabajo pendiente es que ninguna tienda quede sin la '
    'Edición Estelar por falta de visita, argumento o disposición del vendedor.',
    before=4, after=6)

# Footer
p_foot = doc.add_paragraph()
no_space(p_foot, before=14)
r_foot = p_foot.add_run(
    'Super de Alimentos  ·  Assessment Analista Trade Marketing  ·  Mariana Montejo  ·  Mayo 2026')
set_font(r_foot, size=8.5, color=MGRAY, italic=True)
p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER

# ── Save ──────────────────────────────────────────────────────────────────────
out = '/home/user/ULTRA-/Caso3_Oferta_Edicion_Estelar_v2.docx'
doc.save(out)
print(f'✅  {out}')
