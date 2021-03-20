## To run the program

- run node index.js and the program will start at port 8080

## To get log of size 1KB

- import the postman request - `curl --location --request GET 'http://127.0.0.1:8080/?log=front'`
- execute the GET request and suppoy approprate value to query param - log

## To increase/decrease log size

- control the value of bufferSize in index.js
