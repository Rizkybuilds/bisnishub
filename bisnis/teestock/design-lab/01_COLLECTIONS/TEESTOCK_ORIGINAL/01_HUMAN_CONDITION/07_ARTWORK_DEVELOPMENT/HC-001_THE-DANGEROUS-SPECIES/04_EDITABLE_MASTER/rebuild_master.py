import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_dtf_master():
    print("=== Step 1: Loading raw asset ===")
    raw_path = r"C:\Users\Rizky\bisnishub\bisnis\teestock\design-lab\01_COLLECTIONS\TEESTOCK_ORIGINAL\01_HUMAN_CONDITION\07_ARTWORK_DEVELOPMENT\HC-001_THE-DANGEROUS-SPECIES\03_SELECTED_DIRECTION\HC-001_selected_raw.jpg"
    raw_img = Image.open(raw_path).convert("RGB")
    raw_arr = np.array(raw_img, dtype=np.float32)

    # Calculate luminance
    lum = 0.299 * raw_arr[:, :, 0] + 0.587 * raw_arr[:, :, 1] + 0.114 * raw_arr[:, :, 2]

    # Knockout Black curve:
    # Under 15: pure 0 alpha
    # 15 to 70: linear transition
    # Above 70: full 255 alpha
    low_thresh = 15.0
    high_thresh = 70.0
    alpha = np.clip((lum - low_thresh) / (high_thresh - low_thresh), 0.0, 1.0) * 255.0

    # Color mapping: Aged Ivory (#E8DFC9 = 232, 223, 201) and Muted Slate (#9C978D)
    # Map based on normalized intensity
    norm_intensity = np.clip(lum / 255.0, 0.0, 1.0)
    # Blend between slate (shadow lines) and aged ivory (highlights)
    color_ivory = np.array([232.0, 223.0, 201.0])
    color_slate = np.array([160.0, 154.0, 142.0])
    
    # Weight towards ivory
    t = norm_intensity[:, :, np.newaxis]
    rgb_mapped = color_slate * (1.0 - t) + color_ivory * t
    rgb_mapped = np.clip(rgb_mapped, 0.0, 255.0)

    # Construct RGBA array
    rgba_arr = np.zeros((raw_arr.shape[0], raw_arr.shape[1], 4), dtype=np.uint8)
    rgba_arr[:, :, 0:3] = rgb_mapped.astype(np.uint8)
    rgba_arr[:, :, 3] = alpha.astype(np.uint8)

    isolated_illustration = Image.fromarray(rgba_arr, mode="RGBA")
    print("Isolated illustration size:", isolated_illustration.size)

    # Master canvas: 280mm x 390mm @ 300 PPI = 3307 x 4606 pixels
    canvas_w = 3300
    canvas_h = 4600
    master = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(master)

    # Fonts
    font_bold_path = r"C:\Windows\Fonts\georgiab.ttf"
    font_serif_path = r"C:\Windows\Fonts\georgia.ttf"
    font_mono_path = r"C:\Windows\Fonts\consola.ttf"
    font_mono_b_path = r"C:\Windows\Fonts\consolab.ttf"

    font_top_meta = ImageFont.truetype(font_mono_path, 28)
    font_top_title = ImageFont.truetype(font_bold_path, 88)
    font_top_sub = ImageFont.truetype(font_mono_b_path, 34)

    font_quote = ImageFont.truetype(font_bold_path, 66)
    font_body = ImageFont.truetype(font_serif_path, 36)
    font_bot_meta = ImageFont.truetype(font_mono_path, 24)

    ivory_rgb = (232, 223, 201, 255)
    slate_rgb = (160, 154, 142, 255)
    line_rgb = (210, 200, 180, 220)

    # --- ARCHIVAL FRAME ---
    # Double hairline rectangular border
    # Outer margin
    m_out_x, m_out_y = 120, 120
    draw.rectangle([m_out_x, m_out_y, canvas_w - m_out_x, canvas_h - m_out_y], outline=line_rgb, width=6)
    # Inner border (margin 150)
    m_in_x, m_in_y = 150, 150
    draw.rectangle([m_in_x, m_in_y, canvas_w - m_in_x, canvas_h - m_in_y], outline=line_rgb, width=2)

    # Archival corner crosshairs
    def draw_crosshair(x, y, size=30):
        draw.line([x - size, y, x + size, y], fill=line_rgb, width=2)
        draw.line([x, y - size, x, y + size], fill=line_rgb, width=2)

    draw_crosshair(m_in_x + 50, m_in_y + 50)
    draw_crosshair(canvas_w - m_in_x - 50, m_in_y + 50)
    draw_crosshair(m_in_x + 50, canvas_h - m_in_y - 50)
    draw_crosshair(canvas_w - m_in_x - 50, canvas_h - m_in_y - 50)

    # Helper for centered tracked text
    def draw_tracked_text(y, text, font, fill, spacing=10):
        # Calculate total width with tracking
        total_w = 0
        char_widths = []
        for ch in text:
            bbox = font.getbbox(ch)
            w = bbox[2] - bbox[0]
            char_widths.append(w)
            total_w += w + spacing
        total_w -= spacing

        cur_x = (canvas_w - total_w) // 2
        for i, ch in enumerate(text):
            draw.text((cur_x, y), ch, font=font, fill=fill)
            cur_x += char_widths[i] + spacing

    # --- TOP HEADER ---
    draw_tracked_text(220, "TSO-01  //  HUMAN CONDITION  //  ARCHIVE SPECIMEN NO. 001", font_top_meta, slate_rgb, spacing=8)
    draw_tracked_text(280, "THE DANGEROUS SPECIES", font_top_title, ivory_rgb, spacing=14)
    draw_tracked_text(400, "— TAXONOMIC CLASSIFICATION: HOMO SAPIENS DELUSIONALIS —", font_top_sub, slate_rgb, spacing=6)

    # Horizontal divider under header
    draw.line([220, 480, canvas_w - 220, 480], fill=line_rgb, width=3)
    draw.line([300, 490, canvas_w - 300, 490], fill=line_rgb, width=1)

    # --- CENTER ILLUSTRATION ---
    # Target height ~ 2400 px, width auto (aspect ratio 896:1200)
    target_illus_h = 2400
    target_illus_w = int(isolated_illustration.width * (target_illus_h / isolated_illustration.height))
    scaled_illus = isolated_illustration.resize((target_illus_w, target_illus_h), Image.Resampling.LANCZOS)

    # Center position
    illus_x = (canvas_w - target_illus_w) // 2
    illus_y = 540
    master.paste(scaled_illus, (illus_x, illus_y), scaled_illus)

    # Vertical measurement markers on sides of illustration
    for my in range(illus_y + 100, illus_y + target_illus_h - 100, 150):
        draw.line([220, my, 250, my], fill=line_rgb, width=2)
        draw.line([canvas_w - 250, my, canvas_w - 220, my], fill=line_rgb, width=2)

    # --- BOTTOM EDITORIAL COMMENTARY & TYPOGRAPHY ---
    # Horizontal divider above commentary
    draw.line([300, illus_y + target_illus_h + 40, canvas_w - 300, illus_y + target_illus_h + 40], fill=line_rgb, width=1)
    draw.line([220, illus_y + target_illus_h + 50, canvas_w - 220, illus_y + target_illus_h + 50], fill=line_rgb, width=3)

    quote_y = illus_y + target_illus_h + 100
    draw_tracked_text(quote_y, '"INTELLIGENCE IS NOT IMMUNITY AGAINST STUPIDITY"', font_quote, ivory_rgb, spacing=6)

    body_y1 = quote_y + 110
    draw_tracked_text(body_y1, "We split the atom, mapped our genome, and created machines that reason,", font_body, slate_rgb, spacing=4)
    body_y2 = body_y1 + 55
    draw_tracked_text(body_y2, "yet we remain entirely defenseless in the presence of our own vanity.", font_body, slate_rgb, spacing=4)

    # Bottom Archival Metadata Box
    box_y = canvas_h - 380
    box_w = 2600
    box_x = (canvas_w - box_w) // 2
    draw.rectangle([box_x, box_y, box_x + box_w, box_y + 140], outline=line_rgb, width=2)
    draw_tracked_text(box_y + 30, "OBSERVED BY ONE OF ITS OWN  //  TEESTOCK ORIGINAL © 2026  //  ALL RIGHTS RESERVED", font_bot_meta, ivory_rgb, spacing=5)
    draw_tracked_text(box_y + 80, "REF: TSC-HC-001-CB-01  //  SCALE 1:1  //  PRINT SPEC: DTF NATIVE 300 PPI  //  KNOCKOUT BLACK VERIFIED", font_bot_meta, slate_rgb, spacing=4)

    print("=== Step 2: Saving Master Print PNG ===")
    export_dir = r"C:\Users\Rizky\bisnishub\bisnis\teestock\design-lab\01_COLLECTIONS\TEESTOCK_ORIGINAL\01_HUMAN_CONDITION\07_ARTWORK_DEVELOPMENT\HC-001_THE-DANGEROUS-SPECIES\05_EXPORTS"
    os.makedirs(export_dir, exist_ok=True)
    master_png_path = os.path.join(export_dir, "HC-001_THE-DANGEROUS-SPECIES_PRINT_V01.png")
    master.save(master_png_path, "PNG", dpi=(300, 300), optimize=True)
    print("Saved print master:", master_png_path)

    # --- FRONT CHEST CREST ---
    print("=== Step 3: Generating Front Chest Crest ===")
    crest_size = 945 # 80mm @ 300 PPI
    crest = Image.new("RGBA", (crest_size, crest_size), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(crest)

    # Outer circle
    cdraw.ellipse([40, 40, crest_size - 40, crest_size - 40], outline=line_rgb, width=4)
    cdraw.ellipse([55, 55, crest_size - 55, crest_size - 55], outline=line_rgb, width=2)

    # Scaled illustration centered in crest
    cr_illus_h = 560
    cr_illus_w = int(isolated_illustration.width * (cr_illus_h / isolated_illustration.height))
    cr_illus = isolated_illustration.resize((cr_illus_w, cr_illus_h), Image.Resampling.LANCZOS)
    cr_x = (crest_size - cr_illus_w) // 2
    cr_y = 120
    crest.paste(cr_illus, (cr_x, cr_y), cr_illus)

    # Crest text
    font_crest_top = ImageFont.truetype(font_mono_b_path, 22)
    font_crest_title = ImageFont.truetype(font_bold_path, 34)
    font_crest_bot = ImageFont.truetype(font_mono_path, 20)

    # Centered crest text helper
    def draw_crest_text(y, text, font, fill, spacing=6):
        total_w = 0
        char_widths = []
        for ch in text:
            bbox = font.getbbox(ch)
            w = bbox[2] - bbox[0]
            char_widths.append(w)
            total_w += w + spacing
        total_w -= spacing
        cur_x = (crest_size - total_w) // 2
        for i, ch in enumerate(text):
            cdraw.text((cur_x, y), ch, font=font, fill=fill)
            cur_x += char_widths[i] + spacing

    draw_crest_text(80, "TSO-01 // HUMAN CONDITION", font_crest_top, slate_rgb, spacing=4)
    draw_crest_text(crest_size - 180, "HC-001", font_crest_title, ivory_rgb, spacing=8)
    draw_crest_text(crest_size - 120, "THE DANGEROUS SPECIES", font_crest_bot, slate_rgb, spacing=4)

    crest_png_path = os.path.join(export_dir, "HC-001_THE-DANGEROUS-SPECIES_CREST_V01.png")
    crest.save(crest_png_path, "PNG", dpi=(300, 300), optimize=True)
    print("Saved crest master:", crest_png_path)

    # --- DEFIRINGE TEST ---
    print("=== Step 4: Running Neon Defringe QA Test ===")
    neon_green = Image.new("RGBA", (1000, 1000), (0, 255, 0, 255))
    neon_magenta = Image.new("RGBA", (1000, 1000), (255, 0, 255, 255))
    
    # Crop a 1000x1000 detail region around the caliper tip and marble bust edge
    detail_crop = master.crop((1150, 1000, 2150, 2000))
    defringe_g = neon_green.copy()
    defringe_g.paste(detail_crop, (0, 0), detail_crop)
    defringe_m = neon_magenta.copy()
    defringe_m.paste(detail_crop, (0, 0), detail_crop)

    qa_dir = r"C:\Users\Rizky\bisnishub\bisnis\teestock\design-lab\01_COLLECTIONS\TEESTOCK_ORIGINAL\01_HUMAN_CONDITION\07_ARTWORK_DEVELOPMENT\HC-001_THE-DANGEROUS-SPECIES\07_QA"
    os.makedirs(qa_dir, exist_ok=True)
    defringe_g.convert("RGB").save(os.path.join(qa_dir, "HC-001_defringe_test_neon_green.jpg"), "JPEG", quality=95)
    defringe_m.convert("RGB").save(os.path.join(qa_dir, "HC-001_defringe_test_neon_magenta.jpg"), "JPEG", quality=95)
    print("Defringe test images saved to 07_QA")

    # --- PHOTOREALISTIC APPAREL MOCKUPS ---
    print("=== Step 5: Generating Apparel Mockups ===")
    mockup_dir = r"C:\Users\Rizky\bisnishub\bisnis\teestock\design-lab\01_COLLECTIONS\TEESTOCK_ORIGINAL\01_HUMAN_CONDITION\07_ARTWORK_DEVELOPMENT\HC-001_THE-DANGEROUS-SPECIES\06_MOCKUPS"
    os.makedirs(mockup_dir, exist_ok=True)

    # Generate realistic 235 gsm Washed Vintage Black t-shirt background
    # Dimensions: 2400 x 3000 px mockup
    mock_w, mock_h = 2400, 3000
    mock_canvas = Image.new("RGBA", (mock_w, mock_h), (24, 24, 25, 255))
    
    # Create subtle garment texture and heathering
    np.random.seed(42)
    noise = (np.random.randn(mock_h, mock_w) * 6).astype(np.int16)
    tee_base = np.zeros((mock_h, mock_w, 3), dtype=np.uint8)
    for c in range(3):
        # Washed vintage charcoal base ~ #201F1E
        tee_base[:, :, c] = np.clip(32 + noise, 18, 48).astype(np.uint8)
    
    tee_img = Image.fromarray(tee_base, mode="RGB").convert("RGBA")

    # Add soft garment silhouette / shadow vignette
    vignette = Image.new("L", (mock_w, mock_h), 255)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rectangle([80, 80, mock_w - 80, mock_h - 80], fill=0)
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=100))
    # Blend subtle vignette
    tee_img.paste(Image.new("RGBA", (mock_w, mock_h), (12, 12, 13, 180)), (0, 0), vignette)

    # Back Mockup: Artwork scaled to fit back hero placement (w ~ 1380 px)
    back_art_w = 1380
    back_art_h = int(master.height * (back_art_w / master.width))
    back_art = master.resize((back_art_w, back_art_h), Image.Resampling.LANCZOS)

    back_mockup = tee_img.copy()
    art_x = (mock_w - back_art_w) // 2
    art_y = 480 # Natural upper-mid back placement below collar
    back_mockup.paste(back_art, (art_x, art_y), back_art)

    # Add subtle collar neckline indicator at top
    col_draw = ImageDraw.Draw(back_mockup)
    col_draw.arc([(mock_w // 2 - 450, -250), (mock_w // 2 + 450, 220)], start=30, end=150, fill=(45, 44, 42, 255), width=8)
    col_draw.arc([(mock_w // 2 - 460, -240), (mock_w // 2 + 460, 230)], start=30, end=150, fill=(18, 18, 19, 255), width=4)

    # Add apparel spec annotation watermark
    mock_annot_font = ImageFont.truetype(font_mono_path, 26)
    col_draw.text((100, mock_h - 120), "TEESTOCK ORIGINAL // TSO-01 HUMAN CONDITION // HC-001 BACK HERO MOCKUP", font=mock_annot_font, fill=(160, 154, 142, 220))
    col_draw.text((100, mock_h - 80), "GARMENT: 235 GSM WASHED VINTAGE CHARCOAL // PRINT SPEC: DTF KNOCKOUT BLACK", font=mock_annot_font, fill=(110, 106, 98, 220))

    back_mockup_path = os.path.join(mockup_dir, "HC-001_THE-DANGEROUS-SPECIES_MOCKUP_V01.jpg")
    back_mockup.convert("RGB").save(back_mockup_path, "JPEG", quality=95)
    print("Saved back hero mockup:", back_mockup_path)

    # Front Chest Mockup
    front_mockup = tee_img.copy()
    fcol_draw = ImageDraw.Draw(front_mockup)
    fcol_draw.arc([(mock_w // 2 - 450, -220), (mock_w // 2 + 450, 260)], start=30, end=150, fill=(45, 44, 42, 255), width=8)
    
    # Front crest placement: Left chest (viewer's right-center ~ x: 1350, y: 750)
    cr_mock_w = 480
    cr_mock_h = 480
    scaled_cr = crest.resize((cr_mock_w, cr_mock_h), Image.Resampling.LANCZOS)
    front_mockup.paste(scaled_cr, (1320, 720), scaled_cr)

    fcol_draw.text((100, mock_h - 120), "TEESTOCK ORIGINAL // TSO-01 HUMAN CONDITION // HC-001 FRONT CHEST CREST MOCKUP", font=mock_annot_font, fill=(160, 154, 142, 220))
    fcol_draw.text((100, mock_h - 80), "GARMENT: 235 GSM WASHED VINTAGE CHARCOAL // EMBLEM SIZE: 80x80 MM DTF", font=mock_annot_font, fill=(110, 106, 98, 220))

    front_mockup_path = os.path.join(mockup_dir, "HC-001_THE-DANGEROUS-SPECIES_MOCKUP_FRONT_V01.jpg")
    front_mockup.convert("RGB").save(front_mockup_path, "JPEG", quality=95)
    print("Saved front chest mockup:", front_mockup_path)

    print("=== All generation completed successfully! ===")

if __name__ == "__main__":
    create_dtf_master()
