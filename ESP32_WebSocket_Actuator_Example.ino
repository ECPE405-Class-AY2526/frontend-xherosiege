#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>
#include <DHT.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// ===============================
// === WiFi Credentials ===
// ===============================
const char* ssid = "";
const char* password = "";

// ===============================
// === Backend Endpoints ===
// ===============================
const char* serverURL = "http://10.0.30.14:5001/api/sensors/embedded";
const char* websocketHost = "10.0.30.14";
const int websocketPort = 5001;

// ===============================
// === Pin Definitions ===
// ===============================
#define TRIG_PIN       27
#define ECHO_PIN       14
#define BUZZER_PIN     26
#define MOISTURE_PIN   34
#define RELAY_PIN      25
#define DHTPIN         15
#define SERVO_PIN      13

// ===============================
// === Thresholds & Constants ===
// ===============================
#define DIST_THRESHOLD     10      // cm
#define DRY_THRESHOLD      2000    // adjust based on readings
#define TEMP_THRESHOLD     35.0    // °C

// ===============================
// === Globals ===
// ===============================
DHT dht(DHTPIN, DHT11);
Servo myServo;
WebSocketsClient webSocket;

// ===============================
// === Control Mode & States ===
// ===============================
bool autoMode = true;           // true = automatic, false = manual
bool buzzerState = false;       // Manual buzzer state
bool pumpState = false;         // Manual pump state  
int servoPosition = 0;          // Manual servo position

// Actuator values for manual mode
int manualServoAngle = 90;
int manualPumpDuration = 5;
int manualBuzzerFreq = 1000;

// ===============================
// === Function Prototypes ===
// ===============================
float readDistance();
int readSoilMoisture();
void controlBuzzer(float distance);
void controlPump(int moisture);
void controlServo(float temperature);
void sendSensorData(String sensorName, float sensorValue);

// WebSocket functions
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length);
void handleWebSocketMessage(String message);
void handleActuatorCommand(DynamicJsonDocument& command);
void identifyAsESP32();
void sendStatusUpdate();
void handleManualServo(String action, int value);
void handleManualPump(String action, int value);
void handleManualBuzzer(String action, int value);

// ===============================
// === Setup ===
// ===============================
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- ESP32 Smart Environment System ---");

  // Pin setup
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RELAY_PIN, LOW);

  analogSetAttenuation(ADC_11db);
  dht.begin();
  myServo.attach(SERVO_PIN);
  myServo.write(0);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("ESP32 IP address: ");
  Serial.println(WiFi.localIP());

  // Initialize WebSocket connection
  webSocket.begin(websocketHost, websocketPort, "/socket.io/?EIO=4&transport=websocket");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  Serial.println("WebSocket client initialized");
  
  Serial.println("=== HYBRID MODE READY ===");
  Serial.println("Auto Mode: ENABLED (use WebSocket to toggle)");
}

// ===============================
// === Main Loop ===
// ===============================
void loop() {
  // Handle WebSocket events
  webSocket.loop();
  
  // Read sensors (always read for data logging)
  float distance = readDistance();
  int moisture = readSoilMoisture();
  float temperature = dht.readTemperature();

  if (isnan(temperature)) {
    Serial.println("Failed to read from DHT11 sensor!");
    temperature = -999;
  }

  Serial.println("===============================");
  Serial.printf("Mode: %s\n", autoMode ? "AUTOMATIC" : "MANUAL");
  Serial.printf("Distance: %.2f cm\n", distance);
  Serial.printf("Moisture: %d\n", moisture);
  Serial.printf("Temperature: %.2f °C\n", temperature);

  // AUTOMATIC MODE: Sensor-based control
  if (autoMode) {
    controlBuzzer(distance);
    controlPump(moisture);
    controlServo(temperature);
  }
  // MANUAL MODE: Maintain current manual states
  else {
    Serial.printf("Manual States - Buzzer: %s, Pump: %s, Servo: %d°\n", 
                  buzzerState ? "ON" : "OFF",
                  pumpState ? "ON" : "OFF", 
                  servoPosition);
  }

  // ALWAYS send sensor data to database (regardless of mode)
  sendSensorData("ultrasonic", distance);
  sendSensorData("moisture", moisture);
  sendSensorData("temperature", temperature);

  // Send status update via WebSocket every few loops
  static int statusCounter = 0;
  if (++statusCounter >= 3) { // Every ~9 seconds
    sendStatusUpdate();
    statusCounter = 0;
  }

  delay(3000);
}

// ===============================
// === Sensor Functions ===
// ===============================
float readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  return duration * 0.034 / 2.0;
}

int readSoilMoisture() {
  return analogRead(MOISTURE_PIN);
}

void controlBuzzer(float distance) {
  if (distance > 0 && distance < DIST_THRESHOLD) {
    digitalWrite(BUZZER_PIN, HIGH);
    Serial.println("Object detected — Buzzer ON");
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
}

void controlPump(int moisture) {
  if (moisture < DRY_THRESHOLD) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Soil dry — Pump ON");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Soil moist — Pump OFF");
  }
}

void controlServo(float temperature) {
  if (temperature > TEMP_THRESHOLD) {
    myServo.write(180);
    Serial.println("High temp — Servo to 180°");
  } else {
    myServo.write(0);
    Serial.println("Normal temp — Servo to 0°");
  }
}

// --- Send Sensor Data to Node Backend ---
void sendSensorData(String sensorName, float sensorValue) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");

    String payload = "{";
    payload += "\"sensorName\":\"" + sensorName + "\",";
    payload += "\"sensorValue\":" + String(sensorValue, 2);
    payload += "}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.printf("[POST %s] -> Code: %d\n", sensorName.c_str(), httpResponseCode);
    } else {
      Serial.printf("[POST %s] -> Failed\n", sensorName.c_str());
    }

    http.end();
  }
}

// ===============================
// === WebSocket Functions ===
// ===============================

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      break;
      
    case WStype_CONNECTED:
      Serial.printf("WebSocket Connected to: %s\n", payload);
      identifyAsESP32();
      break;
      
    case WStype_TEXT:
      Serial.printf("WebSocket Message: %s\n", payload);
      handleWebSocketMessage(String((char*)payload));
      break;
      
    default:
      break;
  }
}

void identifyAsESP32() {
  DynamicJsonDocument doc(512);
  doc["type"] = "esp32_identify";
  doc["deviceId"] = "ESP32_HYBRID_001";
  doc["capabilities"] = "servo,pump,buzzer,sensors";
  doc["mode"] = autoMode ? "automatic" : "manual";
  
  String payload;
  serializeJson(doc, payload);
  webSocket.sendTXT(payload);
  Serial.println("Identified as ESP32 Hybrid System");
}

void handleWebSocketMessage(String message) {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, message);
  
  String type = doc["type"];
  
  if (type == "actuator_command") {
    handleActuatorCommand(doc);
  } else if (type == "toggle_mode") {
    autoMode = !autoMode;
    Serial.printf("Mode switched to: %s\n", autoMode ? "AUTOMATIC" : "MANUAL");
    sendStatusUpdate();
  }
}

void handleActuatorCommand(DynamicJsonDocument& command) {
  String actuatorName = command["actuatorName"];
  String action = command["action"];
  int value = command["value"];
  
  Serial.printf("WebSocket Command: %s %s %d\n", 
                actuatorName.c_str(), action.c_str(), value);
  
  // Only allow actuator control in manual mode
  if (!autoMode) {
    if (actuatorName == "servo") {
      handleManualServo(action, value);
    } else if (actuatorName == "pump") {
      handleManualPump(action, value);
    } else if (actuatorName == "buzzer") {
      handleManualBuzzer(action, value);
    }
  } else {
    Serial.println("Actuator control ignored - System in AUTOMATIC mode");
  }
  
  sendStatusUpdate();
}

void handleManualServo(String action, int value) {
  if (action == "on" || action == "toggle") {
    servoPosition = (value > 0) ? value : manualServoAngle;
    myServo.write(servoPosition);
    Serial.printf("Manual Servo: %d degrees\n", servoPosition);
  } else if (action == "off") {
    servoPosition = 0;
    myServo.write(0);
    Serial.println("Manual Servo: OFF (0 degrees)");
  }
}

void handleManualPump(String action, int value) {
  if (action == "on") {
    pumpState = true;
    digitalWrite(RELAY_PIN, HIGH);
    Serial.printf("Manual Pump: ON\n");
  } else if (action == "off") {
    pumpState = false;
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Manual Pump: OFF");
  } else if (action == "toggle") {
    pumpState = !pumpState;
    digitalWrite(RELAY_PIN, pumpState ? HIGH : LOW);
    Serial.printf("Manuel Pump: %s\n", pumpState ? "ON" : "OFF");
  }
}

void handleManualBuzzer(String action, int value) {
  if (action == "on") {
    buzzerState = true;
    int freq = (value > 0) ? value : manualBuzzerFreq;
    tone(BUZZER_PIN, freq);
    Serial.printf("Manual Buzzer: ON (%dHz)\n", freq);
  } else if (action == "off") {
    buzzerState = false;
    noTone(BUZZER_PIN);
    digitalWrite(BUZZER_PIN, LOW);
    Serial.println("Manual Buzzer: OFF");
  } else if (action == "toggle") {
    buzzerState = !buzzerState;
    if (buzzerState) {
      tone(BUZZER_PIN, manualBuzzerFreq);
      Serial.printf("Manual Buzzer: ON (%dHz)\n", manualBuzzerFreq);
    } else {
      noTone(BUZZER_PIN);
      digitalWrite(BUZZER_PIN, LOW);
      Serial.println("Manual Buzzer: OFF");
    }
  }
}

void sendStatusUpdate() {
  DynamicJsonDocument doc(1024);
  
  doc["type"] = "status_update";
  doc["deviceId"] = "ESP32_HYBRID_001";
  doc["mode"] = autoMode ? "automatic" : "manual";
  doc["timestamp"] = millis();
  
  // Current actuator states
  JsonObject actuators = doc.createNestedObject("actuators");
  
  actuators["servo"]["isActive"] = (servoPosition > 0);
  actuators["servo"]["currentValue"] = servoPosition;
  
  actuators["pump"]["isActive"] = digitalRead(RELAY_PIN);
  actuators["pump"]["currentValue"] = manualPumpDuration;
  
  actuators["buzzer"]["isActive"] = buzzerState;
  actuators["buzzer"]["currentValue"] = manualBuzzerFreq;
  
  // Add sensor readings
  JsonObject sensors = doc.createNestedObject("sensors");
  sensors["distance"] = readDistance();
  sensors["moisture"] = readSoilMoisture(); 
  sensors["temperature"] = dht.readTemperature();
  
  String payload;
  serializeJson(doc, payload);
  webSocket.sendTXT(payload);
  
  Serial.println("Status update sent via WebSocket");
}