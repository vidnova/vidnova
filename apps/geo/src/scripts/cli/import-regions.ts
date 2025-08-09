import { GeoJsonImporter } from '../geo-json-importer';

(async function () {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log('Usage: yarn run import:regions <path-to-regions.geojson>');
    process.exit(1);
  }

  const importer = new GeoJsonImporter();

  try {
    await importer.connect();
    await importer.importRegions(filePath);
    console.log('Region import complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await importer.disconnect();
  }
})();
