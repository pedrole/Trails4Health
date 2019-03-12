
#include <ArduinoLowPower.h>
#include <SigFox.h>
#include "DHT.h"
#include "conversions.h"
// Set oneshot to false to trigger continuous mode when you finisched setting up the whole flow
#define STATUS_OK     0
#define STATUS_DHT_KO 1
#define DHTPIN 7     // what digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
#define TAMANHO_TABELA_BATERIA 5
DHT dht(DHTPIN, DHTTYPE);

bool oneshot = false;
typedef struct __attribute__ ((packed)) sigfox_message {
  uint8_t status;
  int16_t temperatura;
  uint16_t humidade;
  uint16_t bateria;
  uint8_t lastMessageStatus;
  bool hex = 0;
} SigfoxMessage;

uint16_t tempoContacto = 120, tempoEspera = oneshot ? 5 : 15, tempoConfig =  oneshot ? 12 : 120, tempoSemEnviar = tempoContacto;
long ultimaAtualizacao = 0, tempoEsperaMillis, tempoAtual, tempoInicial, tempoFinal, tempoEsperaConfig;
float variacao = oneshot ? 0 : 0;
float tabelaBateria [5][2];
float temperatura, ultimaTemperatura = 3.4028235E+38, bateria, humidade;
byte count = 0;

// stub for message which will be sent
SigfoxMessage msg;
volatile int alarm_source = 0;


void setup() {
  LowPower.attachInterruptWakeup(RTC_ALARM_WAKEUP, alarmEvent0, CHANGE); // interropetor que permite acordar arduino no modo deep sleep
  if (oneshot == true) {
    // Wait for the serial
    Serial.begin(115200);
    while (!Serial) {}
  }
  if (!SigFox.begin()) {
    // Something is really wrong, try rebooting
    // Reboot is useful if we are powering the board using an unreliable power source
    // (eg. solar panels or other energy harvesting methods)
    reboot();
  }

  //Send module to standby until we need to send a message
  SigFox.end();

  if (oneshot == true) {
    // Enable debug prints and LED indication if we are testing
    SigFox.debug();
  }

  // Configure the sensors and populate the status field
  dht.begin();
  analogReference(AR_INTERNAL1V0); // sesnor para ler voltagem d bateria



}

// função inversamente proporcional tempo de espera/nivel de bateria
uint16_t getTempoBateria() {
  for (int i = 0; i < TAMANHO_TABELA_BATERIA; i++)
  {
    if (tabelaBateria[i][0] == roundf(bateria * 10) / 10)
      return tabelaBateria[i][1];
  }
  return 0;

}


// função para iniciar array de 2 dimensões nivel de bateria e tempo de espera
void initTabelaBateria() {
  for (int i = 0; i < 5; i++) {
    tabelaBateria[i][0] = 2 + i / 10;
    tabelaBateria[i][1] = (5 + 1) * tempoEspera;
  }
}

// função que enbia dados meterolgicos
void enviaDadosMeteorologicos() {
  msg.temperatura = convertoFloatToInt16(temperatura, 60, -60);
  msg.humidade = convertoFloatToUInt16(humidade, 110);
  bateria = analogRead(ADC_BATTERY) * 3.1 / 1023.0;
  msg.bateria = convertoFloatToUInt16(bateria, 10);

  if (oneshot) Serial.println("msg.status: "  + String(msg.status) + " humidade: " + String(humidade));


  SigFox.begin();
  delay(100);
  if (oneshot == true) {
    Serial.println("Temperatura: " + String(msg.temperatura));
    Serial.println("Humidade: " + String(msg.humidade));
    Serial.println("Bateria: " + String(msg.bateria));
    Serial.println("Bateria Volts: " + String(bateria));
    int sensorValue = analogRead(ADC_BATTERY);
    Serial.println( analogRead(ADC_BATTERY) * 9.91 / 1023.0);
  }

  // Clears all pending interrupts
  SigFox.status();
  delay(1);

  SigFox.beginPacket();
  SigFox.write((uint8_t*)&msg, 12);


  if (oneshot == true) {
    Serial.println("Status: " + String(msg.lastMessageStatus) );
  }
  bool getConfiguracoes = false;
  if (oneshot == true) Serial.println("millis: " + String(millis()));

  tempoFinal = millis();
  tempoAtual += oneshot ? tempoFinal : ((tempoFinal - tempoInicial) + tempoEsperaMillis);
  tempoInicial = millis();
  //ultimosMillis = millis();
  if (oneshot) Serial.println("tempoEsperaConfig: " + String(tempoEsperaConfig) + " tempoAtual: " + String(tempoAtual) + " tempoFinal - tempoInicial : " + String(tempoFinal - tempoInicial));
  if (ultimaAtualizacao == 0 || tempoAtual > tempoEsperaConfig) {
    getConfiguracoes = true;
    if (oneshot == true)  Serial.println("GetCOnfiguracoes: " + String(getConfiguracoes) );
  }
  if (oneshot == true) Serial.println("GetCOnfiguracoes: " + String(getConfiguracoes) );


  msg.lastMessageStatus = SigFox.endPacket(getConfiguracoes);// send buffer to SIGFOX network and wait for a response
  if (oneshot) Serial.println(msg.lastMessageStatus);
  if (msg.lastMessageStatus > 0 && oneshot)  Serial.println("No transmission");
  else if (oneshot) Serial.println("Transmission ok");
  if (getConfiguracoes) {

    if (oneshot == true)  Serial.println(SigFox.status(SIGFOX));
    if (oneshot == true) Serial.println(SigFox.status(ATMEL));
    uint8_t response[] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };

    if (oneshot == true) {
      if (response != nullptr)
        Serial.println("não está a null");
    }


    if (SigFox.parsePacket()) {
      if (oneshot == true)  Serial.println("Response from server:");
      int i = 0;
      while (SigFox.available()) {
        if (oneshot == true)    Serial.print("0x");
        int readValue = SigFox.read();
        response[i] = (uint8_t)readValue;
        i++;
      }

      if (oneshot == true)  Serial.println(response[1], HEX);

      tempoContacto = combine (response[0], response[1]);
      uint16_t variacaoInt16 =   combine(response[2], response[3]);

      if (oneshot) Serial.println("variacao int16: " + String(variacaoInt16));
      variacao = convertUInt16ToFloat(variacaoInt16, 30);
      if (oneshot) Serial.println("variacao from server: " + String(variacao));
      tempoEspera = combine(response[4], response[5]);
      tempoConfig = combine(response[6], response[7]);
      if (oneshot == true) {
        Serial.println(tempoContacto);
        Serial.println(variacao);
        Serial.println("tempoEspera: " +  String(tempoEspera) + " Tempo Config: " + String(tempoConfig));

      }

      ultimaAtualizacao = tempoAtual;
      tempoEsperaConfig = ultimaAtualizacao + tempoConfig * 60 * 1000;
      if (oneshot) Serial.println("tempoEsperaConfig: " + String(tempoEsperaConfig));

    } else {
      if (oneshot == true)   Serial.println("Could not get any response from the server");
      if (oneshot == true)   Serial.println("Check the SigFox coverage in your area");
      if (oneshot == true)  Serial.println("If you are indoor, check the 20dB coverage or move near a window");
    }
    if (oneshot == true) Serial.println();
  }

  SigFox.end();
  if (msg.lastMessageStatus != 1)
    ultimaTemperatura = temperatura;
  else
    tempoSemEnviar += tempoContacto;


}

void loop() {
  delay(2000);
  humidade = dht.readHumidity();
  temperatura = dht.readTemperature();


  if (isnan(temperatura) || isnan(humidade)) {
    count++;
    msg.status |= STATUS_DHT_KO;
    if (count < 30)
      return;
  } else
    msg.status = STATUS_OK;
  count = 0;


  float diferenca = abs(temperatura - ultimaTemperatura);
  if (oneshot) Serial.println("temperatura: " +  String(temperatura) + " ultimaTemperatura: " + String(ultimaTemperatura) + " variacao: " + variacao + " diferenca: " + String(diferenca));

  if (isnan(temperatura) || diferenca >= variacao || tempoSemEnviar >= tempoContacto) {
    enviaDadosMeteorologicos();
    tempoSemEnviar = 0;
  } else
    tempoSemEnviar += tempoEspera;


  uint16_t tempoMinutos = min(tempoContacto, max(tempoEspera, getTempoBateria()));
  tempoEsperaMillis = tempoMinutos * 60 * 1000;

  if (oneshot == true) Serial.println("sleep");

  if (oneshot) Serial.println("tempoEsperaMillis: " + String(tempoEsperaMillis));
  oneshot ? delay(/*5 * 60 * 1000*/tempoEsperaMillis) : LowPower.sleep((uint32_t) tempoEsperaMillis);

  if (oneshot == true) Serial.println("sleep2");
}


void array_to_string(byte array[], unsigned int len, char buffer[])
{
  for (unsigned int i = 0; i < len; i++)
  {
    byte nib1 = (array[i] >> 4) & 0x0F;
    byte nib2 = (array[i] >> 0) & 0x0F;
    buffer[i * 2 + 0] = nib1  < 0xA ? '0' + nib1  : 'A' + nib1  - 0xA;
    buffer[i * 2 + 1] = nib2  < 0xA ? '0' + nib2  : 'A' + nib2  - 0xA;
  }
  buffer[len * 2] = '\0';
}

void reboot() {
  NVIC_SystemReset();
  while (1);
}
void alarmEvent0() {
  alarm_source = 0;
}

int combine(int a, int b) {
  int times = 1;
  while (times <= b)
    times *= 16;
  return a * times + b;
}
