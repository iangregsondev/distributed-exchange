Please run "build" from package.json

This will product a client and server directory inside the "dist" folder

You can run a client by going to dist/client

node client.js

and a server by going to dist/server

node server.js

I didn't use typescript as I know the time doesn't but I did use babel :-) - I hope that was ok.

I also used ESMODULES import / export - this is compiled using babel anyway - soon in the not too distant future node.js will support ESMODULES
- its behind a feature flag now. - Again, I hope this was OK 


YOu need to run 2 grapes, this is behind a script in the package.json 

npm run boot:grapes

I have got a lot of communications happening, unfortunately I didn't finish the LOCKING of each record by first checkin the other WORKERS by
sending a LOCK message using peer.map .....

I started implementing it, but in 8 hours, there was so much more I wanted to do but I just didn't have the time.


I am using ESLINT and prettier.

I will forward an email with more specifics after I have commit this to github.

My 8 hours as just finsihed, so I need to commit and push :-)



