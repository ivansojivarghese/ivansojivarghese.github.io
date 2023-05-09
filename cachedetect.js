

///////////////////////////////////////

var version = 1;
var cacheEnabled; //will contain the result of our check
var cloneCallback;//function which will compare versions from two javascript files

function isCacheEnabled(){
   if(!window.cloneCallback){
       var currentVersion = version;//cache current version of the file
       // request the same cachedetect.js by adding <script> tag dynamically to <header>
       var head = document.getElementsByTagName("head")[0];
       var script = document.createElement('script');
       script.type = 'text/javascript';
       script.src = "cachedetect.js";
       // newly loaded cachedetect.js will execute the same function isCacheEnabled, so we need to prevent it from loading the script for third time by checking for cloneCallback existence       
       cloneCallback = function(){
           // once file will be loaded, version variable will contain different from currentVersion value in case when cache is disabled 
           window.cacheEnabled = currentVersion == window.version;        
       };      
       head.appendChild(script);

    }  else {
        return window.cloneCallback();
    }   
}

isCacheEnabled();