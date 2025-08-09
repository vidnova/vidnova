import { GeoJsonImporter } from '../geo-json-importer';

(async function () {
  const regionsPath = process.argv[2] || 'data/geojson/ukraine_regions.geojson';
  const settlementsPath =
    process.argv[3] || 'data/geojson/ukraine_settlements.geojson';

  const importer = new GeoJsonImporter();

  try {
    await importer.connect();

    console.log('Import regions');
    await importer.importRegions(regionsPath);

    console.log('Import settlements');
    await importer.importSettlements(settlementsPath);

    console.log('Import complete');
  } catch (error) {
    console.error('Failed to import data', error);
    process.exit(1);
  } finally {
    await importer.disconnect();
  }
})();
