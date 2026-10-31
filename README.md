![Statify Cover Image](https://res.cloudinary.com/zs1l3nt/image/upload/repositories/web-react-statify.png)

# Statify

![License](https://img.shields.io/github/license/zS1L3NT/web-react-statify?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/web-react-statify?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/web-react-statify?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/web-react-statify?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/web-react-statify?style=for-the-badge)

Statify is a Spotify listening statistics checking website available [here](https://statify.zectan.com). Just sign into your Spotify account and you will be able to see your top tracks, artists and recent tracks. Click on a Track, Artist or Album to view more details about it.

## Motivation

I love looking at my Spotify statistics. I enjoy seeing what track I'm listening to the most across different time periods. I used to use [StatsForSpotify](https://statsforspotify.com) to check my listening history on Spotify. However, the UI looked terrible and it didn't support progressive web applications, meaning I can install on my phone.

Building Statify allowed me to view my Spotify listening statistics with a much nicer UI than StatsForSpotify.

## Features

-   Progressive Web Application
-   Authentication state saves on refresh
-   Light mode or Dark mode
-   Top Tracks
    -   Last Month
    -   Last 6 Months
    -   All Time
-   Top Artists
    -   Last Month
    -   Last 6 Months
    -   All Time
-   Recently Played
    -   Last 50
-   Information about a
    -   Track
    -   Artist
    -   Album

## Usage

```
$ npm i
$ npm run dev
```

Open `http://127.0.0.1:5173` for local development. Spotify does not accept
`localhost` callback URLs. In the Spotify developer dashboard for the client ID
in `src/utils/spotifyAuth.ts`, register these exact redirect URIs:

- `https://statify.zectan.com/login` (production)
- `http://127.0.0.1:5173/login` (development)

Hosted previews sign in and return on their own origin. Before testing a preview,
register its exact HTTPS URL followed by `/login` in Spotify's redirect URIs.
Use Vercel's stable branch URL to avoid registering a new URL for every deployment.
Open that same registered branch URL when testing.

Sign-in uses [authorization code with PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
in the browser. No client secret or backend is needed. Access tokens, expiry, and
refresh tokens are saved when Spotify returns them; expired tokens refresh before
API requests. Existing implicit-flow sessions require one new sign-in after upgrading.

Run auth regression tests with `bun test`, and verify the production build with
`npm run build`.

## Credits

[@Shockch4rge](https://github.com/Shockch4rge) introduced me to `@reduxjs/toolkit` which improved my productivity in Redux.
Overlapping elements was simplified for me thanks to [this](https://css-tricks.com/how-to-stack-elements-in-css/) article

## Build with

-   TypeScript
	-   TypeScript
        -   [![@types/luxon](https://img.shields.io/badge/%40types%2Fluxon-%5E3.2.0-red?style=flat-square)](https://npmjs.com/package/@types/luxon/v/3.2.0)
        -   [![@types/react](https://img.shields.io/badge/%40types%2Freact-%5E18.0.28-red?style=flat-square)](https://npmjs.com/package/@types/react/v/18.0.28)
        -   [![@types/react-dom](https://img.shields.io/badge/%40types%2Freact--dom-%5E18.0.11-red?style=flat-square)](https://npmjs.com/package/@types/react-dom/v/18.0.11)
        -   [![@types/react-lazyload](https://img.shields.io/badge/%40types%2Freact--lazyload-%5E3.2.0-red?style=flat-square)](https://npmjs.com/package/@types/react-lazyload/v/3.2.0)
        -   [![@types/react-redux](https://img.shields.io/badge/%40types%2Freact--redux-%5E7.1.25-red?style=flat-square)](https://npmjs.com/package/@types/react-redux/v/7.1.25)
        -   [![@types/react-router-dom](https://img.shields.io/badge/%40types%2Freact--router--dom-%5E5.3.3-red?style=flat-square)](https://npmjs.com/package/@types/react-router-dom/v/5.3.3)
        -   [![@typescript-eslint/eslint-plugin](https://img.shields.io/badge/%40typescript--eslint%2Feslint--plugin-latest-red?style=flat-square)](https://npmjs.com/package/@typescript-eslint/eslint-plugin/v/latest)
        -   [![@typescript-eslint/parser](https://img.shields.io/badge/%40typescript--eslint%2Fparser-latest-red?style=flat-square)](https://npmjs.com/package/@typescript-eslint/parser/v/latest)
        -   [![ts-node](https://img.shields.io/badge/ts--node-latest-red?style=flat-square)](https://npmjs.com/package/ts-node/v/latest)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E5.1.6-red?style=flat-square)](https://npmjs.com/package/typescript/v/5.1.6)
	-   React
        -   [![react](https://img.shields.io/badge/react-%5E18.2.0-red?style=flat-square)](https://npmjs.com/package/react/v/18.2.0)
        -   [![react-dom](https://img.shields.io/badge/react--dom-%5E18.2.0-red?style=flat-square)](https://npmjs.com/package/react-dom/v/18.2.0)
        -   [![react-ga4](https://img.shields.io/badge/react--ga4-%5E2.0.0-red?style=flat-square)](https://npmjs.com/package/react-ga4/v/2.0.0)
        -   [![react-lazyload](https://img.shields.io/badge/react--lazyload-%5E3.2.0-red?style=flat-square)](https://npmjs.com/package/react-lazyload/v/3.2.0)
        -   [![react-router-dom](https://img.shields.io/badge/react--router--dom-%5E6.8.1-red?style=flat-square)](https://npmjs.com/package/react-router-dom/v/6.8.1)
        -   [![react-use-is-online](https://img.shields.io/badge/react--use--is--online-%5E1.2.1-red?style=flat-square)](https://npmjs.com/package/react-use-is-online/v/1.2.1)
	-   MUI
        -   [![@emotion/react](https://img.shields.io/badge/%40emotion%2Freact-%5E11.10.6-red?style=flat-square)](https://npmjs.com/package/@emotion/react/v/11.10.6)
        -   [![@emotion/styled](https://img.shields.io/badge/%40emotion%2Fstyled-%5E11.10.6-red?style=flat-square)](https://npmjs.com/package/@emotion/styled/v/11.10.6)
        -   [![@mui/icons-material](https://img.shields.io/badge/%40mui%2Ficons--material-%5E5.11.9-red?style=flat-square)](https://npmjs.com/package/@mui/icons-material/v/5.11.9)
        -   [![@mui/lab](https://img.shields.io/badge/%40mui%2Flab-5.0.0--alpha.120-red?style=flat-square)](https://npmjs.com/package/@mui/lab/v/5.0.0-alpha.120)
        -   [![@mui/material](https://img.shields.io/badge/%40mui%2Fmaterial-%5E5.11.9-red?style=flat-square)](https://npmjs.com/package/@mui/material/v/5.11.9)
	-   Redux
        -   [![@reduxjs/toolkit](https://img.shields.io/badge/%40reduxjs%2Ftoolkit-%5E1.9.2-red?style=flat-square)](https://npmjs.com/package/@reduxjs/toolkit/v/1.9.2)
        -   [![react-redux](https://img.shields.io/badge/react--redux-%5E8.0.5-red?style=flat-square)](https://npmjs.com/package/react-redux/v/8.0.5)
	-	ESLint
        -   [![eslint](https://img.shields.io/badge/eslint-latest-red?style=flat-square)](https://npmjs.com/package/eslint/v/latest)
        -   [![eslint-config-prettier](https://img.shields.io/badge/eslint--config--prettier-latest-red?style=flat-square)](https://npmjs.com/package/eslint-config-prettier/v/latest)
        -   [![eslint-plugin-react](https://img.shields.io/badge/eslint--plugin--react-latest-red?style=flat-square)](https://npmjs.com/package/eslint-plugin-react/v/latest)
        -   [![eslint-plugin-simple-import-sort](https://img.shields.io/badge/eslint--plugin--simple--import--sort-latest-red?style=flat-square)](https://npmjs.com/package/eslint-plugin-simple-import-sort/v/latest)
        -   [![prettier](https://img.shields.io/badge/prettier-latest-red?style=flat-square)](https://npmjs.com/package/prettier/v/latest)
	-   Vite
        -   [![@vitejs/plugin-react](https://img.shields.io/badge/%40vitejs%2Fplugin--react-%5E3.1.0-red?style=flat-square)](https://npmjs.com/package/@vitejs/plugin-react/v/3.1.0)
        -   [![vite](https://img.shields.io/badge/vite-%5E4.1.1-red?style=flat-square)](https://npmjs.com/package/vite/v/4.1.1)
        -   [![vite-plugin-pwa](https://img.shields.io/badge/vite--plugin--pwa-%5E0.14.4-red?style=flat-square)](https://npmjs.com/package/vite-plugin-pwa/v/0.14.4)
        -   [![workbox-window](https://img.shields.io/badge/workbox--window-%5E6.5.4-red?style=flat-square)](https://npmjs.com/package/workbox-window/v/6.5.4)
	-   Miscellaneous
        -   [![axios](https://img.shields.io/badge/axios-%5E1.3.3-red?style=flat-square)](https://npmjs.com/package/axios/v/1.3.3)
        -   [![bun-types](https://img.shields.io/badge/bun--types-%5E1.0.21-red?style=flat-square)](https://npmjs.com/package/bun-types/v/1.0.21)
        -   [![luxon](https://img.shields.io/badge/luxon-%5E3.2.1-red?style=flat-square)](https://npmjs.com/package/luxon/v/3.2.1)
        -   [![posthog-js](https://img.shields.io/badge/posthog--js-%5E1.96.1-red?style=flat-square)](https://npmjs.com/package/posthog-js/v/1.96.1)
        -   [![spotify-web-api-js](https://img.shields.io/badge/spotify--web--api--js-%5E1.5.2-red?style=flat-square)](https://npmjs.com/package/spotify-web-api-js/v/1.5.2)
