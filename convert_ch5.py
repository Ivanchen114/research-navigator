from PIL import Image
import os

mappings = [
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/covers/echo_cover_ch5_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/covers/echo_cover_ch5_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_reenactment_setup_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_experiment_design_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_control_variables_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_unexpected_result_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_forgery_test_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_report_writing_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_fail_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_fail_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_complete_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch5/echo_ch5_complete_bg_v1.webp"),
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
