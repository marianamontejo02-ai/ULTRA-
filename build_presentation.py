from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import pptx.oxml.ns as nsmap
from lxml import etree
import copy

# ── Brand palette ──────────────────────────────────────────────────────────────
SUPER_RED    = RGBColor(0xC0, 0x00, 0x20)   # deep red
SUPER_YELLOW = RGBColor(0xFF, 0xD7, 0x00)   # Trululu yellow
DARK_BG      = RGBColor(0x1A, 0x1A, 0x2E)   # dark navy
MID_BG       = RGBColor(0x16, 0x21, 0x3E)   # mid navy
ACCENT       = RGBColor(0xE9, 0x4F, 0x37)   # vivid orange-red
WHITE        = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GREY   = RGBColor(0xF2, 0xF2, 0xF2)
TEAL         = RGBColor(0x00, 0xB4, 0xD8)
GREEN        = RGBColor(0x06, 0xD6, 0xA0)
GOLD         = RGBColor(0xFF, 0xC3, 0x00)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

def blank_layout(prs):
    return prs.slide_layouts[6]   # completely blank

# ── Helper utilities ───────────────────────────────────────────────────────────

def fill_shape(shape, color):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color

def add_rect(slide, left, top, width, height, color, transparency=0):
    shape = slide.shapes.add_shape(1, Inches(left), Inches(top),
                                   Inches(width), Inches(height))
    shape.line.fill.background()
    fill_shape(shape, color)
    if transparency:
        shape.fill.fore_color._element.getparent().find(
            nsmap.qn('a:solidFill')).find(
            nsmap.qn('a:sRgbClr')).set('lastClr', f'{color.rgb}')
    return shape

def add_text(slide, text, left, top, width, height,
             font_size=18, bold=False, color=WHITE,
             align=PP_ALIGN.LEFT, italic=False, wrap=True):
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top),
                                     Inches(width), Inches(height))
    txBox.text_frame.word_wrap = wrap
    p = txBox.text_frame.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(font_size)
    run.font.bold  = bold
    run.font.color.rgb = color
    run.font.italic = italic
    return txBox

def add_rich_text(slide, lines, left, top, width, height,
                  default_size=14, default_color=WHITE):
    """lines = list of (text, size, bold, color, align)"""
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top),
                                     Inches(width), Inches(height))
    tf = txBox.text_frame
    tf.word_wrap = True
    first = True
    for (text, size, bold, color, align) in lines:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = text
        run.font.size  = Pt(size)
        run.font.bold  = bold
        run.font.color.rgb = color
    return txBox

def add_bullet_box(slide, title, bullets, left, top, width, height,
                   title_color=GOLD, bullet_color=WHITE,
                   bg_color=MID_BG, title_size=14, bullet_size=11.5):
    box = add_rect(slide, left, top, width, height, bg_color)
    # rounded corners via xml
    sp = box._element
    prstGeom = sp.find('.//' + nsmap.qn('a:prstGeom'))
    if prstGeom is not None:
        prstGeom.set('prst', 'roundRect')

    txBox = slide.shapes.add_textbox(Inches(left+0.15), Inches(top+0.12),
                                     Inches(width-0.3), Inches(height-0.25))
    tf = txBox.text_frame
    tf.word_wrap = True

    # title
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = title
    r0.font.size  = Pt(title_size)
    r0.font.bold  = True
    r0.font.color.rgb = title_color

    for b in bullets:
        p = tf.add_paragraph()
        r = p.add_run()
        r.text = "▸  " + b
        r.font.size  = Pt(bullet_size)
        r.font.color.rgb = bullet_color

def add_step_box(slide, number, title, description,
                 left, top, width, height,
                 num_color=GOLD, bg=MID_BG):
    add_rect(slide, left, top, width, height, bg)

    # number badge
    badge = add_rect(slide, left+0.08, top+0.08, 0.38, 0.38, SUPER_RED)
    add_text(slide, str(number), left+0.08, top+0.06, 0.38, 0.38,
             font_size=16, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

    # title
    add_text(slide, title, left+0.52, top+0.08, width-0.65, 0.38,
             font_size=12, bold=True, color=GOLD, align=PP_ALIGN.LEFT)

    # desc
    txBox = slide.shapes.add_textbox(Inches(left+0.12), Inches(top+0.52),
                                     Inches(width-0.25), Inches(height-0.6))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = description
    r.font.size = Pt(10)
    r.font.color.rgb = LIGHT_GREY

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 1 – PORTADA
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))

# Full dark background
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)

# Top accent bar
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)

# Red diagonal accent
shape = slide.shapes.add_shape(1, Inches(8.5), Inches(0), Inches(5), Inches(7.5))
fill_shape(shape, SUPER_RED)
shape.line.fill.background()
sp = shape._element
spPr = sp.find(nsmap.qn('p:spPr'))
prstGeom = etree.SubElement(spPr, nsmap.qn('a:prstGeom'))
# Use a parallelogram via custom geometry isn't easy in pptx, so let's just
# add a decorative bar on the right
shape2 = add_rect(slide, 9.8, 0, 0.08, 7.5, SUPER_YELLOW)
shape3 = add_rect(slide, 10.5, 0, 3.83, 7.5, MID_BG)

# Company tag
add_text(slide, "SUPER DE ALIMENTOS", 0.5, 0.3, 5, 0.5,
         font_size=11, bold=False, color=SUPER_YELLOW, italic=True)

# Main title
add_text(slide, "ASSESSMENT", 0.5, 1.1, 9, 1.0,
         font_size=52, bold=True, color=WHITE)
add_text(slide, "ANALISTA TRADE MARKETING", 0.5, 2.05, 9.5, 0.8,
         font_size=28, bold=True, color=SUPER_YELLOW)

# Subtitle line
add_rect(slide, 0.5, 2.9, 6, 0.05, SUPER_RED)

# Description
add_text(slide, "Estrategia & Ejecución: Ecuador  |  Honduras", 0.5, 3.05, 8, 0.5,
         font_size=16, bold=False, color=LIGHT_GREY)

# Cases summary on the right panel
add_text(slide, "CONTENIDO", 10.7, 1.0, 2.3, 0.4,
         font_size=12, bold=True, color=SUPER_YELLOW, align=PP_ALIGN.CENTER)
cases = [
    ("01", "Branding en Mayoristas\nEcuador"),
    ("02", "Plan de Incentivos\nHonduras"),
    ("03", "Oferta Edición Estelar\nEcuador"),
]
for i,(num,txt) in enumerate(cases):
    y = 1.6 + i*1.6
    add_rect(slide, 10.55, y, 2.55, 1.3, RGBColor(0x22, 0x2D, 0x4E))
    add_text(slide, num, 10.65, y+0.1, 0.6, 0.6,
             font_size=28, bold=True, color=SUPER_RED, align=PP_ALIGN.CENTER)
    add_text(slide, txt, 11.25, y+0.15, 1.75, 0.9,
             font_size=10.5, bold=False, color=WHITE)

# Bottom bar
add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Mayo 2026  |  Candidata: Mariana Montejo", 0.5, 7.2, 7, 0.3,
         font_size=9, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 2 – CONTEXTO RÁPIDO
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)

add_text(slide, "CONTEXTO DE MERCADO", 0.5, 0.25, 12, 0.6,
         font_size=26, bold=True, color=WHITE)
add_rect(slide, 0.5, 0.85, 12.3, 0.04, SUPER_YELLOW)

# Ecuador column
add_rect(slide, 0.4, 1.05, 5.8, 5.9, MID_BG)
add_rect(slide, 0.4, 1.05, 5.8, 0.45, SUPER_RED)
add_text(slide, "🇪🇨  ECUADOR", 0.6, 1.08, 5.4, 0.4,
         font_size=15, bold=True, color=WHITE)

ec_items = [
    ("ESTRUCTURA", ["1 Gerente · 1 Ejecutivo · 1 Formador", "15 Mercaderistas (ciudades principales)", "Dirección: Quito"]),
    ("MERCADO", ["Trululu lidera TOM de categoría", "80% del volumen en mayoristas", "Bianchi, OkaLoka y Next son top SKU"]),
    ("TRADE ACTUAL", ["Plan de incentivos con distribuidor único", "Por venta neta x vendedor O", "Por ubicación de exhibidores Trululu", "Branding de avisos en mayoristas (galerías)"]),
]
y = 1.65
for (section, items) in ec_items:
    add_text(slide, section, 0.65, y, 5.3, 0.3,
             font_size=10, bold=True, color=GOLD)
    y += 0.3
    for item in items:
        add_text(slide, "▸  " + item, 0.75, y, 5.1, 0.28,
                 font_size=9.5, color=LIGHT_GREY)
        y += 0.27
    y += 0.12

# Honduras column
add_rect(slide, 7.0, 1.05, 5.8, 5.9, MID_BG)
add_rect(slide, 7.0, 1.05, 5.8, 0.45, RGBColor(0x00, 0x5B, 0xAA))
add_text(slide, "🇭🇳  HONDURAS", 7.2, 1.08, 5.4, 0.4,
         font_size=15, bold=True, color=WHITE)

hn_items = [
    ("ESTRUCTURA", ["1 Gerente (Colombia)", "2 Ejecutivos (SPS y Tegucigalpa)", "7 Mercaderistas"]),
    ("MERCADO", ["Gran cantidad de distribuidores T2T", "Múltiples BBDD en esquemas propios", "Trululu Nanos: SKU ancla del plan"]),
    ("TRADE ACTUAL", ["Incentivos: 100% cobertura de tiendas", "Con venta de Trululu Nanos", "Mercaderistas en mayoristas clave", "Degustaciones y combos de volumen", "Descuento 10% por compra mín. 400 L"]),
]
y = 1.65
for (section, items) in hn_items:
    add_text(slide, section, 7.25, y, 5.3, 0.3,
             font_size=10, bold=True, color=GOLD)
    y += 0.3
    for item in items:
        add_text(slide, "▸  " + item, 7.35, y, 5.3, 0.28,
                 font_size=9.5, color=LIGHT_GREY)
        y += 0.27
    y += 0.12

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 3 – CASO 1 TITLE
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)

# Big case number
add_rect(slide, 0.5, 0.8, 2.2, 2.2, SUPER_RED)
add_text(slide, "01", 0.5, 0.85, 2.2, 2.1,
         font_size=80, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

add_text(slide, "CASO", 2.9, 0.9, 5, 0.5,
         font_size=14, bold=False, color=SUPER_YELLOW, italic=True)
add_text(slide, "BRANDING EN MAYORISTAS", 2.9, 1.35, 10, 0.8,
         font_size=36, bold=True, color=WHITE)
add_text(slide, "ECUADOR  🇪🇨", 2.9, 2.15, 9, 0.55,
         font_size=22, bold=True, color=SUPER_YELLOW)

add_rect(slide, 2.9, 2.8, 9.8, 0.05, SUPER_RED)

add_text(slide,
    "Desarrollar un plan de branding en avisos de mayoristas,\n"
    "conseguir mínimo 2 espacios adicionales para Trululu Nanos\n"
    "y coordinar con el equipo de diseño preservando la identidad del cliente.",
    2.9, 2.95, 9.8, 1.2,
    font_size=14, color=LIGHT_GREY)

# 4 pillars
pillars = [
    ("🔍", "Diagnóstico"),
    ("🤝", "Negociación"),
    ("🎨", "Diseño"),
    ("📊", "Seguimiento"),
]
for i,(icon,txt) in enumerate(pillars):
    x = 2.9 + i*2.5
    add_rect(slide, x, 4.5, 2.2, 1.2, MID_BG)
    add_text(slide, icon, x, 4.55, 2.2, 0.55,
             font_size=28, align=PP_ALIGN.CENTER, color=WHITE)
    add_text(slide, txt, x, 5.1, 2.2, 0.45,
             font_size=11, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 4 – CASO 1 | PASO A PASO
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, SUPER_RED)

add_text(slide, "CASO 01  |  PASOS DE EJECUCIÓN DEL PLAN", 0.4, 0.2, 12, 0.5,
         font_size=18, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

steps = [
    (1, "DIAGNÓSTICO Y MAPEO DE MAYORISTAS",
     "Levantar inventario de galerías/mayoristas por ciudad. Identificar los 5-8 clientes de mayor volumen de compra de Super de Alimentos. Fotografiar avisos actuales, zonas de tráfico y espacios disponibles. Clasificar por potencial de visibilidad (A/B/C)."),
    (2, "DEFINICIÓN DEL PLAN DE ESPACIOS",
     "Establecer con el equipo comercial (Ejecutivo + Gerente Ecuador) los espacios prioritarios por cliente: (1) aviso principal del negocio + co-branding Trululu, (2) mínimo 2 puntos adicionales para Trululu Nanos (cabecera góndola, área de caja, isla central o vitrina exterior)."),
    (3, "ABORDAJE Y NEGOCIACIÓN CON EL CLIENTE",
     "El ejecutivo comercial agenda reunión con el dueño/administrador de cada mayorista. Se presenta propuesta de valor: 'Nosotros ponemos el material y el costo de instalación, usted gana visibilidad premium en su negocio'. Se firma acuerdo de ubicación y tiempos (carta de autorización)."),
    (4, "BRIEFING AL EQUIPO DE DISEÑO Y PRODUCCIÓN",
     "Enviar ficha técnica por cliente: medidas exactas, material (vinilo/lona/acrílico), condición del soporte y restricciones del cliente. El diseño propone 2 opciones de artes para aprobación del cliente antes de producir."),
    (5, "INSTALACIÓN Y REGISTRO",
     "Instalación coordinada con mercaderistas + empresa de instalación externa según complejidad. Registro fotográfico con georreferenciación (antes/después). Acta de recepción firmada por el cliente con compromisos de preservación."),
    (6, "AUDITORÍA Y PRESERVACIÓN",
     "Revisión mensual por mercaderistas con checklist fotográfico (estado del material, limpieza, visibilidad no obstruida). Reposición inmediata si el material está dañado. KPI: % de puntos en óptimas condiciones vs total instalado."),
]

cols = [
    [steps[0], steps[2], steps[4]],
    [steps[1], steps[3], steps[5]],
]
for col_i, col in enumerate(cols):
    for row_i, (num, title, desc) in enumerate(col):
        x = 0.4 + col_i*6.6
        y = 0.85 + row_i*2.08
        add_step_box(slide, num, title, desc, x, y, 6.3, 1.95)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 5 – CASO 1 | ÁREAS & DIRECCIONAMIENTO DISEÑO
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, SUPER_RED)

add_text(slide, "CASO 01  |  ÁREAS INVOLUCRADAS & BRIEF AL DISEÑO", 0.4, 0.2, 12, 0.5,
         font_size=18, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

# Left: Areas
add_rect(slide, 0.4, 0.88, 5.8, 0.38, SUPER_RED)
add_text(slide, "ÁREAS A CONTACTAR", 0.5, 0.88, 5.6, 0.38,
         font_size=13, bold=True, color=WHITE)

areas = [
    ("🏢 GERENCIA COMERCIAL ECUADOR", "Alinear selección de clientes prioritarios y carta de autorización corporativa."),
    ("👔 EJECUTIVO COMERCIAL", "Liderar negociación directa con cada mayorista, gestionar permisos y acuerdos."),
    ("🎨 EQUIPO DISEÑO TRADE MKT", "Desarrollar artes bajo briefing técnico, gestionar aprobaciones y producción."),
    ("👷 MERCADERISTAS", "Apoyo en instalación, registro fotográfico mensual y reporte de estado."),
    ("🏭 PROVEEDOR POP / INSTALADOR", "Producción de materiales (vinilo, lona, señalética) e instalación especializada."),
    ("📊 TRADE MARKETING REGIONAL", "Alineación de lineamientos de marca, aprobación final de artes."),
]
for i,(area, desc) in enumerate(areas):
    y = 1.38 + i*0.95
    add_rect(slide, 0.4, y, 5.8, 0.85, MID_BG)
    add_text(slide, area, 0.55, y+0.05, 5.5, 0.32,
             font_size=10, bold=True, color=GOLD)
    add_text(slide, desc, 0.55, y+0.37, 5.5, 0.45,
             font_size=9, color=LIGHT_GREY)

# Right: Brief to design team
add_rect(slide, 6.6, 0.88, 6.3, 0.38, RGBColor(0x00, 0x5B, 0xAA))
add_text(slide, "DIRECCIONAMIENTO AL EQUIPO DE DISEÑO", 6.7, 0.88, 6.1, 0.38,
         font_size=13, bold=True, color=WHITE)

design_blocks = [
    ("📐 BRIEF TÉCNICO POR PUNTO", [
        "Dimensiones exactas del aviso o espacio",
        "Material soporte (pared, estructura metálica, madera)",
        "Condiciones ambientales (interior / exterior, humedad)",
        "Fotografías del espacio actual para referencia",
    ]),
    ("🎨 CONCEPTO DE CO-BRANDING", [
        "Zona A (30%): Logo e identidad del mayorista – INTOCABLE",
        "Zona B (40%): Mensaje compartido Super + Trululu Nanos",
        "Zona C (30%): Creatividad Trululu Nanos con llamada a la acción",
        "Colores Super no deben opacar los colores institucionales del cliente",
    ]),
    ("✅ FLUJO DE APROBACIÓN", [
        "Arte preliminar → Revisión interna Trade Mktg (48h)",
        "Arte aprobado → Presentación al cliente mayorista",
        "Cliente aprueba (firma) → Orden de producción",
        "Arte rechazado → Máx. 1 revisión adicional con cambios puntales",
    ]),
    ("📌 GUÍA CREATIVA IRRENUNCIABLE", [
        "Logo Trululu Nanos: tamaño mínimo 15% del área total",
        "Claim de campaña vigente siempre presente",
        "Fotografía de producto real en alta resolución",
        "No usar fondos oscuros en exterior (baja legibilidad)",
    ]),
]
y = 1.38
for (title, bullets) in design_blocks:
    add_rect(slide, 6.6, y, 6.3, 1.35, MID_BG)
    add_text(slide, title, 6.72, y+0.06, 6.0, 0.3,
             font_size=10, bold=True, color=TEAL)
    for j,b in enumerate(bullets):
        add_text(slide, "▸  "+b, 6.75, y+0.38+j*0.23, 6.0, 0.23,
                 font_size=8.5, color=LIGHT_GREY)
    y += 1.42

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 6 – CASO 2 TITLE
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)

add_rect(slide, 0.5, 0.8, 2.2, 2.2, RGBColor(0x00, 0x5B, 0xAA))
add_text(slide, "02", 0.5, 0.85, 2.2, 2.1,
         font_size=80, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

add_text(slide, "CASO", 2.9, 0.9, 5, 0.5,
         font_size=14, bold=False, color=SUPER_YELLOW, italic=True)
add_text(slide, "PLAN DE INCENTIVOS", 2.9, 1.35, 10, 0.8,
         font_size=36, bold=True, color=WHITE)
add_text(slide, "HONDURAS  🇭🇳", 2.9, 2.15, 9, 0.55,
         font_size=22, bold=True, color=SUPER_YELLOW)

add_rect(slide, 2.9, 2.8, 9.8, 0.05, RGBColor(0x00, 0x5B, 0xAA))

add_text(slide,
    "Consolidar, analizar y autorizar pagos de incentivos mensuales\n"
    "con múltiples distribuidores y bases de datos heterogéneas.\n"
    "Crear un concepto con identidad y mística para el plan.",
    2.9, 2.95, 9.8, 1.2,
    font_size=14, color=LIGHT_GREY)

pillars2 = [
    ("📥", "Consolidación"),
    ("🔍", "Validación"),
    ("💰", "Pago"),
    ("🏆", "Concepto"),
]
for i,(icon,txt) in enumerate(pillars2):
    x = 2.9 + i*2.5
    add_rect(slide, x, 4.5, 2.2, 1.2, MID_BG)
    add_text(slide, icon, x, 4.55, 2.2, 0.55,
             font_size=28, align=PP_ALIGN.CENTER, color=WHITE)
    add_text(slide, txt, x, 5.1, 2.2, 0.45,
             font_size=11, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 7 – CASO 2 | PASO A PASO CONSOLIDACIÓN
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, RGBColor(0x00, 0x5B, 0xAA))

add_text(slide, "CASO 02  |  PASO A PASO: CONSOLIDACIÓN Y AUTORIZACIÓN DE PAGOS", 0.4, 0.2, 12.5, 0.5,
         font_size=17, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

steps2 = [
    (1, "RECEPCIÓN DE BBDD DE DISTRIBUIDORES",
     "Fecha límite: día 3 del mes siguiente. Cada distribuidor envía su reporte en el formato que usa (Excel, PDF, correo). Se crea carpeta digital por distribuidor y mes. Se acusa recibo y se inicia revisión de completitud."),
    (2, "ESTANDARIZACIÓN A PLANTILLA MAESTRA",
     "Transformar cada BBDD al formato único de Super (campos mínimos requeridos). Usar Power Query o macro Excel para automatizar mapeo de columnas. Distribuidores con reporte incompleto reciben aviso formal con plazo de corrección de 24h."),
    (3, "CRUCE CON FUENTE INTERNA DE VENTAS",
     "Cruzar cobertura reportada vs facturación real de Trululu Nanos registrada en el sistema de Super por zona/ruta. Identificar discrepancias > 10% para auditoría. En caso de distribuidores con inconsistencias reiteradas: aplicar criterio de exclusión."),
    (4, "VALIDACIÓN DE EVIDENCIAS",
     "Revisar fotografías o registros GPS de visitas (si el plan las exige). Mercaderistas de campo confirman muestra de tiendas por ruta. Validación de al menos 20% de los puntos reportados por distribuidor por mes."),
    (5, "CÁLCULO DE INCENTIVOS Y PREAPROBACIÓN",
     "Aplicar fórmula: cobertura alcanzada / meta = % cumplimiento → tabla de incentivos escalonada. Trade Marketing genera informe de preaprobación con monto por vendedor. Ejecutivos comerciales revisan y firman digitalmente."),
    (6, "AUTORIZACIÓN FINAL Y PAGO",
     "Gerente Comercial Honduras + Gerente Trade Marketing autorizan. Orden de pago enviada a finanzas con respaldo documental completo. Fecha de pago: máximo día 15 del mes. Notificación individual a cada vendedor ganador."),
]

cols = [
    [steps2[0], steps2[2], steps2[4]],
    [steps2[1], steps2[3], steps2[5]],
]
for col_i, col in enumerate(cols):
    for row_i, (num, title, desc) in enumerate(col):
        x = 0.4 + col_i*6.6
        y = 0.85 + row_i*2.08
        add_step_box(slide, num, title, desc, x, y, 6.3, 1.95, bg=MID_BG)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 8 – CASO 2 | CAMPOS MÍNIMOS BBDD
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, RGBColor(0x00, 0x5B, 0xAA))

add_text(slide, "CASO 02  |  CAMPOS MÍNIMOS PARA BASE DE DATOS ÓPTIMA", 0.4, 0.2, 12.5, 0.5,
         font_size=18, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

# 3 categories of fields
categories = [
    ("👤 IDENTIFICACIÓN DEL VENDEDOR", SUPER_RED, [
        "ID / Cédula del vendedor",
        "Nombre completo",
        "Distribuidor al que pertenece",
        "Zona / Ruta asignada",
        "Teléfono de contacto",
        "Cuenta bancaria / método de pago",
    ]),
    ("📦 EJECUCIÓN EN CAMPO", TEAL, [
        "N.º de tiendas en ruta (universo)",
        "N.º de tiendas visitadas en el mes",
        "N.º de tiendas con venta de Trululu Nanos",
        "Unidades vendidas de Trululu Nanos",
        "Foto/evidencia de tiendas cubiertas",
        "Fecha de visita por tienda",
    ]),
    ("📊 CÁLCULO DE INCENTIVO", GREEN, [
        "Meta de cobertura mensual (%)",
        "% de cobertura alcanzada",
        "Monto base del incentivo (tabla)",
        "Factor de cumplimiento aplicado",
        "Monto a pagar calculado",
        "Estado: Aprobado / Rechazado / Pendiente",
    ]),
]

for i,(title, color, fields) in enumerate(categories):
    x = 0.4 + i*4.3
    add_rect(slide, x, 0.9, 4.1, 0.42, color)
    add_text(slide, title, x+0.1, 0.9, 3.9, 0.42,
             font_size=11, bold=True, color=WHITE)
    for j,f in enumerate(fields):
        y_row = 1.42 + j*0.82
        add_rect(slide, x, y_row, 4.1, 0.72,
                 MID_BG if j%2==0 else RGBColor(0x1E, 0x2D, 0x50))
        add_text(slide, f"  {j+1:02d}", x+0.05, y_row+0.12, 0.45, 0.5,
                 font_size=18, bold=True, color=color)
        add_text(slide, f, x+0.55, y_row+0.18, 3.45, 0.45,
                 font_size=10.5, color=LIGHT_GREY)

# Note at bottom
add_rect(slide, 0.4, 6.42, 12.5, 0.65, RGBColor(0x22, 0x2D, 0x4E))
add_text(slide,
    "⚠️  CRITERIO DE EXCLUSIÓN: Distribuidores con > 2 meses consecutivos de datos incompletos, inconsistencias vs facturación "
    "superior al 20%, o cobertura sostenida < 40% de la meta serán removidos del plan previa notificación formal.",
    0.55, 6.46, 12.2, 0.55,
    font_size=9.5, color=GOLD, italic=True)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 9 – CASO 2 | CONCEPTO DEL PLAN
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, RGBColor(0x00, 0x5B, 0xAA))

add_text(slide, "CASO 02  |  CONCEPTO E IDENTIDAD DEL PLAN DE INCENTIVOS", 0.4, 0.2, 12.5, 0.5,
         font_size=18, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

# Hero concept box
add_rect(slide, 0.4, 0.9, 12.5, 1.9, RGBColor(0x0A, 0x0A, 0x2A))
add_rect(slide, 0.4, 0.9, 0.12, 1.9, GOLD)

add_text(slide, "🏆", 0.7, 0.95, 1.0, 1.0, font_size=44, align=PP_ALIGN.CENTER, color=WHITE)
add_text(slide, '"REYES DE LA RUTA"', 1.75, 1.0, 7, 0.65,
         font_size=32, bold=True, color=GOLD)
add_text(slide, "Plan de Incentivos Trululu Nanos  |  Honduras", 1.75, 1.65, 8, 0.4,
         font_size=14, italic=True, color=LIGHT_GREY)
add_text(slide,
    "Cada vendedor que conquiste su ruta y lleve Trululu Nanos a más tiendas\n"
    "demuestra que es el Rey de su territorio. Los mejores son coronados cada mes.",
    1.75, 2.1, 10.8, 0.6,
    font_size=10.5, color=RGBColor(0xCC,0xCC,0xCC), italic=True)

# 4 elements of concept
concept_items = [
    ("🎯 NOMBRE DEL PLAN", GOLD,
     "\"REYES DE LA RUTA\"\nRefuerza el dominio territorial, la conquista de cobertura y el orgullo del vendedor hondureño."),
    ("👑 EVENTO MENSUAL", TEAL,
     "\"CORONACIÓN REYES DE LA RUTA\"\nReunión mensual donde se entregan bonos a ganadores. Solo los vendedores con ≥85% de cobertura acceden."),
    ("🏅 NIVELES DE RECONOCIMIENTO", GREEN,
     "🥉 Rey de Bronce (70-84%)\n🥈 Rey de Plata (85-94%)\n🥇 Rey de Oro (95-100%+)\nCada nivel tiene bono diferenciado y beneficio adicional."),
    ("📱 COMUNICACIÓN MENSUAL", SUPER_RED,
     "WhatsApp grupal por distribuidor con ranking semanal. Imagen de 'Rey del Mes' enviada a todos los vendedores. Top 3 publicados en el grupo corporativo del equipo."),
]

for i,(title, color, desc) in enumerate(concept_items):
    x = 0.4 + (i%2)*6.4
    y = 3.0 + (i//2)*2.05
    add_rect(slide, x, y, 6.1, 1.88, MID_BG)
    add_rect(slide, x, y, 6.1, 0.38, color)
    add_text(slide, title, x+0.12, y+0.04, 5.8, 0.34,
             font_size=11, bold=True, color=WHITE)
    add_text(slide, desc, x+0.15, y+0.48, 5.8, 1.3,
             font_size=9.5, color=LIGHT_GREY)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 10 – CASO 3 TITLE
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)

add_rect(slide, 0.5, 0.8, 2.2, 2.2, GREEN)
add_text(slide, "03", 0.5, 0.85, 2.2, 2.1,
         font_size=80, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

add_text(slide, "CASO", 2.9, 0.9, 5, 0.5,
         font_size=14, bold=False, color=SUPER_YELLOW, italic=True)
add_text(slide, "OFERTA DE CODIFICACIÓN", 2.9, 1.35, 10, 0.8,
         font_size=36, bold=True, color=WHITE)
add_text(slide, "TRULULU NANOS — EDICIÓN ESTELAR  🇪🇨", 2.9, 2.15, 9.8, 0.55,
         font_size=20, bold=True, color=SUPER_YELLOW)

add_rect(slide, 2.9, 2.8, 9.8, 0.05, GREEN)

add_text(slide,
    "Construir una oferta irresistible para que los tenderos de Ecuador\n"
    "codifiquen la nueva referencia, activándola a través de los 785\n"
    "vendedores del distribuidor nacional.",
    2.9, 2.95, 9.8, 1.2,
    font_size=14, color=LIGHT_GREY)

pillars3 = [
    ("🎁", "La Oferta"),
    ("📣", "Activación"),
    ("🚀", "Escalada"),
    ("📈", "KPIs"),
]
for i,(icon,txt) in enumerate(pillars3):
    x = 2.9 + i*2.5
    add_rect(slide, x, 4.5, 2.2, 1.2, MID_BG)
    add_text(slide, icon, x, 4.55, 2.2, 0.55,
             font_size=28, align=PP_ALIGN.CENTER, color=WHITE)
    add_text(slide, txt, x, 5.1, 2.2, 0.45,
             font_size=11, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 11 – CASO 3 | CONFIGURACIÓN DE LA OFERTA
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, GREEN)

add_text(slide, "CASO 03  |  CONFIGURACIÓN DE LA OFERTA", 0.4, 0.2, 12.5, 0.5,
         font_size=18, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

# Offer architecture
add_rect(slide, 0.4, 0.9, 12.5, 0.38, RGBColor(0x06, 0x3A, 0x1F))
add_text(slide,
    "🌟  OFERTA DE LANZAMIENTO:  \"CODIFICA LA ESTRELLA\"  —  Edición Estelar Trululu Nanos",
    0.55, 0.91, 12.0, 0.35,
    font_size=13, bold=True, color=GOLD)

# 3 offer pillars
offer_blocks = [
    ("🎯 PEDIDO MÍNIMO DE CODIFICACIÓN", GREEN, [
        "Pack de entrada: 2 display × 24 und = 48 unidades",
        "Precio especial de lanzamiento: 12% dcto vs precio regular",
        "Válido solo para primera compra de la referencia nueva",
        "Sin costo de exhibidor de sobremesa para los primeros 200 tenderos",
    ]),
    ("🎁 BENEFICIO DIRECTO AL TENDERO", TEAL, [
        "Por cada 48 und compradas → 4 und GRATIS (bonificación 1×12)",
        "Sticker de 'Punto de Venta Oficial Edición Estelar' para vitrina",
        "Entrada al sorteo mensual: tablet o televisor para el mejor codificador",
        "Acceso a combos promocionales exclusivos del mes de lanzamiento",
    ]),
    ("🚀 ACELERADOR DE RECOMPRA", GOLD, [
        "Si el tendero repone antes de 15 días: 5% dcto adicional",
        "Si mantiene exhibición activa al mes siguiente: bono en producto",
        "Programa 'Estrella Constante': tendero con 3 compras seguidas",
        "recibe material POP personalizado con nombre de su negocio",
    ]),
]

for i,(title, color, bullets) in enumerate(offer_blocks):
    x = 0.4 + i*4.3
    y = 1.42
    add_rect(slide, x, y, 4.1, 0.38, color)
    add_text(slide, title, x+0.1, y+0.03, 3.9, 0.34,
             font_size=10.5, bold=True, color=WHITE)
    for j,b in enumerate(bullets):
        yr = y + 0.48 + j*0.68
        add_rect(slide, x, yr, 4.1, 0.6,
                 MID_BG if j%2==0 else RGBColor(0x1E, 0x2D, 0x50))
        add_text(slide, "▸  "+b, x+0.12, yr+0.06, 3.85, 0.5,
                 font_size=9, color=LIGHT_GREY)

# Closing argument box
add_rect(slide, 0.4, 6.3, 12.5, 0.75, RGBColor(0x03, 0x1D, 0x10))
add_rect(slide, 0.4, 6.3, 0.1, 0.75, GREEN)
add_text(slide,
    "💡  ARGUMENTO ANCLA PARA EL TENDERO: \"Edición Estelar es la versión más especial de Trululu Nanos del año. "
    "Tus clientes ya conocen Trululu — esta referencia nueva viene con más sabor y empaque coleccionable. "
    "Si la tienes, ellos la compran. Si no la tienes, van a otra tienda.\"",
    0.6, 6.34, 12.1, 0.65,
    font_size=9.5, color=GREEN, italic=True)

add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 12 – CASO 3 | ESTRATEGIA 785 VENDEDORES
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)
add_rect(slide, 0, 0, 0.22, 7.5, GREEN)

add_text(slide, "CASO 03  |  ESTRATEGIA DE ACTIVACIÓN: 785 VENDEDORES", 0.4, 0.2, 12.5, 0.5,
         font_size=18, bold=True, color=WHITE)
add_rect(slide, 0.4, 0.72, 12.5, 0.04, SUPER_YELLOW)

# Funnel / cascade model
cascade = [
    ("PASO 1", "LANZAMIENTO CON LA CÚPULA DEL DISTRIBUIDOR",
     "Reunión presencial (o virtual) con Gerencia y Jefatura de Ventas del distribuidor.\n"
     "Presentar la oferta, los márgenes del tendero y el plan de incentivos para sus vendedores.\n"
     "Entregar: kit de lanzamiento, calculadora de margen, muestra del producto.",
     SUPER_RED, "🤝"),
    ("PASO 2", "CAPACITACIÓN MASIVA A LOS 785 VENDEDORES",
     "Sesión virtual/presencial por zona (dividir en grupos de ~100 vendedores).\n"
     "Duración: 30 min. Contenido: ¿qué es Edición Estelar?, argumentario de ventas,\n"
     "cómo ejecutar la oferta en tienda y cómo ganar el bono.",
     TEAL, "📚"),
    ("PASO 3", "KIT DEL VENDEDOR + INCENTIVO PROPIO",
     "Cada vendedor recibe: muestra del producto, flyer A6 para entregar al tendero,\n"
     "QR con video del producto. BONO VENDEDOR: $X por cada tienda nueva que codifique\n"
     "Edición Estelar en las primeras 4 semanas (bono escalonado según volumen).",
     GREEN, "💼"),
    ("PASO 4", "SEGUIMIENTO SEMANAL Y RANKING",
     "Dashboard compartido con el distribuidor: codificaciones por vendedor/ruta/zona.\n"
     "Ranking semanal enviado por WhatsApp al grupo de ventas del distribuidor.\n"
     "Semana 4: cierre del período de bono de lanzamiento y reconocimiento al Top 10.",
     GOLD, "📊"),
]

for i,(paso, title, desc, color, icon) in enumerate(cascade):
    x = 0.4 + (i%2)*6.45
    y = 0.85 + (i//2)*3.05
    add_rect(slide, x, y, 6.2, 2.85, MID_BG)
    add_rect(slide, x, y, 6.2, 0.45, color)

    add_text(slide, paso, x+0.12, y+0.06, 1.0, 0.35,
             font_size=9, bold=True, color=WHITE)
    add_text(slide, icon + "  " + title, x+0.12, y+0.06, 5.9, 0.38,
             font_size=11, bold=True, color=WHITE)

    # desc lines
    for j,line in enumerate(desc.split('\n')):
        add_text(slide, "▸  "+line, x+0.15, y+0.58+j*0.6, 5.85, 0.55,
                 font_size=9.5, color=LIGHT_GREY)

# Meta box at right
add_rect(slide, 0, 7.2, 13.33, 0.3, MID_BG)
add_text(slide, "Super de Alimentos  |  Assessment Trade Marketing 2026", 0.5, 7.22, 8, 0.25,
         font_size=8.5, color=RGBColor(0xAA,0xAA,0xAA))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 13 – RESUMEN EJECUTIVO / CIERRE
# ══════════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(blank_layout(prs))
add_rect(slide, 0, 0, 13.33, 7.5, DARK_BG)
add_rect(slide, 0, 0, 13.33, 0.12, SUPER_RED)

add_text(slide, "RESUMEN EJECUTIVO", 0.5, 0.25, 12, 0.6,
         font_size=26, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_rect(slide, 0.5, 0.85, 12.3, 0.04, SUPER_YELLOW)

summary = [
    ("01", "BRANDING MAYORISTAS ECUADOR", SUPER_RED, [
        "6 pasos: diagnóstico → negociación → brief diseño → producción → instalación → auditoría",
        "Co-branding: 30% cliente / 40% compartido / 30% Trululu — sin afectar identidad del mayorista",
        "Flujo de aprobación en 2 etapas con firma del cliente antes de producir",
        "KPI mensual: % de puntos en condición óptima vs total instalado",
    ]),
    ("02", "PLAN DE INCENTIVOS HONDURAS", RGBColor(0x00, 0x5B, 0xAA), [
        "6 pasos: recepción → estandarización → cruce fuente interna → validación → cálculo → pago",
        "18 campos mínimos distribuidos en 3 categorías: identificación, ejecución y cálculo",
        "Concepto 'REYES DE LA RUTA': 3 niveles (Bronce / Plata / Oro), coronación mensual",
        "Exclusión automática: >2 meses inconsistentes O cobertura sostenida <40% de la meta",
    ]),
    ("03", "OFERTA EDICIÓN ESTELAR ECUADOR", GREEN, [
        "Oferta 3 pilares: codificación (2 displays + 12% dcto), bonificación (1×12 + POP) y recompra",
        "4 pasos para activar a 785 vendedores: lanzamiento cúpula → capacitación → kit+bono → ranking",
        "Argumento ancla: TOM de Trululu ya conquistado; Edición Estelar = edición coleccionable urgente",
        "Seguimiento semanal con dashboard compartido con el distribuidor",
    ]),
]

for i,(num, title, color, bullets) in enumerate(summary):
    y = 1.05 + i*2.0
    add_rect(slide, 0.4, y, 12.5, 1.82, MID_BG)
    add_rect(slide, 0.4, y, 0.55, 1.82, color)
    add_text(slide, num, 0.4, y+0.5, 0.55, 0.65,
             font_size=22, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(slide, title, 1.1, y+0.12, 11.5, 0.38,
             font_size=13, bold=True, color=color)
    for j,b in enumerate(bullets):
        add_text(slide, "✓  "+b, 1.1, y+0.55+j*0.3, 11.5, 0.28,
                 font_size=9.5, color=LIGHT_GREY)

add_rect(slide, 0, 7.1, 13.33, 0.4, RGBColor(0x0A, 0x0A, 0x20))
add_text(slide,
    "\"La estrategia sin ejecución es una ilusión. La ejecución sin estrategia es caos. Trade Marketing alinea ambas.\"",
    0.5, 7.12, 12.3, 0.35,
    font_size=9.5, italic=True, color=SUPER_YELLOW, align=PP_ALIGN.CENTER)

# ── Save ───────────────────────────────────────────────────────────────────────
output = "/home/user/ULTRA-/Assessment_Trade_Marketing_MarianaM.pptx"
prs.save(output)
print(f"✅  Presentación guardada en: {output}")
print(f"   Slides: {len(prs.slides)}")
