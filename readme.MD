### Tech Stack

## Front-end
* Sass for CSS-styling
* ReactJS on profile dashboard (not payment)
* Gulp for asset building

## Backend
* NodeJS
* ExpressJS for Web
* KeystoneJS for CMS
* MongoDB for database

### Setup
* npm install
* grunt
* nodemon keystone

### Prodsetting checklist
- utils.url
- tests removed
- facebook auth callback
- procfile
- throng(startRollin, { workers: config.concurrency });


### delete rabbit queue
First, list your queues:

rabbitmqadmin list queues name

Then from the list, you'll need to manually delete them one by one:

rabbitmqadmin delete queue name='queuename'

Because of the output format, doesn't appear you can grep the response from list queues. Alternatively, if you're just looking for a way to clear everything (read: reset all settings, returning the installation to a default state), use:

rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl start_app

### TODO

* Zoom ut hovedbildet
* Bytt nederste bilde med hund.
* verify temporize schedule works



* send produksjonsepost
* Oppdatering av bilder
* Generering av fil som skal sendes til etikettprodusent
* facebook
* Endring av «Min side»? Skulle vi gjøre noen endringer der?
* Fjerne bilde av gjenstand?
* Bare ha navn,ikke beskrivelse?
* Teste betaling nøye

* ny epost:  post@fantn.no

==================== BJØRN LIST
Side 1,5  - mosaik – her bør flere gjenstander inn og litt mer «hulter til bulter». Personlig ville jeg kanskje ha valgt å håndkolorere en bord rundt bildene, litt uvørent, for jeg synes dette blir litt for firkantet. Vet at Spotify har det, men de er jo firkantet (plateomslag og CD cover etc) så det blir noe annerledes.
Enig i flere gjenstander. Jeg liker det litt firkantet, men lager et par utkast og sender dere på mail.

Side 3,5 – mosaik. Som for 1,5 – og litt mer hulter til bulter, de må overlappe mer og ikke være så «stenge» Synes også at teksten og font må være tynnere samt at bildene bør rastres, se Joe and Juice.
I’ll work on it… Forslag kommer.

- When sending print qr emails: send with prefix (either with or without "-").
  And when parsing: make sure to look for prefix



- Paypal: verify payment works. first recurring: user must be redirected after plan + agreement is created. this should lead user to executeSubsciption
- publish to heroku
- lagre landprefiks som eget felt (mobileLand) når man regger bruker. Feilhåndtering for dette
- enable coloring for status flag
- finish templates in sms
- LOGGING types:
    - sms incoming - info
    - sms outgoing - info
    - transactions - info
    - plans - info
    - user creation - info
    - user updates
    - creating qrcodes
    - - debug

    - types : info, error, debug


### UI FOR LANDING
https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website/
http://packdog.com/taco-1
http://flatuicolors.com/
http://www.joejuice.com/site/#!home
http://codepen.io/sevilayha/full/IdGKH/
https://www.spotify.com/no/
