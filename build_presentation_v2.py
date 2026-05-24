"""
Assessment Trade Marketing – Super de Alimentos
Visual style: Canva "Black and White Modern Business Plan" adapted
Dark background · Lime green accent · Rounded cards · Clean typography
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml.ns import qn
from lxml import etree

# ─── Palette ──────────────────────────────────────────────────────────────────
BG     = RGBColor(0x1C, 0x1C, 0x1C)
CARD   = RGBColor(0x2B, 0x2B, 0x2B)
CARD2  = RGBColor(0x33, 0x33, 0x33)
LIME   = RGBColor(0xAA, 0xFF, 0x00)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
LGRAY  = RGBColor(0xB4, 0xB4, 0xB4)
MGRAY  = RGBColor(0x70, 0x70, 0x70)
BORDER = RGBColor(0x46, 0x46, 0x46)
BLACK  = RGBColor(0x11, 0x11, 0x11)

W, H = 13.33, 7.5   # slide dimensions in inches

prs = Presentation()
prs.slide_width  = Inches(W)
prs.slide_height = Inches(H)

def blank():
    return prs.slide_layouts[6]

# ─── Shape primitives ─────────────────────────────────────────────────────────

def _rect(slide, l, t, w, h, fill, border=None, bw=0.75):
    s = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    s.fill.solid(); s.fill.fore_color.rgb = fill
    if border:
        s.line.color.rgb = border; s.line.width = Pt(bw)
    else:
        s.line.fill.background()
    return s

def rnd(slide, l, t, w, h, fill=CARD, border=None, bw=0.75, r=22000):
    s = _rect(slide, l, t, w, h, fill, border, bw)
    pg = s._element.find('.//' + qn('a:prstGeom'))
    pg.set('prst', 'roundRect')
    av = pg.find(qn('a:avLst'))
    for c in list(av): av.remove(c)
    gd = etree.SubElement(av, qn('a:gd'))
    gd.set('name', 'adj'); gd.set('fmla', f'val {r}')
    return s

def t(slide, text, l, t_, w, h,
      sz=13, bold=False, color=WHITE,
      align=PP_ALIGN.LEFT, italic=False):
    tb = slide.shapes.add_textbox(Inches(l), Inches(t_), Inches(w), Inches(h))
    tb.text_frame.word_wrap = True
    p = tb.text_frame.paragraphs[0]; p.alignment = align
    r = p.add_run()
    r.text = text; r.font.size = Pt(sz)
    r.font.bold = bold; r.font.color.rgb = color; r.font.italic = italic
    return tb

def multiline(slide, lines, l, t_, w, h):
    """lines = [(text, sz, bold, color, align, italic)]"""
    tb = slide.shapes.add_textbox(Inches(l), Inches(t_), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True
    first = True
    for (text, sz, bold, color, align, italic) in lines:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = align
        r = p.add_run()
        r.text = text; r.font.size = Pt(sz)
        r.font.bold = bold; r.font.color.rgb = color; r.font.italic = italic

# ─── Slide-level chrome ───────────────────────────────────────────────────────

def setup(slide):
    """Background + header."""
    _rect(slide, 0, 0, W, H, BG)
    # header line
    t(slide, "Super de Alimentos", 0.45, 0.17, 4.5, 0.32, sz=10, color=LGRAY)
    t(slide, "Mayo 2026", W-2.8, 0.17, 2.4, 0.32,
      sz=10, color=LGRAY, align=PP_ALIGN.RIGHT)
    _rect(slide, 0.45, 0.54, W-0.9, 0.018, RGBColor(0x44,0x44,0x44))

def arrows(slide):
    """Lime nav arrows at bottom corners."""
    for lx, ch in [(0.22, "◀"), (W-0.72, "▶")]:
        rnd(slide, lx, H-0.72, 0.5, 0.5, fill=LIME, r=50000)
        t(slide, ch, lx, H-0.74, 0.5, 0.5,
          sz=13, bold=True, color=BLACK, align=PP_ALIGN.CENTER)

def big_title(slide, a, b, l=0.45, top=0.75, sz=42):
    t(slide, a, l, top,      W-l-0.3, 0.85, sz=sz, bold=True,  color=WHITE)
    t(slide, b, l, top+0.80, W-l-0.3, 0.85, sz=sz, bold=False, color=LGRAY)

# ─── Card components ──────────────────────────────────────────────────────────

def dark_card(slide, l, t_, w, h, title, body,
              tsz=12, bsz=9.5, fill=CARD, bord=BORDER, tcol=WHITE):
    rnd(slide, l, t_, w, h, fill=fill, border=bord, r=20000)
    t(slide, title, l+0.18, t_+0.18, w-0.36, 0.38,
      sz=tsz, bold=True, color=tcol)
    t(slide, body,  l+0.18, t_+0.60, w-0.36, h-0.72,
      sz=bsz, color=LGRAY)

def lime_card(slide, l, t_, w, h, title, body, tsz=12, bsz=9.5):
    rnd(slide, l, t_, w, h, fill=LIME, r=20000)
    t(slide, title, l+0.18, t_+0.18, w-0.36, 0.38,
      sz=tsz, bold=True, color=BLACK)
    t(slide, body,  l+0.18, t_+0.60, w-0.36, h-0.72,
      sz=bsz, color=RGBColor(0x22,0x22,0x22))

def white_card(slide, l, t_, w, h, title, body, tsz=12, bsz=9.5):
    rnd(slide, l, t_, w, h, fill=WHITE, r=20000)
    t(slide, title, l+0.18, t_+0.18, w-0.36, 0.38,
      sz=tsz, bold=True, color=BLACK)
    t(slide, body,  l+0.18, t_+0.60, w-0.36, h-0.72,
      sz=bsz, color=RGBColor(0x33,0x33,0x33))

def num_card(slide, l, t_, w, h, num, title, body,
             fill=CARD, bord=BORDER, num_col=WHITE):
    rnd(slide, l, t_, w, h, fill=fill, border=bord, r=20000)
    nc = BLACK if fill == WHITE or fill == LIME else num_col
    bc = BLACK if fill == WHITE or fill == LIME else WHITE
    gc = RGBColor(0x33,0x33,0x33) if fill in (WHITE, LIME) else LGRAY
    t(slide, f"{num:02d}", l+0.18, t_+0.10, w-0.36, 0.75,
      sz=38, bold=True, color=nc)
    t(slide, title, l+0.18, t_+0.85, w-0.36, 0.38,
      sz=12, bold=True, color=bc)
    t(slide, body, l+0.18, t_+1.28, w-0.36, h-1.45,
      sz=9.5, color=gc)

def step_strip(slide, l, t_, w, h, num, title, body, lime=False):
    """Horizontal strip step card."""
    fill = LIME if lime else CARD
    rnd(slide, l, t_, w, h, fill=fill, border=None if lime else BORDER, r=15000)
    nc  = BLACK if lime else LIME
    tc  = BLACK if lime else WHITE
    bc  = RGBColor(0x22,0x22,0x22) if lime else LGRAY
    t(slide, f"{num:02d}", l+0.15, t_+0.10, 0.55, h-0.15,
      sz=20, bold=True, color=nc)
    t(slide, title, l+0.75, t_+0.10, w-0.95, 0.35,
      sz=11, bold=True, color=tc)
    t(slide, body, l+0.75, t_+0.48, w-0.95, h-0.55,
      sz=9.5, color=bc)

def icon_card(slide, l, t_, w, h, icon, title, body, lime=False):
    fill = LIME if lime else CARD
    rnd(slide, l, t_, w, h, fill=fill, border=None if lime else BORDER, r=22000)
    tc = BLACK if lime else WHITE
    bc = RGBColor(0x22,0x22,0x22) if lime else LGRAY
    t(slide, icon, l+0.15, t_+0.12, 0.55, 0.55,
      sz=22, align=PP_ALIGN.CENTER, color=tc)
    t(slide, title, l+0.72, t_+0.17, w-0.9, 0.35,
      sz=12, bold=True, color=tc)
    t(slide, body, l+0.15, t_+0.70, w-0.3, h-0.82,
      sz=9.5, color=bc)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 1 – PORTADA
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
_rect(sl, 0, 0, W, H, BG)
# Lime vertical accent bar
_rect(sl, 0, 0, 0.18, H, LIME)

# Left content
t(sl, "SUPER DE ALIMENTOS", 0.55, 0.55, 7, 0.38,
  sz=10, bold=False, color=LGRAY, italic=True)
multiline(sl, [
    ("ASSESSMENT", 60, True,  WHITE, PP_ALIGN.LEFT, False),
    ("ANALISTA", 60, False, LGRAY, PP_ALIGN.LEFT, False),
], 0.55, 0.9, 8, 2.1)

t(sl, "TRADE MARKETING", 0.55, 3.0, 7, 0.7,
  sz=30, bold=True, color=LIME)

_rect(sl, 0.55, 3.8, 6.5, 0.025, BORDER)

t(sl, "Estrategia & Ejecución para  Ecuador  ·  Honduras",
  0.55, 3.95, 8, 0.45, sz=13, color=LGRAY, italic=True)

t(sl, "Mayo 2026  |  Mariana Montejo",
  0.55, 6.9, 6, 0.38, sz=10, color=MGRAY)

# Right: 3 case cards
for i, (num, title, sub) in enumerate([
    ("01", "BRANDING EN", "MAYORISTAS  🇪🇨"),
    ("02", "PLAN DE", "INCENTIVOS  🇭🇳"),
    ("03", "OFERTA", "EDICIÓN ESTELAR  🇪🇨"),
]):
    lx = 9.2; ty = 0.5 + i * 2.2
    lime_card(sl, lx, ty, 3.8, 1.95, f"CASO {num}", f"{title}\n{sub}",
              tsz=10, bsz=14)
    t(sl, num, lx+0.15, ty+0.12, 0.8, 0.5,
      sz=26, bold=True, color=BG)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 2 – CONTEXTO DE MERCADO
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)

big_title(sl, "Contexto de", "Mercado", top=0.65, sz=36)
arrows(sl)

# Ecuador card (left, lime)
rnd(sl, 0.45, 2.05, 5.9, 4.85, fill=LIME, r=22000)
t(sl, "🇪🇨  ECUADOR", 0.65, 2.18, 5.5, 0.45, sz=15, bold=True, color=BLACK)
_rect(sl, 0.65, 2.65, 5.5, 0.018, MGRAY)
ec = [
    ("ESTRUCTURA", True),
    ("1 Gerente · 1 Ejecutivo · 1 Formador · 15 Mercaderistas", False),
    ("Dirección comercial en Quito", False),
    ("", False),
    ("CANAL & MARCAS", True),
    ("Trululu lidera TOM de la categoría", False),
    ("80 % del volumen concentrado en mayoristas", False),
    ("Top SKU: Bianchi · OkaLoka · Next", False),
    ("", False),
    ("TRADE ACTUAL", True),
    ("Plan incentivos con distribuidor único", False),
    ("Branding de avisos en galerías mayoristas", False),
    ("Exhibidores Trululu en punto de venta", False),
]
yy = 2.80
for (line, bold) in ec:
    t(sl, line, 0.68, yy, 5.45, 0.32,
      sz=9.5 if not bold else 10,
      bold=bold, color=BLACK if not bold else RGBColor(0x1A,0x1A,0x1A),
      italic=False)
    yy += 0.28 if line else 0.12

# Honduras card (right, dark)
rnd(sl, 6.9, 2.05, 5.9, 4.85, fill=CARD, border=BORDER, r=22000)
t(sl, "🇭🇳  HONDURAS", 7.1, 2.18, 5.5, 0.45, sz=15, bold=True, color=WHITE)
_rect(sl, 7.1, 2.65, 5.5, 0.018, BORDER)
hn = [
    ("ESTRUCTURA", True),
    ("1 Gerente (Colombia) · 2 Ejecutivos · 7 Mercaderistas", False),
    ("SPS · Tegucigalpa · Ciudades principales", False),
    ("", False),
    ("CANAL & MARCAS", True),
    ("Gran cantidad de distribuidores tienda a tienda", False),
    ("Trululu Nanos: SKU ancla del plan de incentivos", False),
    ("Mercaderistas en mayoristas estratégicos", False),
    ("", False),
    ("TRADE ACTUAL", True),
    ("Incentivos 100 % basados en cobertura de tiendas", False),
    ("Degustaciones y combos de volumen", False),
    ("Descuento 10 % por compra mín. 400 L", False),
]
yy = 2.80
for (line, bold) in hn:
    t(sl, line, 7.13, yy, 5.45, 0.32,
      sz=9.5 if not bold else 10,
      bold=bold, color=LGRAY if not bold else WHITE,
      italic=False)
    yy += 0.28 if line else 0.12

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 3 – CASO 01 TÍTULO
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

# Case number badge
rnd(sl, 0.45, 0.68, 1.35, 1.35, fill=LIME, r=18000)
t(sl, "01", 0.45, 0.7, 1.35, 1.2, sz=58, bold=True, color=BLACK,
  align=PP_ALIGN.CENTER)

t(sl, "CASO", 2.05, 0.72, 6, 0.38, sz=11, color=LGRAY, italic=True)
big_title(sl, "Branding en", "Mayoristas", l=2.05, top=1.08, sz=42)
_rect(sl, 2.05, 2.98, 10.8, 0.02, BORDER)
t(sl, "Desarrollar un plan para brandear avisos principales y conseguir mínimo 2 espacios "
      "adicionales para Trululu Nanos en los mayoristas de Ecuador.",
  2.05, 3.08, 10.8, 0.75, sz=13, color=LGRAY, italic=True)

# 4 pillar cards
pillars = [
    ("🔍", "Diagnóstico",    "Mapeo de clientes\ny espacios"),
    ("🤝", "Negociación",    "Propuesta al\ncliente mayorista"),
    ("🎨", "Diseño",         "Brief técnico y\nco-branding"),
    ("📊", "Seguimiento",    "Auditoría mensual\ny KPIs"),
]
for i, (icon, title, body) in enumerate(pillars):
    icon_card(sl, 0.45 + i*3.22, 4.1, 3.0, 2.65,
              icon, title, body, lime=(i == 0))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 4 – CASO 01 | PASOS 1–3
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

t(sl, "CASO 01  ·  PASOS DE EJECUCIÓN", 0.45, 0.65, 12, 0.45,
  sz=18, bold=True, color=WHITE)

# Left big step (lime)
rnd(sl, 0.45, 1.22, 4.15, 5.62, fill=LIME, r=22000)
t(sl, "01", 0.65, 1.35, 1.0, 0.8, sz=38, bold=True, color=BLACK)
t(sl, "DIAGNÓSTICO Y MAPEO", 0.65, 2.12, 3.75, 0.48,
  sz=13, bold=True, color=BLACK)
t(sl, "Levantar inventario de galerías por ciudad. Identificar "
      "los 5–8 mayoristas de mayor volumen de Super de Alimentos. "
      "Fotografiar avisos actuales, zonas de tráfico y espacios disponibles. "
      "Clasificar cada punto por potencial de visibilidad (A / B / C). "
      "Definir con el ejecutivo comercial los clientes prioritarios a intervenir.",
  0.65, 2.65, 3.75, 3.9, sz=10.5, color=RGBColor(0x22,0x22,0x22))

# Right column: steps 2 and 3
step_strip(sl, 4.78, 1.22, 8.1, 2.68,
    2, "DEFINICIÓN DEL PLAN DE ESPACIOS",
    "Establecer con Ejecutivo + Gerente Ecuador los espacios a intervenir: "
    "aviso principal del negocio (co-branding Trululu) + mínimo 2 puntos adicionales "
    "para Trululu Nanos (cabecera de góndola, área de caja, isla central o vitrina exterior). "
    "Priorizar zonas de mayor tránsito de tenderos compradores.",
    lime=False)

step_strip(sl, 4.78, 4.16, 8.1, 2.68,
    3, "NEGOCIACIÓN CON EL CLIENTE MAYORISTA",
    "El ejecutivo comercial agenda reunión con el dueño/administrador de cada mayorista. "
    "Se presenta propuesta de valor: 'Nosotros cubrimos material e instalación; "
    "usted gana visibilidad premium en su negocio.' "
    "Se firma carta de autorización que establece ubicaciones, tiempos y compromisos de preservación.",
    lime=False)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 5 – CASO 01 | PASOS 4–6 + BRIEF DE DISEÑO
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

t(sl, "CASO 01  ·  INSTALACIÓN & DIRECCIONAMIENTO AL EQUIPO DE DISEÑO",
  0.45, 0.65, 12.5, 0.45, sz=18, bold=True, color=WHITE)

# Steps 4–6 (top row, 3 cards)
for i, (num, title, body) in enumerate([
    (4, "BRIEF AL DISEÑO Y PRODUCCIÓN",
        "Ficha técnica por cliente: medidas, material, soporte y restricciones. "
        "Diseño propone 2 opciones de arte. Flujo: revisión Trade Mktg (48 h) → "
        "aprobación del cliente (firma) → orden de producción."),
    (5, "INSTALACIÓN Y REGISTRO",
        "Instalación con mercaderistas + empresa especializada según complejidad. "
        "Registro fotográfico geo-referenciado (antes / después). "
        "Acta de recepción firmada por el cliente con compromisos de preservación."),
    (6, "AUDITORÍA Y PRESERVACIÓN",
        "Revisión mensual por mercaderistas: estado del material, limpieza, "
        "visibilidad no obstruida. Reposición inmediata si hay daño. "
        "KPI: % de puntos en condición óptima vs total instalado."),
]):
    lx = 0.45 + i * 4.3
    num_card(sl, lx, 1.15, 4.05, 2.55, num, title, body,
             fill=LIME if i == 2 else CARD,
             bord=None if i == 2 else BORDER,
             num_col=WHITE)

# Brief de diseño (bottom, 4 cards)
t(sl, "▸  DIRECCIONAMIENTO AL EQUIPO DE DISEÑO", 0.45, 3.9, 12, 0.38,
  sz=11, bold=True, color=LIME)
_rect(sl, 0.45, 4.3, 12.5, 0.018, BORDER)

for i, (title, body) in enumerate([
    ("📐 BRIEF TÉCNICO",
        "Dimensiones exactas · material soporte · condición ambiental · fotos actuales del espacio"),
    ("🎨 CONCEPTO CO-BRANDING",
        "30 % identidad del cliente (intocable) · 40 % zona compartida · 30 % marca Trululu Nanos"),
    ("✅ FLUJO DE APROBACIÓN",
        "Arte → revisión interna (48 h) → aprobación con firma del cliente → producción"),
    ("📌 REGLAS IRRENUNCIABLES",
        "Logo Trululu mín. 15 % del área · claim vigente · foto producto en alta res"),
]):
    icon_card(sl, 0.45 + i*3.22, 4.55, 3.05, 2.3, "", title, body,
              lime=(i == 1))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 6 – CASO 02 TÍTULO
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

rnd(sl, 0.45, 0.68, 1.35, 1.35, fill=LIME, r=18000)
t(sl, "02", 0.45, 0.7, 1.35, 1.2, sz=58, bold=True, color=BLACK,
  align=PP_ALIGN.CENTER)

t(sl, "CASO", 2.05, 0.72, 6, 0.38, sz=11, color=LGRAY, italic=True)
big_title(sl, "Plan de", "Incentivos", l=2.05, top=1.08, sz=42)
_rect(sl, 2.05, 2.98, 10.8, 0.02, BORDER)
t(sl, "Consolidar, analizar y autorizar pagos mensuales con múltiples distribuidores "
      "y bases de datos heterogéneas. Crear un concepto con identidad propia para Honduras.",
  2.05, 3.08, 10.8, 0.75, sz=13, color=LGRAY, italic=True)

pillars2 = [
    ("📥", "Recepción",     "BBDD de cada\ndistribuidor"),
    ("🔄", "Estandarización","Plantilla única\nmaestra"),
    ("🔍", "Validación",    "Cruce vs fuente\ninterna Super"),
    ("💰", "Pago",          "Autorización\ny liquidación"),
]
for i, (icon, title, body) in enumerate(pillars2):
    icon_card(sl, 0.45 + i*3.22, 4.1, 3.0, 2.65,
              icon, title, body, lime=(i == 3))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 7 – CASO 02 | PASOS 1–3
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

t(sl, "CASO 02  ·  PASO A PASO: CONSOLIDACIÓN", 0.45, 0.65, 12, 0.45,
  sz=18, bold=True, color=WHITE)

# Big lime step 1
rnd(sl, 0.45, 1.22, 4.15, 5.62, fill=LIME, r=22000)
t(sl, "01", 0.65, 1.35, 1.0, 0.8, sz=38, bold=True, color=BLACK)
t(sl, "RECEPCIÓN DE BASES DE DATOS", 0.65, 2.12, 3.75, 0.48,
  sz=13, bold=True, color=BLACK)
t(sl, "Fecha límite: día 3 del mes siguiente. Cada distribuidor "
      "envía su reporte en el formato que usa (Excel, PDF, correo). "
      "Se crea carpeta digital por distribuidor y mes. "
      "Se acusa recibo formal y se revisa completitud inmediata. "
      "Distribuidores con reporte incompleto reciben aviso con plazo de corrección de 24 h.",
  0.65, 2.65, 3.75, 3.9, sz=10.5, color=RGBColor(0x22,0x22,0x22))

step_strip(sl, 4.78, 1.22, 8.1, 2.68,
    2, "ESTANDARIZACIÓN A PLANTILLA MAESTRA",
    "Transformar cada BBDD al formato único de Super (18 campos mínimos requeridos). "
    "Usar Power Query o macro Excel para automatizar el mapeo de columnas. "
    "Columnas faltantes → notificación al distribuidor con formulario de corrección. "
    "Validar que todos los registros tengan cédula, zona y evidencia fotográfica.",
    lime=False)

step_strip(sl, 4.78, 4.16, 8.1, 2.68,
    3, "CRUCE CON FUENTE INTERNA DE VENTAS",
    "Cruzar cobertura reportada vs facturación real de Trululu Nanos "
    "registrada en el sistema de Super por zona / ruta. "
    "Marcar discrepancias > 10 % para auditoría de campo. "
    "Distribuidores con inconsistencias reiteradas ingresan al proceso de exclusión.",
    lime=False)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 8 – CASO 02 | PASOS 4–6
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

t(sl, "CASO 02  ·  VALIDACIÓN, CÁLCULO Y PAGO", 0.45, 0.65, 12, 0.45,
  sz=18, bold=True, color=WHITE)

# Steps 4–6 top
for i, (num, title, body) in enumerate([
    (4, "VALIDACIÓN DE EVIDENCIAS",
        "Revisar fotografías o registros GPS de visitas. "
        "Mercaderistas de campo confirman muestra del 20 % de tiendas por ruta. "
        "Puntos sin evidencia no cuentan para el cálculo de incentivos."),
    (5, "CÁLCULO Y PREAPROBACIÓN",
        "Aplicar fórmula: cobertura alcanzada ÷ meta = % cumplimiento → "
        "tabla escalonada (Bronce / Plata / Oro). "
        "Informe de preaprobación con monto por vendedor. "
        "Ejecutivos comerciales revisan y firman digitalmente."),
    (6, "AUTORIZACIÓN FINAL Y PAGO",
        "Gerente Comercial + Gerente Trade Marketing autorizan. "
        "Orden de pago enviada a Finanzas con respaldo completo. "
        "Fecha de pago: máximo día 15 del mes. "
        "Notificación individual a cada vendedor ganador."),
]):
    num_card(sl, 0.45 + i * 4.3, 1.15, 4.05, 2.55, num, title, body,
             fill=LIME if i == 2 else CARD,
             bord=None if i == 2 else BORDER)

# BBDD fields bottom
t(sl, "▸  CAMPOS MÍNIMOS DE LA BASE DE DATOS ÓPTIMA", 0.45, 3.9, 12, 0.38,
  sz=11, bold=True, color=LIME)
_rect(sl, 0.45, 4.3, 12.5, 0.018, BORDER)

for i, (title, fields) in enumerate([
    ("👤 IDENTIFICACIÓN",
        "Cédula · Nombre completo · Distribuidor · Zona/Ruta · Teléfono · Cuenta bancaria"),
    ("📦 EJECUCIÓN EN CAMPO",
        "N.º tiendas en ruta · tiendas visitadas · tiendas con venta Trululu Nanos · "
        "unidades vendidas · foto/evidencia · fecha de visita"),
    ("📊 CÁLCULO DE INCENTIVO",
        "Meta mensual % · % cobertura alcanzada · monto base (tabla) · "
        "factor de cumplimiento · monto a pagar · estado (Aprobado/Rechazado)"),
]):
    dark_card(sl, 0.45 + i*4.3, 4.55, 4.05, 2.3, title, fields,
              tsz=11, bsz=9.5,
              fill=CARD2 if i == 1 else CARD, bord=BORDER,
              tcol=LIME if i != 1 else WHITE)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 9 – CASO 02 | CONCEPTO "REYES DE LA RUTA"
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

big_title(sl, '"Reyes de', 'la Ruta"', top=0.65, sz=40)

# Hero lime band
rnd(sl, 0.45, 2.15, 12.5, 1.1, fill=LIME, r=15000)
t(sl, "🏆  PLAN DE INCENTIVOS TRULULU NANOS  ·  HONDURAS",
  0.65, 2.22, 11.5, 0.4, sz=13, bold=True, color=BLACK)
t(sl, "Cada vendedor que conquiste su ruta demuestra que es el Rey de su territorio. "
      "Los mejores son coronados cada mes en la Coronación Reyes de la Ruta.",
  0.65, 2.64, 11.5, 0.45, sz=10.5, color=RGBColor(0x22,0x22,0x22), italic=True)

# 4 concept cards
for i, (icon, title, body, is_lime) in enumerate([
    ("👑", "CORONACIÓN MENSUAL",
        "Reunión mensual de ganadores. Solo acceden vendedores con ≥ 85 % de cobertura. "
        "Entrega de bonos en evento especial con reconocimiento público.",
        False),
    ("🥇", "3 NIVELES DE HONOR",
        "🥉 Rey de Bronce  70–84 %\n"
        "🥈 Rey de Plata   85–94 %\n"
        "🥇 Rey de Oro     95–100 %+\n"
        "Cada nivel tiene bono y beneficio diferenciado.",
        True),
    ("📱", "COMUNICACIÓN",
        "Ranking semanal por WhatsApp grupal por distribuidor. "
        "Imagen del 'Rey del Mes' enviada a todos. "
        "Top 3 publicados en el grupo corporativo del equipo.",
        False),
    ("🚫", "CRITERIO DE EXCLUSIÓN",
        "Se eliminan distribuidores con: > 2 meses de datos incompletos, "
        "inconsistencias vs facturación > 20 %, "
        "o cobertura sostenida < 40 % de la meta.",
        False),
]):
    icon_card(sl, 0.45 + i*3.22, 3.45, 3.05, 3.3,
              icon, title, body, lime=is_lime)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 10 – CASO 03 TÍTULO
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

rnd(sl, 0.45, 0.68, 1.35, 1.35, fill=LIME, r=18000)
t(sl, "03", 0.45, 0.7, 1.35, 1.2, sz=58, bold=True, color=BLACK,
  align=PP_ALIGN.CENTER)

t(sl, "CASO", 2.05, 0.72, 6, 0.38, sz=11, color=LGRAY, italic=True)
big_title(sl, "Oferta de", "Codificación", l=2.05, top=1.08, sz=42)
_rect(sl, 2.05, 2.98, 10.8, 0.02, BORDER)
t(sl, "Construir una oferta irresistible para que los tenderos de Ecuador codifiquen "
      "Trululu Nanos – Edición Estelar, activándola a través de los 785 vendedores "
      "del distribuidor nacional.",
  2.05, 3.08, 10.8, 0.75, sz=13, color=LGRAY, italic=True)

# Name / label
rnd(sl, 2.05, 3.95, 10.8, 0.72, fill=LIME, r=15000)
t(sl, "🌟  NOMBRE DE LA CAMPAÑA:  \"CODIFICA LA ESTRELLA\"  —  Edición Estelar Trululu Nanos",
  2.2, 4.03, 10.5, 0.52, sz=13, bold=True, color=BLACK)

pillars3 = [
    ("🎯", "La Oferta",      "Pack de entrada\n+ descuento lanzamiento"),
    ("🎁", "Al Tendero",     "Bonificación 1×12\n+ POP en tienda"),
    ("🔁", "Recompra",       "Descuento x\nreposición rápida"),
    ("🚀", "Activación",     "785 vendedores\nen 4 pasos"),
]
for i, (icon, title, body) in enumerate(pillars3):
    icon_card(sl, 0.45 + i*3.22, 4.85, 3.0, 2.4,
              icon, title, body, lime=(i == 0))

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 11 – CASO 03 | CONFIGURACIÓN DE LA OFERTA
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

t(sl, "CASO 03  ·  CONFIGURACIÓN DE LA OFERTA", 0.45, 0.65, 12, 0.45,
  sz=18, bold=True, color=WHITE)

# Big lime pillar 1
rnd(sl, 0.45, 1.22, 4.15, 5.62, fill=LIME, r=22000)
t(sl, "🎯", 0.65, 1.32, 1.2, 0.8, sz=34, color=BLACK)
t(sl, "PEDIDO MÍNIMO DE CODIFICACIÓN", 0.65, 2.08, 3.75, 0.48,
  sz=13, bold=True, color=BLACK)
t(sl, "• Pack de entrada: 2 display × 24 und = 48 unidades\n"
      "• Precio especial de lanzamiento: 12 % descuento vs precio regular\n"
      "• Válido solo para primera compra de la referencia\n"
      "• Sin costo de exhibidor de sobremesa para los\n  primeros 200 tenderos en codificar",
  0.65, 2.65, 3.75, 3.9, sz=10.5, color=RGBColor(0x22,0x22,0x22))

step_strip(sl, 4.78, 1.22, 8.1, 2.68,
    2, "BENEFICIO DIRECTO AL TENDERO",
    "Por cada 48 und compradas → 4 und GRATIS (bonificación 1×12). "
    "Sticker 'Punto Oficial Edición Estelar' para vitrina. "
    "Entrada al sorteo mensual: tablet o televisor para el mejor codificador. "
    "Acceso a combos promocionales exclusivos del mes de lanzamiento.",
    lime=False)

step_strip(sl, 4.78, 4.16, 8.1, 2.68,
    3, "ACELERADOR DE RECOMPRA",
    "Reposición antes de 15 días → 5 % descuento adicional. "
    "Exhibición activa al mes siguiente → bono en producto. "
    "Programa 'Estrella Constante': tendero con 3 compras consecutivas "
    "recibe material POP personalizado con el nombre de su negocio.",
    lime=False)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 12 – CASO 03 | ESTRATEGIA 785 VENDEDORES
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

t(sl, "CASO 03  ·  ESTRATEGIA DE ACTIVACIÓN: 785 VENDEDORES",
  0.45, 0.65, 12, 0.45, sz=18, bold=True, color=WHITE)

steps_v = [
    (1, "🤝 LANZAMIENTO CON LA CÚPULA DEL DISTRIBUIDOR",
        "Reunión presencial / virtual con Gerencia y Jefatura de Ventas. "
        "Presentar la oferta, margen del tendero y plan de incentivos para sus vendedores. "
        "Entregar kit: muestra del producto, calculadora de margen y material de apoyo.",
        True),
    (2, "📚 CAPACITACIÓN MASIVA A LOS 785 VENDEDORES",
        "Sesiones virtuales/presenciales por zonas (grupos de ~100). Duración: 30 min. "
        "Contenido: qué es Edición Estelar, argumentario de ventas, "
        "cómo ejecutar la oferta en tienda y cómo ganar el bono.",
        False),
    (3, "💼 KIT DEL VENDEDOR + INCENTIVO PROPIO",
        "Cada vendedor recibe: muestra del producto + flyer A6 para el tendero + "
        "QR con video del producto. BONO VENDEDOR: monto escalonado por cada tienda nueva "
        "que codifique Edición Estelar en las primeras 4 semanas.",
        False),
    (4, "📊 SEGUIMIENTO SEMANAL Y RANKING",
        "Dashboard compartido con el distribuidor: codificaciones por vendedor / ruta / zona. "
        "Ranking semanal enviado por WhatsApp al grupo de ventas del distribuidor. "
        "Semana 4: cierre de período de bono y reconocimiento al Top 10.",
        False),
]

for i, (num, title, body, is_lime) in enumerate(steps_v):
    x = 0.45 + (i % 2) * 6.45
    y = 1.15 + (i // 2) * 3.1
    num_card(sl, x, y, 6.1, 2.85, num, title, body,
             fill=LIME if is_lime else CARD,
             bord=None if is_lime else BORDER)

# ══════════════════════════════════════════════════════════════════════════════
# SLIDE 13 – RESUMEN EJECUTIVO
# ══════════════════════════════════════════════════════════════════════════════
sl = prs.slides.add_slide(blank())
setup(sl)
arrows(sl)

big_title(sl, "Resumen", "Ejecutivo", top=0.65, sz=36)

for i, (num, title, kpis) in enumerate([
    ("01", "BRANDING EN MAYORISTAS  ·  Ecuador 🇪🇨", [
        "6 pasos: diagnóstico · negociación · brief diseño · producción · instalación · auditoría mensual",
        "Co-branding 30/40/30: identidad del cliente intocable · zona compartida · marca Trululu",
        "Flujo de aprobación en 2 etapas con firma del cliente antes de producir",
        "KPI mensual: % de puntos de venta en condición óptima vs total instalado",
    ]),
    ("02", "PLAN DE INCENTIVOS  ·  Honduras 🇭🇳", [
        "6 pasos: recepción → estandarización → cruce fuente interna → validación → cálculo → pago",
        "18 campos mínimos en 3 categorías: identificación · ejecución en campo · cálculo",
        "Concepto 'REYES DE LA RUTA': 3 niveles (Bronce/Plata/Oro) + coronación mensual",
        "Exclusión automática: > 2 meses inconsistentes o cobertura sostenida < 40 % de la meta",
    ]),
    ("03", "OFERTA EDICIÓN ESTELAR  ·  Ecuador 🇪🇨", [
        "Oferta 3 pilares: codificación (2 displays + 12 % dcto) · bonificación 1×12 · acelerador recompra",
        "4 pasos para activar a 785 vendedores: cúpula distribuidor → capacitación → kit+bono → ranking",
        "Argumento ancla: TOM de Trululu ya conquistado — Edición Estelar es la versión coleccionable urgente",
        "Dashboard compartido con distribuidor + ranking semanal en WhatsApp grupal",
    ]),
]):
    y = 2.05 + i * 1.72
    rnd(sl, 0.45, y, 12.5, 1.55, fill=LIME if i == 0 else CARD,
        border=None if i == 0 else BORDER, r=18000)
    # Number badge
    fill_num = BLACK if i == 0 else LIME
    rnd(sl, 0.52, y + 0.12, 0.72, 0.72,
        fill=BG if i == 0 else CARD2, r=50000)
    t(sl, num, 0.52, y + 0.12, 0.72, 0.72,
      sz=18, bold=True, color=fill_num, align=PP_ALIGN.CENTER)
    t(sl, title, 1.35, y + 0.12, 11.4, 0.38,
      sz=11, bold=True, color=BLACK if i == 0 else WHITE)
    bullet_str = "  ·  ".join(kpis[:2]) + "\n" + "  ·  ".join(kpis[2:])
    t(sl, bullet_str, 1.35, y + 0.55, 11.2, 0.85,
      sz=9.5, color=RGBColor(0x22,0x22,0x22) if i == 0 else LGRAY)

# Closing quote
rnd(sl, 0.45, 7.05, 12.5, 0.3, fill=RGBColor(0x12,0x12,0x12), r=10000)
t(sl, "\"La estrategia sin ejecución es ilusión. "
      "La ejecución sin estrategia es caos. Trade Marketing alinea ambas.\"",
  0.65, 7.07, 12.0, 0.25,
  sz=9, italic=True, color=LIME, align=PP_ALIGN.CENTER)

# ─── Save ─────────────────────────────────────────────────────────────────────
out = "/home/user/ULTRA-/Assessment_Trade_Marketing_MarianaM_v2.pptx"
prs.save(out)
print(f"✅  Guardado: {out}")
print(f"   Diapositivas: {len(prs.slides)}")
