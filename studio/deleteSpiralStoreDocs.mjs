import { createClient } from '@sanity/client';
import readline from 'readline';

const client = createClient({
  projectId: '2d11qnju',
  dataset: 'development',
  useCdn: false,
  apiVersion: '2023-01-01',
  // token: '',
});

const typesToDelete = [
  'spiralStoreFontVariantFile',
  'spiralStoreFontVariant',
  'spiralStoreFontCollection'
];

const askYesNo = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    })
  );
};

const deleteDocumentsByType = async (type) => {
  const docs = await client.fetch(`*[_type == "${type}"]{_id}`);
  if (docs.length === 0) {
    console.log(`No documents found for type: ${type}`);
    return;
  }

  console.log(`\nFound ${docs.length} document(s) of type "${type}":`);
  docs.forEach((doc) => console.log(`- ${doc._id}`));

  const confirm = await askYesNo(`Delete all ${docs.length} "${type}" documents?`);
  if (!confirm) {
    console.log(`Skipping deletion of "${type}" documents.`);
    return;
  }

  for (const doc of docs) {
    try {
      await client.delete(doc._id);
      console.log(`✅ Deleted: ${doc._id}`);
    } catch (error) {
      console.error(`❌ Error deleting ${doc._id}:`, error);
    }
  }
};

const run = async () => {
  for (const type of typesToDelete) {
    await deleteDocumentsByType(type);
  }
  console.log('\nAll done.');
};

run();
