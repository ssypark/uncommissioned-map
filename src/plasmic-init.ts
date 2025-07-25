import { initPlasmicLoader } from "@plasmicapp/loader-react";
import { MapPage } from "./components/MapPage";
import { ArtistPage } from "./components/ArtistPage"; // Add this import

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "kYhStUHud2U6C7LY3e64Yk",  // ID of a project you are using
      token: "BJwKfHXxWopOaiiv4oJ5O9nWGyStw2fEJq3C732Lk6M2lYuxPvBJEMylGfBmOaWtzbx09thq3tcxZX4tbcPB6w"  // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})

import { MapPage } from './components/MapPage';

PLASMIC.registerComponent(MapPage, {
  name: 'MapPage',
  props: {
    className: 'string',
  }
});

PLASMIC.registerComponent(ArtistPage, {
  name: "ArtistPage",
  props: {
    className: "string",
  },
});