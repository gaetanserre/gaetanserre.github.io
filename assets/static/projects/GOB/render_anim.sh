set -e -x

manim -r "500,500" GOB_manim.py --disable_caching

ffmpeg -i media/videos/GOB_manim/500p60/GOB.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus ./GOB.webm