//cache will store images or content and will not consume time to fetch
const CACHE_NAME = "version-1";
const urlsToCache = ['index.html','offline.html'];

const self = this; //represents this service worker

//Install SW
self.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache)=>{
            console.log('Opened cache');
            
            return cache.addAll(urlsToCache);
        })
    )
});


//Listen for requests
self.addEventListener('fetch',(event)=>{
    //respond the requests with 
    event.respondWith(
        caches.match(event.request) //match all the request i.e show image, api call etc
        .then(()=>{ 
            return fetch(event.request) //fetch again real-time data of api 
            .catch(()=> caches.match('offline.html')) //incase of no internet connection
        })
    )
});


//Activate the SW
self.addEventListener('activate',(event)=>{
    const cacheWhiteList = []; //push all the relevent cache we want to keep
    cacheWhiteList.push(CACHE_NAME); 
    event.waitUntil(
        caches.keys().then((cacheNames)=>Promise.all(
            cacheNames.map((cacheName)=>{
                if(!cacheWhiteList.includes(cacheName)){
                    return caches.delete(cacheName); //delete all the versions and keep version1
                }
            })
        
        ))
    )
    
});
