# Airtime API 

[Airtime API Kenya](https://bitbucket.github.io/) is a Lightweight Airtime Purchase API for Kenya that is built with Node.js, Express and docker (legacy encryption required by supplier API.)

Airtime API is proprietary and supported by Sozuri. The goal is to create a general-purpose, Kenya resell airtime API for vendors to sell airtime and earn commissions.

## Contributing

Airtime API is proprietary but will be open sourced soon. To contribute, contact Lawrencekm04@gmail.com
To get involved, visit:

+ [Sozuri Support](https://sozuri.net)
+ [Code Contribution Guide](https://sozuri.net)
+ [Frequently Asked Questions](https://sozuri.net)
+ [Bugs](https://sozuri.net)
+ [Projects](https://sozuri.net)

Feel free to stop by our Office in Nairobi for questions or guidance or coffee.

## Getting Started

### Online demo

Please note that the "Modern browsers" version assumes native support for
features such as optional chaining, nullish coalescing,
and private `class` fields/methods.

+ Modern browsers: https://sozuri.net/topup

+ Older browsers: https://sozuri.net/topup



## Building Airtime API

+ Install docker and docker compose. See here for instructions: []
+ Install node js.  See here for instructions:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
+ ensure you can run docker
sudo chmod 666 /var/run/docker.sock
+ Git clone this folder into your directory
+ cd into directory and run docker compose up -d --build . (modify to hosted image requiring only docker run lawre/airtime )
+ Mark the image id of nginxencrypt container
+ edit the server.js file and replace the runner exec command docker image id with value above. eg. 
+ Run npm start
+ Your Airtime API is available on localhost:3002


## Using Airtime API in a web application

To use Airtime API in a web application you can ....

## Using Airtime API in a mobile application



## Learning

You can play with the Airtime API API directly from sozuri API sandbox:

+ [Interactive examples](https://sozuri.net/#interactive-examples)

More examples can be found in the [documentation](https://sozuri.net/docs).

For an introduction to the Airtime API code, check out the presentation by our
contributor David W:

+ https://sozuri.net/docs

More learning resources can be found at:

+ https://sozuri.net/docs

The API documentation can be found at:

+ https://sozuri.net/docs

## Questions

Check out our FAQs and get answers to common questions:

+ https://sozuri.net

File an issue:

+ https://sozuri.net/

Follow us on Twitter: @pdfjs

+ https://twitter.com/sozuri
