#!/usr/bin/env node
// Seeds the demo pieces. Requires DATABASE_URL (written by
// `stripe projects add neon/postgres`). Safe to re-run: it deletes the demo
// author's rows first, so slugs stay stable-ish and nothing duplicates.
//
//   node scripts/seed.mjs

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

// Minimal .env reader so the script needs no extra dependency.
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, raw] = match;
      if (!process.env[key]) {
        process.env[key] = raw.replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no such file, fine
  }
}

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Run `stripe projects add neon/postgres` first."
  );
  process.exit(1);
}

const DEMO_USER = "demo|leaflet";

const PIECES = [
  {
    title: "Inventory of a Borrowed Room",
    type: "poem",
    template: "verse",
    slug: "inventory-of-a-borrowed-room",
    body: `A kettle that whistles in the wrong key.
Two chairs, one of them honest.

The window keeps a rectangle of weather
and hands it back at six.

I have learned the floor's opinions —
which board complains, which one forgives.

Nothing here is mine.
Everything here has agreed to hold me
for as long as the lease pretends.

At night the radiator says a name.
Not mine. I answer anyway.`,
  },
  {
    title: "The Cartographer's Daughter",
    type: "fiction",
    template: "broadsheet",
    slug: "the-cartographers-daughter",
    body: `My father drew coastlines for a living, and he drew them wrong on purpose. Every mapmaker does it — a phantom island, a street that was never paved, a lake shaped like nothing. Copyright traps, he called them. If a rival ever printed his mistake, he would know exactly where they had stolen it from.

He put one on every map he made. Forty-one years of them.

After he died I found the ledger where he had recorded each invention: coordinates, the name he had given it, the date. Bellweather Shoal. Ossian's Reach. A hamlet in the Cairngorms called Little Mercy, population, in his handwriting, "1."

I drove to Little Mercy in October. There is a road that goes there, or nearly there, and then the road becomes a track and the track becomes a field, and in the field there is a stone wall enclosing nothing at all — no house, no foundation, just an idea of a boundary that somebody once took seriously.

I sat on the wall until it got dark. I thought about the men who had copied him, who had printed his lies and been caught by them, who had put Little Mercy in their atlases because he said it was there. For a while, in a small way, it was.

That is the part he never wrote in the ledger. A trap only works if somebody walks into it. Forty-one years he spent making places that did not exist, and the whole time what he was really doing was making them exist a little.

I have the ledger still. I have not added to it. But I have not thrown it out either, and some nights I take it down and read the coordinates aloud, the way you would read a list of people you had loved and outlived.`,
  },
  {
    title: "On Rereading a Book You Have Already Underlined",
    type: "review",
    template: "reader",
    slug: "on-rereading-a-book-you-have-already-underlined",
    body: `There is a specific embarrassment in opening a book you loved at twenty-two and finding your own pencil waiting for you. The underlinings are confident. They are also, almost without exception, in the wrong places.

What the younger reader marked were the sentences that sounded like conclusions. Aphorisms, mostly — the parts that could be repeated at a party. What the older reader notices is that the book spends most of its length quietly undermining exactly those sentences, and that the author has arranged them as bait.

This is not a failure of the younger reader. It is what a first reading is for. You cannot see a structure while you are still inside it looking for handholds.

The second reading is a different genre altogether. The plot is spent, so attention drifts to the joinery: how long the author is willing to hold a scene before releasing it, where the paragraph breaks fall, which character is given the last clause of a chapter. You start to read for decisions rather than events.

What I cannot decide is whether to erase the pencil. The marks are wrong and they are also evidence — the only surviving record of a person who read this in a rented room and believed it was about him. He was not entirely mistaken. He was just early.

So the marks stay. The book is now two books, bound together and disagreeing, and the disagreement is the most interesting thing in it.`,
  },
];

const sql = neon(process.env.DATABASE_URL);

const existing = await sql`select 1 from pieces limit 0`.catch((error) => {
  console.error(
    "Could not query `pieces`. Paste schema.sql into the Neon console first."
  );
  console.error(error.message);
  process.exit(1);
});
void existing;

await sql`delete from pieces where user_id = ${DEMO_USER}`;

for (const piece of PIECES) {
  await sql`
    insert into pieces (user_id, title, type, template, body, image_url, slug)
    values (${DEMO_USER}, ${piece.title}, ${piece.type}, ${piece.template},
            ${piece.body}, null, ${piece.slug})
  `;
  console.log(`  /p/${piece.slug}  ${piece.template.padEnd(10)} ${piece.title}`);
}

console.log(`\nSeeded ${PIECES.length} pieces.`);
