#include "DHT.h"

int SOIL_MOISTURE_PIN=A0;       //Broche Analogique de mesure d'humidité
int DHT_PIN=7;
int PHOTOSENSOR_PIN=A1;
int MQ2SENSOR_PIN=A2;

int soil_moisture;  
float humidity; 
float temperature;
float brightness;
float gas;

DHT dht(DHT_PIN, DHT11);

void setup(){ 
    Serial.begin(9600); 
    pinMode(SOIL_MOISTURE_PIN, INPUT); 
    pinMode(DHT_PIN, INPUT); 
    pinMode(PHOTOSENSOR_PIN, INPUT); 
    pinMode(MQ2SENSOR_PIN, INPUT); 
    dht.begin();
}

void loop() { 
  soil_moisture = analogRead(SOIL_MOISTURE_PIN);
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  brightness = analogRead(PHOTOSENSOR_PIN);
  gas = analogRead(MQ2SENSOR_PIN);
  Serial.println(soil_moisture); 
  Serial.println(humidity); 
  Serial.println(temperature); 
  Serial.println(brightness);
  Serial.println(gas);
  //delay(1000);  
  delay(180000); 
}
