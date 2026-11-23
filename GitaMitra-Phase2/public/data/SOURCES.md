# GitaMitra scripture data provenance

This release uses a compiled 701-record corpus from:
https://github.com/chandra-79/gita-learner

The imported source file identifies the following upstream origins:
- Sanskrit, IAST transliteration, English translation and word-by-word glosses: Gita Initiative / gita/gita, with Unlicense attribution noted by the source project.
- Hindi: VedicScriptures Bhagavad Gita dataset. The source project notes mixed per-file licensing; the API source repository is GPL-3.0. Confirm the exact content license and obligations before redistribution.
- Telugu: the source project attributes these translations to prasadkuruma/BhagavadGitaTelugu. A corresponding license file could not be independently confirmed during this build. Do not treat this Telugu content as cleared for public or commercial redistribution until permission/license is confirmed.

The downstream data file has 701 unique chapter/verse keys, with 18 chapters and non-empty Sanskrit, English, Hindi, Telugu and word-by-word fields in all 701 records. It includes a Chapter 13, Verse 1 entry; this numbering convention produces 701 records, while many editions count 700. GitaMitra preserves the supplied numbering and does not silently remove the variant verse.

The word-by-word glosses are in English. They are not complete Hindi or Telugu grammatical glosses. The English explanation feature is generated on demand by AI from the displayed verse and its glosses, and is labelled as an interpretation rather than a traditional commentary.

This is a data provenance note, not legal advice. Review the upstream licenses and obtain any needed permissions before making the website public.
