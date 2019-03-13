# Trails4Health
Node JS App for project TrailsHealth, it allows to persist data from sensors
This is a project with Arduino MKR FOX for monitoring the weather conditions in Serra da Estrela.

It can measure temperature and humidity by DHT11 or DHT22 sensor.

One or multiple devives sends the sensor data over HTTP protocol. The API is writen in Node JS that display the historical data.

## Getting Started
Clone this repository to your computer

# Prerequesites
* Node JS
* Mongodb
* Arduino IDE
* MKRFox1200 board
* DHT sensor
* SigFox cloud account

# Installing
* go to the root folder of this repository, then npm install
* npm start
* open chrome paste http://localhost:3000/api/auth/setup to obtain the token to insert data in the api
* create a trail and chanel in the api more information [here](https://documenter.getpostman.com/view/1257469/RztsnR7t)
* create a uplink callback in SigFox Cloud in the fowling parameters 
   * type: uplink
   * payload: status::uint:8 temperatura::int:16:little-endian humidade::uint:16:little-endian bateria::uint:16:little-endian lastMessageStatus::uint:8 hex::bool:7
   * url pattern: https://localhost:3000/api/feeds?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZmNhN2IxYzI2ZWE0MjI0YzEyNWIwYyIsImlhdCI6MTUyNjUwNzQ0MX0.7RdmeL35yo1fbWPu22brOTfcvgv4aUkUuXK2f72nvJA&hex={customData#hex}
   * Content type: application/json
 

