from manim import *


def levy(u, v):
    x = np.array([u, v])
    w = 1 + (x - 1) / 4
    return (
        np.sin(np.pi * w[0]) ** 2
        + np.sum((w[:-1] - 1) ** 2 * (1 + 10 * np.sin(np.pi * w[:-1] + 1) ** 2))
        + (w[-1] - 1) ** 2 * (1 + np.sin(2 * np.pi * w[-1]) ** 2)
    )


def stiblinski(u, v):
    x = np.array([u, v])
    return np.sum(x**4 - 16 * x**2 + 5 * x) / (2 * len(x))


def vggroup_function(bounds_x, bounds_y, func, num_points):
    points = []
    us = np.linspace(bounds_x[0], bounds_x[1], num_points)
    vs = np.linspace(bounds_y[0], bounds_y[1], num_points)
    xs = []
    zs = []
    for u in us:
        for v in vs:
            xs.append((u, v))
            zs.append(func(u, v))
    z_min = min(zs)
    z_max = max(zs)
    for i, (u, v) in enumerate(xs):
        u /= bounds_x[1]
        v /= bounds_y[1]
        z = (zs[i] - z_min) / (z_max - z_min) * 2.0
        points.append(Dot3D(point=np.array([u, v, z]), radius=0.005, color="#657ed4"))
    return VGroup(*points)


class GOB(ThreeDScene):

    def construct(self):
        self.camera.background_color = WHITE
        axes_color = "#69696a"

        n_points_axis = 100
        x_points = [
            Dot3D(point=[x, 0, 1], radius=0.005, color=axes_color)
            for x in np.linspace(-2, 2, n_points_axis)
        ]
        x_axis_cloud = VGroup(*x_points)

        y_points = [
            Dot3D(point=[0, y, 1], radius=0.005, color=axes_color)
            for y in np.linspace(-2, 2, n_points_axis)
        ]
        y_axis_cloud = VGroup(*y_points)

        z_points = [
            Dot3D(point=[0, 0, z], radius=0.005, color=axes_color)
            for z in np.linspace(-1, 3, n_points_axis)
        ]
        z_axis_cloud = VGroup(*z_points)

        n_points = 50

        square_cloud = vggroup_function(
            [-1, 1], [-1, 1], lambda u, v: u**2 + v**2, n_points
        )
        stiblinski_cloud = vggroup_function([-5, 5], [-5, 5], stiblinski, n_points)

        levy_cloud = vggroup_function([-10, 10], [-10, 10], levy, n_points)

        box = Cube(side_length=2, fill_opacity=0, stroke_color=WHITE, stroke_width=2)
        box.move_to([0, 0, 1])

        self.set_camera_orientation(
            phi=60 * DEGREES, theta=50 * DEGREES, zoom=3.7, frame_center=[0, 0, 1]
        )

        self.add(square_cloud, x_axis_cloud, z_axis_cloud, y_axis_cloud)

        duration = 15
        self.begin_ambient_camera_rotation(rate=2 * PI / duration)

        self.wait(4)

        self.play(Transform(square_cloud, stiblinski_cloud), run_time=1)

        self.wait(4)

        self.play(Transform(square_cloud, levy_cloud), run_time=1)

        self.wait(4)

        square_cloud_final = vggroup_function(
            [-1, 1], [-1, 1], lambda u, v: u**2 + v**2, n_points
        )

        self.play(Transform(square_cloud, square_cloud_final), run_time=1)
