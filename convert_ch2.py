from PIL import Image
import os

mappings = [
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/covers/echo_cover_ch2_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/covers/echo_cover_ch2_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_meeting_spot_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_interview_prep_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_silence_tension_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_interview_conflict_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_conflicting_versions_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_compare_notes_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_fail_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_fail_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_complete_bg_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_complete_bg_v1.webp"),
    ("/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_conversation_table_v1.png", "/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/public/assets/echo/backgrounds/ch2/echo_ch2_conversation_table_v1.webp"),
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
