import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'tapaikobazar',
  title: 'Tapaiko Bazar Studio',

  projectId: 'm8sr7eub',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Tapaiko Bazar Inventory')
          .items([
            S.listItem()
              .title('Electric Vans')
              .child(
                S.documentList()
                  .title('Electric Vans')
                  .filter('_type == "vehicle" && type == "van"')
              ),
            S.listItem()
              .title('Electric Cars')
              .child(
                S.documentList()
                  .title('Electric Cars')
                  .filter('_type == "vehicle" && type == "car"')
              ),
            S.listItem()
              .title('Electric Scooters')
              .child(
                S.documentList()
                  .title('Electric Scooters')
                  .filter('_type == "vehicle" && type == "scooter"')
              ),
            S.listItem()
              .title('Petrol Bikes')
              .child(
                S.documentList()
                  .title('Petrol Bikes')
                  .filter('_type == "vehicle" && type == "bike"')
              ),
            S.divider(),
            S.listItem()
              .title('All Vehicles (Full List)')
              .child(
                S.documentList()
                  .title('All Vehicles')
                  .filter('_type == "vehicle"')
              ),
            ...S.documentTypeListItems().filter(
              (listItem) => !['vehicle'].includes(listItem.getId())
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
