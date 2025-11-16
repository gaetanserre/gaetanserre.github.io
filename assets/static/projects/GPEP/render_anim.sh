set -e -x

manim -r "2000,400" GPEP_manim.py --disable_caching

ffmpeg -i media/videos/GPEP_manim/400p60/GPEP.mp4 -c:v libvpx-vp9 -crf 50 -b:v 0 -b:a 128k -c:a libopus ./GPEP.webm