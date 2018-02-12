#include "DHT.h"

int SOIL_MOISTURE_PIN=A0;       //Broche Analogique de mesure d'humidité
int DHT_PIN=7;
int PHOTOSENSOR_PIN=A1;
int MQ2SENSOR_PIN=A3;

int soil_moisture;  
float humidity; 
float temperature;
float brightness;
float gas;

DHT dht(DHT_PIN, DHT22);


typedef struct {
  int soil_moisture;  
  float humidity; 
  float temperature;
  float brightness;
  float gas;
} Data;

void setup(){ 
    Serial.begin(9600); 
    pinMode(SOIL_MOISTURE_PIN, INPUT); 
    pinMode(DHT_PIN, INPUT); 
    pinMode(PHOTOSENSOR_PIN, INPUT); 
    pinMode(MQ2SENSOR_PIN, INPUT); 
    dht.begin();
}

void loop() { 
  Data data;
  //data.soil_moisture = analogRead(SOIL_MOISTURE_PIN);
  data.humidity = dht.readHumidity();
  data.temperature = dht.readTemperature();
  data.brightness = analogRead(PHOTOSENSOR_PIN);
  //data.gas = analogRead(MQ2SENSOR_PIN);
  //Serial.println(data.soil_moisture); 
  Serial.println(data.humidity); 
  Serial.println(data.temperature); 
  Serial.println(data.brightness);
  //Serial.println(data.gas);
  //delay(1000);  
  delay(180000); 
}
