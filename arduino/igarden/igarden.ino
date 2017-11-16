#include "DHT.h"

int SOIL_MOISTURE_PIN=A0;       //Broche Analogique de mesure d'humidité
int DHT_PIN=7;

int soil_moisture;  
float humidity; 
float temperature;

DHT dht(DHT_PIN, DHT11);

void setup(){ 
    Serial.begin(9600); 
   
    pinMode(SOIL_MOISTURE_PIN, INPUT); 
    pinMode(DHT_PIN, INPUT); 
    dht.begin();
}

void loop() { 
  soil_moisture = analogRead(SOIL_MOISTURE_PIN);
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  Serial.println(soil_moisture); 
  Serial.println(humidity); 
  Serial.println(temperature); 
  delay(300000); 
}
