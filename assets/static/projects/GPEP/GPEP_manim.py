from manim import *
from reactive_manim import *


def set_color(texs, color):
    for tex in texs:
        tex.set_color(color)


def angle(tex):
    return MathTex(r"\langle", tex, r"\rangle")


class GPEP(MovingCameraScene):
    def construct(self):
        self.camera.background_color = WHITE
        self.camera.frame.set(width=25)

        x = MathTex("x")
        y = MathTex("y")
        fx = Function(r"f", x)
        fy = Function(r"f", y)
        gfx = Function(r"\nabla f", x)
        gfy = Function(r"\nabla f", y)

        lhs_color = "#d4bb65"
        rhs_color = "#657ed4"

        def convex():
            lhs = MathTex(gfy, r"\cdot", Parentheses(MathTex(x, "-", y)))
            rhs = MathTex(fx, "-", fy)
            set_color(lhs, lhs_color)
            set_color(rhs, rhs_color)
            res = MathTex(lhs, r"\le", rhs)
            set_color([res[1]], BLACK)
            return res

        def smooth():
            L = MathTex("L")
            norm_x = MathTex(
                Fraction(L, "4"), Term(MathTex(r"\|", x, r"-", y, r"\|"), "2", "2")
            )
            dot = MathTex(
                Fraction("1", "2"), angle(MathTex(gfx, "+", gfy, ",", x, "-", y))
            )
            norm_grad = MathTex(
                Fraction("1", MathTex("4", L)),
                Term(MathTex(r"\|", gfx, "-", gfy, r"\|"), "2", "2"),
            )

            lhs = MathTex("-", norm_x, "-", dot, "+", norm_grad)
            rhs = MathTex(fx, "-", fy)
            set_color(lhs, lhs_color)
            set_color(rhs, rhs_color)
            res = MathTex(lhs, r"\le", rhs)
            set_color([res[1]], BLACK)
            return res

        def smooth_strongly_convex():
            L = MathTex("L")
            mu = MathTex(r"\mu")
            dot = angle(MathTex(gfy, ",", x, "-", y))
            norm_grad = MathTex(
                Fraction("1", MathTex("2", L)),
                Term(MathTex(r"\|", gfx, "-", gfy, r"\|"), "2", "2"),
            )
            frac_mu = Fraction(
                mu, MathTex("2", Parentheses(MathTex("1 -", Fraction(mu, L))))
            )
            norm_x = MathTex(
                frac_mu,
                MathTex(
                    r"\|",
                    x,
                    "-",
                    y,
                    "-",
                    Fraction("1", L),
                    Parentheses(MathTex(gfx, "-", gfy)),
                    Term(r"\|", "2", "2"),
                ),
            )

            lhs = MathTex(dot, "+", norm_grad, "+", norm_x)
            rhs = MathTex(fx, "-", fy)
            set_color(lhs, lhs_color)
            set_color(rhs, rhs_color)
            res = MathTex(lhs, r"\le", rhs)
            set_color([res[1]], BLACK)
            return res

        # make background white
        tex = convex()
        self.add(tex)
        self.wait(2)

        smooth_tex = smooth()
        tex[0] = smooth_tex[0]
        tex[2] = smooth_tex[2]
        self.play(TransformInStages.progress(tex, lag_ratio=0.6))
        self.wait(2)

        smooth_strongly_convex_tex = smooth_strongly_convex()
        tex[0] = smooth_strongly_convex_tex[0]
        tex[2] = smooth_strongly_convex_tex[2]
        self.play(TransformInStages.progress(tex, lag_ratio=0.6))
        self.wait(2)

        convex_tex = convex()
        tex[0] = convex_tex[0]
        tex[2] = convex_tex[2]
        self.play(TransformInStages.progress(tex, lag_ratio=0.6))
