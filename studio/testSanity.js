import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'm8sr7eub',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function run() {
  try {
    const res = await client.fetch('*[_type == "vehicle"]');
    console.log('SUCCESS! Vehicles currently in Sanity production dataset:', res.length);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

run();
