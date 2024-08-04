# Harmonize

## The App
Welcome to Harmonize, the ultimate social experience for music lovers! Sign in with your Spotify account and dive into a vibrant community of music enthusiasts. Follow your friends to discover the songs they’re loving, or share your own favorite tracks with personalized posts. Connect, share, and celebrate music together with Harmonize!

## Features
<video width="640" height="480" controls>
  <source src="src/img/Spotify Sharing Landing.mov" type="video/mp4">
</video>

## Architecture
- [Frontend](https://harmonize-client.onrender.com) - [(Repo)](https://github.com/dartmouth-cs52-24s/project-client-spotify-sharing):
  - Node.js
  - React
  - Zustand for state management
  - Chakra UI - Frontend Components Library
  - Spotify API - Authorization and using data
- [Backend](https://project-api-spotify-sharing.onrender.com) - [(Repo)](https://github.com/dartmouth-cs52-24s/project-api-spotify-sharing)
  - MongoDB
  - Express

## Setup
### Frontend:
- Clone Repo, npm install, npm run dev
- In src/store/profile-slice.js, ensure that the ROOT_URL points to whichever backend/DB you want to use (default is the deployed backend).
- To gain access to the Spotify API Client ID (in src/utils/SpotifyAuth.js), ask Brendan to add you to the Spotify API app. Alternatively, [create](https://developer.spotify.com/dashboard/create) a new Spotify API app and set the Redirect URI to the /home page of your Frontend (could be [http://localhost:5173/home](http://localhost:5173/home)) or the deployed url. Select the Web API and Web Playback SDK options. Note: Users must have Spotify Premium to access the Web Playback SDK Features (playing music in app).

### Backend:
- Clone Repo, npm install, npm start
- Make sure your frontend is pointing to the correct backend (ROOT_URL in src/store/profile-slice.js of the frontend), should end in /api.

## Deployment
### Frontend:
- Create a static site using the [frontend](https://github.com/dartmouth-cs52-24s/project-client-spotify-sharing) on Render.
- Use the main branch
- Build Command: npm install && npm run build
- Publish directory: dist
- Make sure the ROOT_URL in src/store/profile-slice.js is pointing at the correct backend (deployed url), and the Redirect URI in the Spotify App is updated to reflect your new deployed frontend URL!

### Backend: 
- Create a web service using this repository on Render.
- Use the main branch
- Build Command: npm install && npm run build
- Start Command: npm run prod
- Environment Variables: Set MONGODB_URI to link to your MongoDB account.

## Figma
[Our Figma link](https://www.figma.com/design/d1LRKIo9vALvQktj60IxuR/mockup-draft-1?node-id=0%3A1&t=XEGMeyuZymvdAH84-1)

## Authors
**Full Stack:** Stephen Wang, Ben Sheldon, Brendan Shaw

**Frontend:** Eric Leung

**Designs:** Emily Gao

## Acknowledgments
A big thank you to @timofei7 for guiding us through Full-Stack Web Dev and helping us fix issues! Also, thanks to @dstarr25 for helping resolve bugs and for answering many questions. Lastly, thank you to everyone who helped test Harmonize!
