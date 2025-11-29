#!/bin/bash
# Generate hero and OG images for shipping companies

cd /data/data/com.termux/files/home/payment-omar

companies=(
    "genacom:#E82424:#F7C24A:جيناكم:Genacom Oman"
    "albaraka:#D89A00:#FFFFFF:مجموعة البركة:Al Baraka Group"
    "alfuttaim:#00559B:#FFFFFF:مجموعة الفطيم:Al Futtaim Logistics"
    "alshaya:#D71920:#000000:مجموعة الشايع:Alshaya Group"
    "bahri:#003366:#FFFFFF:الشركة الوطنية للشحن:Bahri - National Shipping"
    "shipco:#0A5FB4:#FFFFFF:ShipCo Transport:ShipCo Transport"
    "hellmann:#0C4DA2:#FFFFFF:Hellmann Worldwide Logistics:Hellmann Worldwide Logistics"
    "dsv:#0056A6:#FFFFFF:DSV Logistics:DSV Logistics"
)

echo "Creating hero and OG images for companies..."

for company in "${companies[@]}"; do
    IFS=':' read -r name color1 color2 name_ar name_en <<< "$company"

    echo "Processing $name..."

    # Create hero image (1200x600)
    magick -size 1200x600 \
        -define gradient:direction=south \
        gradient:"$color2-$color1" \
        -fill "rgba(255,255,255,0.1)" \
        -draw "rectangle 0,0 1200,200" \
        -pointsize 72 -fill white \
        -gravity west \
        -annotate +100+150 "$name_en" \
        -pointsize 48 \
        -annotate +100+240 "$name_ar" \
        -pointsize 32 \
        -annotate +100+320 "خدمات شحن ولوجستيات متكاملة" \
        src/assets/hero-"$name".jpg

    # Create OG image (1200x630)
    magick -size 1200x630 \
        -define gradient:direction=south \
        gradient:"$color2-$color1" \
        -fill "rgba(255,255,255,0.15)" \
        -draw "polygon 0,630 1200,530 1200,630" \
        -fill "rgba(255,255,255,0.15)" \
        -draw "polygon 0,630 1200,430 1200,530" \
        -pointsize 64 -fill white \
        -gravity west \
        -annotate +80+150 "خدمات الشحن في دول الخليج" \
        -pointsize 48 \
        -annotate +80+240 "$name_ar" \
        -annotate +80+300 "$name_en" \
        public/og-"$name".jpg

    echo "  ✓ Created hero-src/assets/hero-$name.jpg"
    echo "  ✓ Created OG-public/og-$name.jpg"
done

echo ""
echo "✅ All images created successfully!"
