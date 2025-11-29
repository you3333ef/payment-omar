#!/usr/bin/env python3
"""
Generate hero and OG images for shipping companies
"""
import os
from PIL import Image, ImageDraw, ImageFont
import requests
from io import BytesIO

# Companies data
companies = [
    {
        'name': 'genacom',
        'nameAr': 'جيناكم',
        'nameEn': 'Genacom Oman',
        'colors': ['#E82424', '#F7C24A'],
        'services': ['شحن بري', 'شحن بحري', 'خدمات لوجستية']
    },
    {
        'name': 'albaraka',
        'nameAr': 'مجموعة البركة',
        'nameEn': 'Al Baraka Group',
        'colors': ['#D89A00', '#FFFFFF'],
        'services': ['خدمات مالية', 'خدمات لوجستية', 'شحن']
    },
    {
        'name': 'alfuttaim',
        'nameAr': 'مجموعة الفطيم',
        'nameEn': 'Al Futtaim Logistics',
        'colors': ['#00559B', '#FFFFFF'],
        'services': ['حلول لوجستية', 'توزيع', 'إدارة سلسلة الإمداد']
    },
    {
        'name': 'alshaya',
        'nameAr': 'مجموعة الشايع',
        'nameEn': 'Alshaya Group',
        'colors': ['#D71920', '#000000'],
        'services': ['شحن وتوزيع', 'خدمات تجارية', 'حلول متكاملة']
    },
    {
        'name': 'bahri',
        'nameAr': 'الشركة الوطنية للشحن',
        'nameEn': 'Bahri - National Shipping',
        'colors': ['#003366', '#FFFFFF'],
        'services': ['شحن بحري', 'شحن بري', 'خدمات لوجستية']
    },
    {
        'name': 'shipco',
        'nameAr': 'ShipCo Transport',
        'nameEn': 'ShipCo Transport',
        'colors': ['#0A5FB4', '#FFFFFF'],
        'services': ['شحن دولي', 'شحن بحري', 'شحن جوي']
    },
    {
        'name': 'hellmann',
        'nameAr': 'Hellmann Worldwide Logistics',
        'nameEn': 'Hellmann Worldwide Logistics',
        'colors': ['#0C4DA2', '#FFFFFF'],
        'services': ['لوجستيات عالمية', 'شحن دولي', 'خدمات متكاملة']
    },
    {
        'name': 'dsv',
        'nameAr': 'DSV Logistics',
        'nameEn': 'DSV Logistics',
        'colors': ['#0056A6', '#FFFFFF'],
        'services': ['شحن جوي', 'شحن بحري', 'نقل بري']
    }
]

def create_hero_image(company):
    """Create hero banner image (1200x600)"""
    width, height = 1200, 600
    img = Image.new('RGB', (width, height), company['colors'][1])
    draw = ImageDraw.Draw(img)

    # Create gradient background
    for y in range(height):
        color_ratio = y / height
        r1, g1, b1 = tuple(int(company['colors'][0][i:i+2], 16) for i in (1, 3, 5))
        r2, g2, b2 = tuple(int(company['colors'][1][i:i+2], 16) for i in (1, 3, 5))
        r = int(r1 * color_ratio + r2 * (1 - color_ratio))
        g = int(g1 * color_ratio + g2 * (1 - color_ratio))
        b = int(b1 * color_ratio + b2 * (1 - color_ratio))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Draw geometric patterns
    for i in range(0, width, 100):
        points = [(i, 0), (i + 50, 200), (i, 200)]
        draw.polygon(points, fill=(255, 255, 255, 30))

    # Add text
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Company name in English (right aligned)
    text_en = company['nameEn']
    bbox = draw.textbbox((0, 0), text_en, font=font_large)
    text_width = bbox[2] - bbox[0]
    draw.text((width - text_width - 60, 150), text_en, fill='white', font=font_large)

    # Company name in Arabic (right aligned)
    text_ar = company['nameAr']
    bbox = draw.textbbox((0, 0), text_ar, font=font_medium)
    text_width = bbox[2] - bbox[0]
    draw.text((width - text_width - 60, 240), text_ar, fill='white', font=font_medium)

    # Services
    y_pos = 320
    for service in company['services'][:3]:
        draw.text((width - 60 - text_width, y_pos), f"• {service}", fill='white', font=font_small)
        y_pos += 35

    # Add logo placeholder
    draw.rectangle([60, 150, 300, 390], fill='white', outline=company['colors'][0], width=3)
    draw.text((180, 255), "LOGO", fill=company['colors'][0], font=font_medium, anchor="mm")

    return img

def create_og_image(company):
    """Create OG image (1200x630)"""
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), company['colors'][1])
    draw = ImageDraw.Draw(img)

    # Create gradient background
    for y in range(height):
        color_ratio = y / height
        r1, g1, b1 = tuple(int(company['colors'][0][i:i+2], 16) for i in (1, 3, 5))
        r2, g2, b2 = tuple(int(company['colors'][1][i:i+2], 16) for i in (1, 3, 5))
        r = int(r1 * color_ratio + r2 * (1 - color_ratio))
        g = int(g1 * color_ratio + g2 * (1 - color_ratio))
        b = int(b1 * color_ratio + b2 * (1 - color_ratio))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Add decorative elements
    for i in range(0, width, 150):
        points = [(i, height), (i + 75, height - 100), (i + 150, height)]
        draw.polygon(points, fill=(255, 255, 255, 40))

    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()

    # Title
    draw.text((60, 180), "خدمات الشحن في دول الخليج", fill='white', font=font_large)

    # Company name
    draw.text((60, 280), company['nameAr'], fill='white', font=font_medium)
    draw.text((60, 340), company['nameEn'], fill='white', font=font_medium)

    # Add logo placeholder
    draw.rectangle([width - 420, 140, width - 120, 440], fill='white', outline=company['colors'][0], width=4)
    draw.text((width - 270, 290), "LOGO", fill=company['colors'][0], font=font_large, anchor="mm")

    return img

# Generate images
print("Generating hero and OG images for companies...")

for company in companies:
    print(f"\nProcessing {company['name']}...")

    # Create hero image
    hero_img = create_hero_image(company)
    hero_path = f"/data/data/com.termux/files/home/payment-omar/src/assets/hero-{company['name']}.jpg"
    hero_img.save(hero_path, "JPEG", quality=95)
    print(f"  ✓ Created hero image: {hero_path}")

    # Create OG image
    og_img = create_og_image(company)
    og_path = f"/data/data/com.termux/files/home/payment-omar/public/og-{company['name']}.jpg"
    og_img.save(og_path, "JPEG", quality=95)
    print(f"  ✓ Created OG image: {og_path}")

print("\n✅ All images generated successfully!")
