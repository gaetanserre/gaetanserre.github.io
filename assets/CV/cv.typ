#import "template_cv.typ": *

#show: doc => config(
  "dither_pp.png",
  [Gaëtan Serré],
  [PhD student in mathematics at Centre Borelli, École Normale Supérieure Paris-Saclay.],
  "gaetan.serre@ens-paris-saclay.fr",
  "gaetanserre",
  "+33 6 74 52 00 93",
  alternate: false,
  doc,
)

#section_title([About])
#v(-1em)
I am working on convergent approximation methods for global optimization. My main research interests are consistency of global optimization methods, measure theory, and stochastic differential equations. I am currently working on my thesis with Nicolas Vayatis. In parallel, I use Lean to formalize research results and I am contributing to Mathlib, its mathematics library. With a strong background in computer science, I have solid expertise in both object-oriented and functional programming. My GitHub portfolio features a wide range of projects, spanning from neural network implementations to a compiler for assembly language.
#v(-1em)

#section_title([Papers])
#paper_entry(
  [Formal equivalence between global optimization consistency and random search],
  "https://arxiv.org/qbs/2508.20671",
  "arXiv",
  "2025",
)

#paper_entry(
  [Stein Boltzmann Sampling: A Variational Approach for Global Optimization],
  "https://arxiv.org/abs/2402.04689",
  "AISTATS",
  "2025",
)

#paper_entry(
  [LIPO+: Frugal Global Optimization for Lipschitz Functions],
  "https://dl.acm.org/doi/full/10.1145/3688671.3688763",
  "SETN",
  "2024",
)

#paper_entry(
  [Improvements of Global Optimization Algorithms for Lipschitz Functions],
  "https://www.ipol.im/pub/pre/469/",
  "IPOL",
  "2023",
)

#section_title([Education])

#education_entry(
  [PhD in Mathematics, Global Optimization],
  [Centre Borelli],
  [Present],
)

#education_entry(
  [M2 Mathématiques, Vision, Apprentissage],
  [ENS Paris-Saclay],
  [2023],
)

#education_entry(
  [M1 Artificial Intelligence],
  [Université Paris-Saclay],
  [2022],
)

#education_entry(
  [Double Bachelor in Mathematics and Computer Science],
  [Université Paris-Saclay],
  [2021],
)

#section_title([Projects])

#project_entry(
  [GOB],
  [A collection of global optimization algorithms implemented in C++ and linked with Python.],
  "https://github.com/gaetanserre/GOB",
)

#project_entry(
  [SBS-PROOFS],
  [Formalization of some results of #link("https://arxiv.org/abs/2402.04689", [SBS]) using Lean 4.],
  "https://github.com/gaetanserre/SBS-Proofs",
)

#project_entry(
  [LEAN-LIPO],
  [Formalization of the #link("https://dl.acm.org/doi/full/10.1145/3688671.3688763", [LIPO's reject probability upper bound]) using Lean 4.],
  "https://github.com/gaetanserre/Lean-LIPO",
)

#project_entry(
  [ViTDet-to-Pose],
  [A extension of the ViTDet architecture for human pose estimation.],
  "https://github.com/gaetanserre/ViTDet-to-Pose",
)

#project_entry(
  [GAiA],
  [A chess engine using a deep neural network to evaluate chess positions.],
  "https://github.com/gaetanserre/GAiA",
)

#section_title([Programming skills])

#block(
  height: 1em,
  columns(
    5,
    [
      #align(left, [- Python])
      #align(left, [- C++])
      #align(left, [- Lean 4])
      #align(left, [- PyTorch])
      #align(left, [- Scikit-learn])
    ],
  ),
)
