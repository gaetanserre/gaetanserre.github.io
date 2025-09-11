#let title_count = counter("title_count")
#let alternate_title = state("alternate_title", true)

#let config(picture, name, about, mail, git_username, phone_no, accent: rgb("#98B9F2"), alternate: true, doc) = {
  set page(paper: "a4", margin: (top: 1cm, bottom: 1cm, rest: 1.5cm))
  set text(lang: "en", font: "SF Pro Display", size: 10pt)
  set par(justify: true)

  set list(indent: 1em, spacing: 2em)

  grid(
    columns: (auto, auto),
    column-gutter: 1em,
    align(
      horizon,
      [
        #text(size: 20pt, name)
        #v(-1.3em)
        #repeat(text(size: 15pt, fill: accent, [-]))
        #set text(size: 10pt)
        #v(-1em)
        #about \
        #set text(font: "CMU Typewriter Text")
        #show link: set text(fill: rgb("#657ED4"))
        #grid(
          columns: (45%, 30%, 25%),
          align(left, link("mailto:" + mail)),
          align(left, link("https://github.com/" + git_username, "github.com/" + git_username)),
          align(right, link("tel:" + phone_no)),
        )
      ],
    ),
    align(
      left,
      box(clip: true, stroke: 2pt + accent, radius: 0.8cm, width: 3cm, height: 3cm, image(picture)),
    ),
  )

  show link: it => {
    underline(offset: 4pt, stroke: 1pt + accent, it)
  }

  alternate_title.update(alternate)

  doc
}

#let section_title(title, accent: rgb("#98B9F2")) = context {
  let c1 = box(stroke: 2pt + accent, inset: 0.5em, radius: 5pt, align(left, text(size: 15pt, title)))
  let c2 = align(horizon, v(0.2em) + box(width: 100%, height: 2pt, fill: accent, radius: 1pt))

  let count = title_count.get().at(0)

  if calc.rem-euclid(count, 2) == 1 and alternate_title.at(here()) {
    grid(
      columns: (auto, auto),
      column-gutter: 0em,
      inset: (top: 1em, bottom: 1em, rest: 0em),
      c2, c1,
    )
  } else {
    grid(
      columns: (auto, auto),
      column-gutter: 0em,
      inset: (top: 1em, bottom: 1em, rest: 0em),
      c1, c2,
    )
  }
  title_count.step()
}

#let paper_entry(paper, url, location, date) = {
  [
    - #grid(
        columns: (85%, 15%),
        align(left, link(url, paper)), align(right, text(fill: gray, location + " — " + date)),
      )
  ]
}

#let education_entry(title, location, date) = {
  [
    - #grid(
        columns: (70%, 30%),
        align(left, text(title)), align(right, text(fill: gray, location + " — " + date)),
      )
  ]
}

#let project_entry(title, desc, url) = {
  [
    - #grid(
        columns: (90%, 10%),
        align(left, text(font: "Fira Code", fill: gray, smallcaps(title)) + " - " + desc),
        align(right, link(url, text(fill: gray, [Git]))),
      )
  ]
}
