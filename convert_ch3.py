from PIL import Image
import os

mappings = [
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/covers/echo_cover_ch3_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/covers/echo_cover_ch3_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_survey_design_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_survey_design_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_sampling_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_sampling_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_data_results_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_data_results_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_fail_bg_v1.webp.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_fail_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_complete_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch3/echo_ch3_complete_bg_v1.webp"),
]

for src, dst in mappings:
    try:
        if os.path.exists(src):
            with Image.open(src) as img:
                img.save(dst, "WEBP", quality=80)
                print(f"Converted: {src} -> {dst}")
        else:
            print(f"File not found: {src}")
    except Exception as e:
        print(f"Error converting {src}: {e}")
