import { databaseConfig } from '../config/database.config';
import { GeoJsonImporter } from '../scripts';

(async function () {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log(
      'Usage: yarn run import:settlements <path-to-settlements.geojson>',
    );
    process.exit(1);
  }

  const importer = new GeoJsonImporter(databaseConfig);

  try {
    await importer.connect();
    await importer.importSettlements(filePath);
    console.log('Settlement import complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await importer.disconnect();
  }
})();
