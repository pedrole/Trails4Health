#include <ArduinoLowPower.h>
#include <SigFox.h>
#include "DHT.h"
#define DHTPIN 1     // what digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321

DHT dht(DHTPIN, DHTTYPE);
volatile int alarm_source = 0;


void setup() {
  LowPower.attachInterruptWakeup(RTC_ALARM_WAKEUP, alarmEvent0, CHANGE);

 
  if (!SigFox.begin()) {
    // Something is really wrong, try rebooting
    // Reboot is useful if we are powering the board using an unreliable power source
    // (eg. solar panels or other energy harvesting methods)
    reboot();
  }

  //Send module to standby until we need to send a message
  SigFox.end();

 
    
    SigFox.debug();
    dht.begin();
 

 


}

void loop() {
 float bateria = analogRead(ADC_BATTERY) * (9.91 / 1023.0);
 float t = dht.readTemperature();
 long tempo = millis();
   digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
  sendString("hello");
   LowPower.sleep(2 * 1000);

}

void sendString(String str) {
  // Start the module
  SigFox.begin();
  // Wait at least 30mS after first configuration (100mS before)
  delay(100);
  // Clears all pending interrupts
  SigFox.status();
  delay(1);

  SigFox.beginPacket();
  SigFox.print(str);

  int ret = SigFox.endPacket();  // send buffer to SIGFOX network
  if (ret > 0) {
//    Serial.println("No transmission");
  } else {
 //   Serial.println("Transmission ok");
  }

 // Serial.println(SigFox.status(SIGFOX));
 // Serial.println(SigFox.status(ATMEL));
  SigFox.end();
}
void alarmEvent0() {
  alarm_source = 0;
}

void reboot() {
  NVIC_SystemReset();
  while (1);
}
