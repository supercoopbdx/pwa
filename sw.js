if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let d={};const o=e=>n(e,f),c={module:{uri:f},exports:d,require:o};i[f]=Promise.all(s.map((e=>c[e]||o(e)))).then((e=>(r(...e),d)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"0e769612042c46cc5ef0b9ecb396951e"},{url:"assets/index-D1Q-bhSt.js",revision:null},{url:"assets/index-DYaZZ7bq.css",revision:null},{url:"barcode_scan.svg",revision:"d4b8cd72072fbbba1435583c422a5b3b"},{url:"favicon.ico",revision:"45ed6ebb5d005c4e64a066f9d88ae512"},{url:"favicon.svg",revision:"479663d25f96d8f2c819fc0d9e3fb0db"},{url:"index.html",revision:"56bf526e602eebac871159f551af2d12"},{url:"maskable-icon-512x512.png",revision:"1bb2d2d5b2fe77d8a5c6456413f2bd29"},{url:"pwa-192x192.png",revision:"1d9e488fb7db1bdf277d6a775a9ff6b1"},{url:"pwa-512x512.png",revision:"9eda8f38cc60da9706f3d1e2924da2f9"},{url:"pwa-64x64.png",revision:"370386998b662875bc9a2baaff8ecf40"},{url:"manifest.webmanifest",revision:"f9791a5e030d9df136eead15ef3c0cf6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
