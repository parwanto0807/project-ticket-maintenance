if(!self.define){let e,s={};const a=(a,f)=>(a=new URL(a+".js",f).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(f,t)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let r={};const c=e=>a(e,n),i={module:{uri:n},exports:r,require:c};s[n]=Promise.all(f.map((e=>i[e]||c(e)))).then((e=>(t(...e),r)))}}define(["./workbox-0c7df97b"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Ticket.png",revision:"8086f7b924e1e2f09e98175681e4671c"},{url:"/_next/app-build-manifest.json",revision:"d7a02ce328da6d3a8adc250cefe12cbd"},{url:"/_next/static/chunks/0e5ce63c-90b0e3bcc9b630ca.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/11390db7-6edeaf0a050a56b9.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/1441-0471a0ce2a5ad2eb.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/1589-a9fb51f17cd6d1a3.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/1972-f5db0315c13d3cba.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/2117-5abf8578b87a7966.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/3181-3a7faec46fcd8835.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/3425-e5e1a63c69cbb45f.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/3854-9b4a21ff2334da50.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/3922-baab9704bf2bd48b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/41-d9e9384bc3e56719.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/4115-0ac0b1550876d2a2.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/4117-f10e8b324262d95e.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/4338-98f4ef904c19885a.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/4438-63a66aa7959e9b9b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/4521-e4b65935a619ff41.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/4604-faac8914af5ef7fb.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/5222-4d89ccaa2ff8075d.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/5526-361a9ab3ef2df43b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/5569-b3edae9a0fc8945f.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/5819.c0854a757de17da8.js",revision:"c0854a757de17da8"},{url:"/_next/static/chunks/5934-af9ea92bb0ac55f3.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/6978-09962170b55ffb04.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/7064611b-d3261ff5f38dd97c.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/7648-be7b8ce6761462ca.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/8e1d74a4-dd282f12a3548c03.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/955-040c8d8688af70bf.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/asset/asset-list/create/page-fbb1570096961329.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/asset/asset-list/edit/%5Bid%5D/page-957b4d786f80e870.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/asset/asset-list/page-c2112e63d2da0aa3.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/asset/generate-pdf-mobile/%5BassetId%5D/page-6beb8ed7abf2cadb.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/asset/generate-pdf/%5BassetId%5D/page-8edd601c50417cdb.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/layout-add08fa28cdeacb3.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/maintenance/ticket/page-f55943bf179bad94.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/employees/create/page-d5feead5f3f9ffe1.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/employees/edit/%5Bid%5D/page-b31898456726f98b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/employees/page-061fa72f7647a09e.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/price-product/create/page-81feb38dd5c05b1b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/price-product/edit/%5Bid%5D/page-d5733bdac477d22c.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/price-product/page-1d82418042322b29.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/products/create/page-f1f2796ba52fb83a.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/products/edit/%5Bid%5D/page-65ef0c6b4dd1b381.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/master/products/page-175a987165ac1343.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/(protected)/dashboard/page-d0767b9d4d3554ab.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/_not-found/page-62fc0af0393d9d8e.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/auth/error/page-89eee8fa73652060.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/auth/layout-5daccebd56ea1701.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/auth/login-admin/page-db7cd44936f6fb9b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/auth/login/page-80ee20d81570898f.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/auth/new-verification/page-e356ae092cefc924.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/auth/register/page-18f3c75f3490a08c.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/layout-6d66ed044b6c4661.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/app/page-52bcdb72ea1bd50d.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/b2d98e07-5483ef5541cf6474.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/fc2f6fa8-56ac70e9744682bb.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/fd9d1056-42d4d2c64c6a299c.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/ff804112-bab2bd795691533b.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/main-app-5da937d914bb4010.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/main-c0b0c7eef1e27c7a.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/pages/_app-3c9ca398d360b709.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-1e609190fdee350a.js",revision:"xPfnVNpJQu7zTyfBfrDy3"},{url:"/_next/static/css/3284b2615cad8535.css",revision:"3284b2615cad8535"},{url:"/_next/static/css/4836d9950f954ae0.css",revision:"4836d9950f954ae0"},{url:"/_next/static/css/b81a822ef496e877.css",revision:"b81a822ef496e877"},{url:"/_next/static/media/0484562807a97172-s.p.woff2",revision:"b550bca8934bd86812d1f5e28c9cc1de"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/c3bc380753a8436c-s.woff2",revision:"5a1b7c983a9dc0a87a2ff138e07ae822"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/xPfnVNpJQu7zTyfBfrDy3/_buildManifest.js",revision:"6310079bf1ae7bebeb6a2135896e4564"},{url:"/_next/static/xPfnVNpJQu7zTyfBfrDy3/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/icon-192x192.png",revision:"4d5fdc62dad5fe876933ca0907ae5563"},{url:"/icons/icon-512x512.png",revision:"1973444193b286b7314400f9e450c257"},{url:"/manifest.json",revision:"564958e90d7b2ff53726c0171e51e965"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/noImage.jpg",revision:"57da1720c8ec3c5b7c19d6c99a227605"},{url:"/uploads/Image-Mesin-Perkakas-dan-Produksi-8.png",revision:"db1299d00c19769a37c2b1b965e79905"},{url:"/uploads/Screenshot 2024-12-28 215337.png",revision:"143efb96c4d0888edb66dc5180fac813"},{url:"/uploads/Screenshot 2025-02-06 003820.png",revision:"08391880a15c729da0785f0fbf186145"},{url:"/uploads/Screenshot_1.jpg",revision:"1ca28d8825d14b03f617f79f26459001"},{url:"/uploads/Screenshot_2.jpg",revision:"1d2059041670f603861626eb02fb6579"},{url:"/uploads/images.jpg",revision:"10ab5d8f4bc476c3e98cf25143c6096f"},{url:"/uploads/logowht.png",revision:"c0b7657b68da0b9010a10a8b451e79b6"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:f})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/your-api-url\.com\/.*$/,new e.NetworkFirst({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:31536e3})]}),"GET")}));


