# GitaMitra — Phase 2 source bundle

This is the project source snapshot for the Phase 2 implementation.

## Included
- Frontend: chapter catalogue, verse reader, Sanskrit text, English/Hindi/Telugu translation selection, IAST transliteration, search, word-by-word English glosses.
- Backend: verse explanation endpoint and Ask Krishna endpoint.
- Database migration and source/licensing notes.
- A script to fetch the compiled multilingual corpus from the upstream source repository.

## Important setup notes
1. This is the Hatchable project source, not a standalone static website. The API files import the Hatchable SDK (`hatchable`) and need to run inside Hatchable or be adapted to another backend.
2. The deployed database was populated with 701 unique records. The dataset itself is not embedded in this ZIP because it is a large source file; run `node scripts/fetch-data.mjs` to fetch the upstream data and generate `public/data/gita-multilingual.js`.
3. The compiled corpus contains 701 records because it includes Chapter 13, Verse 1. Many editions count 700. This project preserves the imported source numbering.
4. The word-by-word glosses are English glosses, not complete Hindi or Telugu grammatical glosses.
5. The Telugu translation's redistribution license was not independently confirmed. Do not publicly redistribute the Telugu content until the rights are confirmed.
6. AI-powered detailed explanations and Ask Krishna require an OpenAI provider configured in the Hatchable project settings.

## Generate the data file
```bash
node scripts/fetch-data.mjs
```

Upstream compiled dataset:
https://github.com/chandra-79/gita-learner

See `public/data/SOURCES.md` for provenance and license caveats.
