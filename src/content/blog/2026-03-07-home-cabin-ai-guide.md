---
title: "홈 캐빈 AI 완전 가이드: 라즈베리파이 + MCP + Claude로 집을 살아있게 만들기"
description: "차량 캐빈 AI 개념을 집에서 실험하는 완전 가이드. 라즈베리파이 5, 센서 5종, Tapo P110 스마트 플러그, Claude AI를 연결해서 중학생도 따라할 수 있는 홈 오거니즘을 만든다."
date: "2026-03-07"
category: tutorial
tags: ["raspberry-pi", "mcp", "claude", "smart-home", "cabin-ai", "iot", "python", "tapo"]
featured: true
---

## 우리가 만들 것

집을 **살아있는 유기체**로 만든다.

에어컨 리모컨을 찾지 않아도 된다. 앱을 열지 않아도 된다. 집이 알아서 판단하고, 알아서 행동하고, 아침마다 어제 무슨 일이 있었는지 알려준다.

- 방에 사람이 없는데 전력을 낭비하고 있으면 → 스스로 끈다
- 공기질이 나빠지면 → 스스로 환기를 트리거한다
- 온도가 올라가면 → 조명을 시원한 색으로 바꾼다
- 아침 8시마다 → "어젯밤 전력 0.8kWh 절약, 평균 CO2 412ppm, 이상 없음" 보고한다

이게 **홈 캐빈 AI**다. 차량 실내 AI 시스템(Cabin AI)의 개념을 집에서 실험하는 것이다. 집에서 증명하고 → 차에 이식하면 된다.

---

## 개념 이해: 왜 캐빈 AI인가

차량 캐빈 AI는 차 안의 센서(온도, 습도, CO2, 탑승자 감지)를 AI가 실시간으로 읽고, 에어컨·조명·공조를 자동으로 제어하는 시스템이다. 테슬라, 현대, 메르세데스가 모두 이 방향으로 가고 있다.

핵심 구조는 이렇다:

```
[센서들] → [표준 API] → [AI 에이전트] → [액추에이터 제어]
```

집도 정확히 같다. 센서만 다를 뿐이다:

| 차량 캐빈 | 홈 캐빈 AI |
|---|---|
| DMS 카메라 (탑승자 감지) | Pi 카메라 (사람 감지) |
| 시트 압력 센서 | FSR402 압력 센서 |
| 캐빈 온습도 | DHT22 온습도 |
| 공기질 (CO2/VOC) | SGP30 공기질 |
| 무드램프 | NeoPixel LED |
| 공조 시스템 | Tapo P110 (에어컨 플러그) |
| AI 에이전트 | Claude + MCP |

---

## 준비물 및 아마존 구매 링크

총 예산: **약 $290 (40만원)**

### A. 메인 컴퓨터

| # | 부품 | 예상가 | 구매 |
|---|---|---|---|
| 1 | Raspberry Pi 5 (8GB) | ~$80 | [Amazon 검색](https://www.amazon.com/s?k=Raspberry+Pi+5+8GB) |
| 2 | Pi 5 케이스 + 쿨링팬 | ~$15 | [Amazon 검색](https://www.amazon.com/s?k=Raspberry+Pi+5+Case+with+Fan) |
| 3 | USB-C 27W 전원 어댑터 | ~$12 | [Amazon 검색](https://www.amazon.com/s?k=Raspberry+Pi+5+Power+Supply+USB-C+27W) |
| 4 | MicroSD 64GB (Samsung EVO) | ~$10 | [Amazon 검색](https://www.amazon.com/s?k=Samsung+EVO+Plus+64GB+microSD) |
| 5 | Micro HDMI → HDMI 케이블 | ~$8 | [Amazon 검색](https://www.amazon.com/s?k=Micro+HDMI+to+HDMI+Cable) |

### B. 센서 5종

| # | 부품 | 용도 | 예상가 | 구매 |
|---|---|---|---|---|
| 6 | DHT22 온습도 센서 | 온도/습도 측정 | ~$8 | [Amazon 검색](https://www.amazon.com/s?k=DHT22+Temperature+Humidity+Sensor) |
| 7 | BH1750 조도 센서 | 밝기 측정 | ~$6 | [Amazon 검색](https://www.amazon.com/s?k=BH1750+Light+Sensor+I2C) |
| 8 | SGP30 공기질 센서 | CO2/VOC 측정 | ~$12 | [Amazon 검색](https://www.amazon.com/s?k=SGP30+Air+Quality+Sensor) |
| 9 | FSR402 압력 센서 | 착석/존재 감지 | ~$8 | [Amazon 검색](https://www.amazon.com/s?k=FSR402+Force+Sensitive+Resistor) |
| 10 | Pi Camera Module 3 | 사람 감지 | ~$30 | [Amazon 검색](https://www.amazon.com/s?k=Raspberry+Pi+Camera+Module+3) |

### C. 출력 장치

| # | 부품 | 용도 | 예상가 | 구매 |
|---|---|---|---|---|
| 11 | WS2812B NeoPixel LED 1m | 무드 조명 | ~$12 | [Amazon 검색](https://www.amazon.com/s?k=WS2812B+NeoPixel+LED+Strip+60+1m) |
| 12 | **TP-Link Tapo P110 × 3** | 방별 전력 모니터링 + 제어 | ~$60 | [Amazon 검색](https://www.amazon.com/s?k=TP-Link+Tapo+P110+Smart+Plug) |

### D. 연결 부품

| # | 부품 | 예상가 | 구매 |
|---|---|---|---|
| 13 | 브레드보드 + 점퍼와이어 키트 | ~$10 | [Amazon 검색](https://www.amazon.com/s?k=Breadboard+Jumper+Wire+Kit) |
| 14 | GPIO 브레이크아웃 보드 (T형) | ~$8 | [Amazon 검색](https://www.amazon.com/s?k=Raspberry+Pi+GPIO+Breakout+T-type) |
| 15 | 10K 저항 팩 | ~$5 | [Amazon 검색](https://www.amazon.com/s?k=10K+Ohm+Resistor+Pack) |

> **절약 팁**: 센서 개별 구매 대신 [Freenove 센서 키트](https://www.amazon.com/s?k=Freenove+Raspberry+Pi+Sensor+Kit) (~$40)를 사면 50개 이상 센서가 포함된다. SGP30, FSR402는 별도 구매 필요.

---

## STEP 1: 라즈베리파이 OS 설치

**이게 뭐야?**: 라즈베리파이에 윈도우 같은 운영체제를 넣는 작업. 딱 한 번만 하면 된다.

### 1-1. Raspberry Pi Imager 다운로드

PC(윈도우/맥)에서 **Raspberry Pi Imager**를 설치한다.

```
https://www.raspberrypi.com/software/
```

### 1-2. OS 굽기

1. MicroSD 카드를 PC에 꽂는다
2. Imager 실행 후:
   - **장치 선택** → Raspberry Pi 5
   - **OS 선택** → Raspberry Pi OS (64-bit)
   - **저장소 선택** → MicroSD 카드

3. **⚙️ 설정(톱니바퀴) 버튼** 클릭 — 이게 제일 중요!
   ```
   호스트이름: home-cabin
   WiFi: 집 WiFi 이름 + 비밀번호
   SSH: 활성화 ✓
   사용자: pi
   비밀번호: 원하는 것
   ```

4. **쓰기** → 5~10분 기다리기

완료되면 MicroSD를 Pi에 꽂는다.

---

## STEP 2: 하드웨어 조립

### 2-1. Pi 케이스 조립

1. Pi 보드를 케이스 하단에 올린다
2. MicroSD를 보드 뒷면에 **찰칵** 소리 날 때까지 꽂는다
3. 팬을 케이스 상단에 끼우고, FAN 핀에 연결한다
4. HDMI 케이블로 모니터 연결, USB 키보드/마우스 연결
5. **마지막에** 전원 어댑터 꽂기

### 2-2. 브레드보드 이해

브레드보드는 납땜 없이 전선을 꽂아서 회로를 만드는 판이다.

```
규칙:
- 가로줄: 같은 줄끼리 전기가 통함
- 빨간줄(+): 전원(3.3V 또는 5V)
- 파란줄(-): 접지(GND, 0V)
```

GPIO 브레이크아웃 보드(T형)를 브레드보드 가운데에 꽂고, 리본 케이블로 Pi GPIO에 연결한다.

### 2-3. 센서 배선

> **규칙**: 전원 끄고 연결 → 연결 완료 후 전원 켜기. 3.3V와 GND를 절대 바꾸지 말 것 (센서 고장).

#### DHT22 온습도 센서

```
Pi 3.3V ──── VCC (빨간)
Pi GND  ──── GND (검은)
Pi GPIO4 ─── DATA (노란)

※ DATA와 VCC 사이에 10K 저항 1개 (풀업 저항)
```

#### BH1750 조도 센서 (I2C)

```
Pi 3.3V ──── VCC
Pi GND  ──── GND
Pi GPIO3 ─── SCL
Pi GPIO2 ─── SDA
```

#### SGP30 공기질 센서 (I2C, BH1750과 같은 핀 공유 가능)

```
Pi 3.3V ──── VCC
Pi GND  ──── GND
Pi GPIO3 ─── SCL  (BH1750과 동일 핀)
Pi GPIO2 ─── SDA  (BH1750과 동일 핀)

※ I2C는 여러 센서가 같은 핀을 공유할 수 있다
```

#### FSR402 압력 센서

```
Pi 3.3V ──── FSR 한쪽 끝
              FSR 다른 쪽 끝 ──┬── Pi GPIO17
                               │
                              [10K 저항]
                               │
                              GND
```

#### Pi Camera Module 3

Pi CAMERA 포트의 검은 탭을 살짝 들어올리고 → 리본 케이블 넣고 → 탭 닫기.

#### NeoPixel LED 스트립

```
Pi 5V    ──── 빨간선 (VCC)
Pi GND   ──── 흰/검은선 (GND)
Pi GPIO18 ─── 초록선 (DIN, 데이터)
```

### 2-4. 전체 배선 요약

| 센서 | VCC | GND | 데이터 |
|---|---|---|---|
| DHT22 | 3.3V | GND | GPIO4 |
| BH1750 | 3.3V | GND | GPIO2(SDA), GPIO3(SCL) |
| SGP30 | 3.3V | GND | GPIO2(SDA), GPIO3(SCL) |
| FSR402 | 3.3V | GND | GPIO17 |
| Camera | — | — | CAMERA 포트 |
| NeoPixel | 5V | GND | GPIO18 |

---

## STEP 3: 소프트웨어 설치

Pi 부팅 후 터미널(검은 화면)을 열고 아래 명령어를 순서대로 입력한다.

### 3-1. 시스템 업데이트

```bash
sudo apt update && sudo apt upgrade -y
```

5~10분 기다린다.

### 3-2. I2C, 카메라 활성화

```bash
sudo raspi-config
```

메뉴에서:
- `Interface Options` → `I2C` → Enable
- `Interface Options` → `Camera` → Enable
- Finish → 재부팅

### 3-3. Python 환경 설치

```bash
sudo apt install python3-pip python3-venv -y
python3 -m venv ~/cabin
source ~/cabin/bin/activate

pip install flask \
  adafruit-circuitpython-dht \
  adafruit-circuitpython-bh1750 \
  adafruit-circuitpython-sgp30 \
  rpi-ws281x \
  RPi.GPIO \
  picamera2 \
  PyP100 \
  requests \
  schedule
```

---

## STEP 4: 센서 테스트

각 센서가 제대로 연결됐는지 확인한다.

```bash
source ~/cabin/bin/activate
```

### 온습도 테스트

```python
python3 -c "
import adafruit_dht, board
d = adafruit_dht.DHT22(board.D4)
print(f'온도: {d.temperature}°C, 습도: {d.humidity}%')
"
```

→ `온도: 26.3°C, 습도: 51.2%` 나오면 성공

### 조도 테스트

```python
python3 -c "
import board, busio, adafruit_bh1750
i2c = busio.I2C(board.SCL, board.SDA)
s = adafruit_bh1750.BH1750(i2c)
print(f'밝기: {s.lux:.1f} lux')
"
```

### 공기질 테스트

```python
python3 -c "
import board, busio, adafruit_sgp30
i2c = busio.I2C(board.SCL, board.SDA)
s = adafruit_sgp30.Adafruit_SGP30(i2c)
s.iaq_init()
import time; time.sleep(1)
print(f'CO2: {s.eCO2} ppm, VOC: {s.TVOC} ppb')
"
```

→ 처음 15초는 값이 이상할 수 있다. 정상이다.

### I2C 기기 감지 확인

```bash
sudo i2cdetect -y 1
```

→ `23` (BH1750)과 `58` (SGP30) 주소가 보이면 성공

---

## STEP 5: 센서 API 서버

이 파일이 핵심이다. 라즈베리파이를 "집의 신경계 서버"로 만든다.

```
nano ~/cabin/sensor_server.py
```

아래 코드를 붙여넣는다:

```python
# sensor_server.py — 홈 캐빈 AI 센서 API 서버
# VSS(Vehicle Signal Specification) 표준 경로 형식 사용

from flask import Flask, jsonify, request
import adafruit_dht, board, busio
import adafruit_bh1750, adafruit_sgp30
import RPi.GPIO as GPIO
from rpi_ws281x import PixelStrip, Color
import threading, time, json, os
from datetime import datetime

app = Flask(__name__)

# ═══════════════════════════════════════
# 센서 초기화
# ═══════════════════════════════════════
dht = adafruit_dht.DHT22(board.D4)
i2c = busio.I2C(board.SCL, board.SDA)
light_sensor = adafruit_bh1750.BH1750(i2c)
air_sensor = adafruit_sgp30.Adafruit_SGP30(i2c)
air_sensor.iaq_init()

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN)

# LED 초기화
LED_COUNT = 30
strip = PixelStrip(LED_COUNT, 18, 800000, 10, False, 255)
strip.begin()

# ═══════════════════════════════════════
# 데이터 저장소
# ═══════════════════════════════════════
sensor_data = {
    "temperature": 0,
    "humidity": 0,
    "lux": 0,
    "co2": 400,
    "voc": 0,
    "occupied": False,
    "updated_at": ""
}

# ═══════════════════════════════════════
# 백그라운드 센서 읽기 (2초마다)
# ═══════════════════════════════════════
def read_sensors():
    while True:
        try:
            t = dht.temperature
            h = dht.humidity
            if t and h:
                sensor_data["temperature"] = round(t, 1)
                sensor_data["humidity"] = round(h, 1)
        except Exception:
            pass

        try:
            sensor_data["lux"] = round(light_sensor.lux, 1)
        except Exception:
            pass

        try:
            sensor_data["co2"] = air_sensor.eCO2
            sensor_data["voc"] = air_sensor.TVOC
        except Exception:
            pass

        sensor_data["occupied"] = bool(GPIO.input(17))
        sensor_data["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        time.sleep(2)

threading.Thread(target=read_sensors, daemon=True).start()

# ═══════════════════════════════════════
# API 엔드포인트 — 센서 읽기
# ═══════════════════════════════════════

@app.route("/")
def index():
    return jsonify({
        "name": "Home Cabin AI Sensor Server",
        "version": "1.0",
        "endpoints": [
            "/cabin/all",
            "/cabin/temperature",
            "/cabin/humidity",
            "/cabin/light",
            "/cabin/air",
            "/cabin/occupied",
            "/cabin/led  [POST]",
            "/cabin/led/off  [POST]"
        ]
    })

@app.route("/cabin/all")
def all_sensors():
    """VSS 표준 형식으로 전체 센서 데이터 반환"""
    return jsonify({
        "Vehicle.Cabin.HVAC.AmbientAirTemperature": sensor_data["temperature"],
        "Vehicle.Cabin.HVAC.Humidity": sensor_data["humidity"],
        "Vehicle.Cabin.Light.Lux": sensor_data["lux"],
        "Vehicle.Cabin.Air.CO2": sensor_data["co2"],
        "Vehicle.Cabin.Air.VOC": sensor_data["voc"],
        "Vehicle.Cabin.IsOccupied": sensor_data["occupied"],
        "timestamp": sensor_data["updated_at"]
    })

@app.route("/cabin/temperature")
def temperature():
    return jsonify({
        "value": sensor_data["temperature"],
        "unit": "celsius",
        "status": "high" if sensor_data["temperature"] > 28 else
                  "low" if sensor_data["temperature"] < 18 else "normal"
    })

@app.route("/cabin/humidity")
def humidity():
    return jsonify({
        "value": sensor_data["humidity"],
        "unit": "percent",
        "status": "high" if sensor_data["humidity"] > 70 else
                  "low" if sensor_data["humidity"] < 30 else "normal"
    })

@app.route("/cabin/light")
def light():
    return jsonify({
        "value": sensor_data["lux"],
        "unit": "lux",
        "status": "dark" if sensor_data["lux"] < 50 else
                  "bright" if sensor_data["lux"] > 500 else "normal"
    })

@app.route("/cabin/air")
def air():
    co2 = sensor_data["co2"]
    return jsonify({
        "co2": co2,
        "voc": sensor_data["voc"],
        "unit_co2": "ppm",
        "unit_voc": "ppb",
        "status": "poor" if co2 > 1000 else
                  "moderate" if co2 > 600 else "good"
    })

@app.route("/cabin/occupied")
def occupied():
    return jsonify({
        "value": sensor_data["occupied"],
        "since": sensor_data["updated_at"]
    })

# ═══════════════════════════════════════
# API 엔드포인트 — LED 제어
# ═══════════════════════════════════════

MOODS = {
    "cool":    (0,   150, 255),   # 시원한 파랑
    "warm":    (255, 150,  20),   # 따뜻한 앰버
    "fresh":   (0,   255, 100),   # 상쾌한 초록
    "alert":   (255,  30,   0),   # 경고 빨강
    "sleep":   (100,   0, 150),   # 수면 보라
    "off":     (0,     0,   0),   # 끄기
}

@app.route("/cabin/led", methods=["POST"])
def set_led():
    data = request.json or {}

    # mood 프리셋 또는 RGB 직접 지정
    if "mood" in data and data["mood"] in MOODS:
        r, g, b = MOODS[data["mood"]]
    else:
        r = data.get("r", 255)
        g = data.get("g", 255)
        b = data.get("b", 255)

    brightness = data.get("brightness", 180)
    strip.setBrightness(brightness)

    for i in range(strip.numPixels()):
        strip.setPixelColor(i, Color(r, g, b))
    strip.show()

    return jsonify({
        "status": "ok",
        "mood": data.get("mood", "custom"),
        "color": [r, g, b],
        "brightness": brightness
    })

@app.route("/cabin/led/off", methods=["POST"])
def led_off():
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, Color(0, 0, 0))
    strip.show()
    return jsonify({"status": "off"})

if __name__ == "__main__":
    print("=" * 50)
    print("Home Cabin AI Sensor Server")
    print("=" * 50)
    print(f"접속: http://[Pi-IP]:5000/cabin/all")
    print("Pi IP 확인: hostname -I")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=False)
```

### 서버 실행

```bash
cd ~/cabin
source ~/cabin/bin/activate
sudo python3 sensor_server.py
```

### 테스트 (같은 Wi-Fi의 PC/폰에서)

```
# Pi IP 확인
hostname -I
# 예: 192.168.1.42

# 브라우저에서
http://192.168.1.42:5000/cabin/all
```

---

## STEP 6: Tapo P110 스마트 플러그 연동

### 6-1. Tapo 앱 설정

1. 스마트폰에 **Tapo 앱** 설치
2. 플러그를 각 방 콘센트에 꽂고 앱에서 등록
3. 이름 설정: `거실`, `침실`, `서재`
4. 앱에서 **계정 이메일/비밀번호** 확인 (API 연결에 필요)

### 6-2. 플러그 제어 코드

```python
# tapo_controller.py
from PyP100 import PyP110

class RoomPlugs:
    def __init__(self, credentials):
        self.email = credentials["email"]
        self.password = credentials["password"]

        # 각 방의 플러그 IP (Tapo 앱에서 확인)
        self.plugs = {
            "거실":  "192.168.1.100",
            "침실":  "192.168.1.101",
            "서재":  "192.168.1.102",
        }

    def _get_plug(self, room):
        p = PyP110.P110(
            self.plugs[room],
            self.email,
            self.password
        )
        p.handshake()
        p.login()
        return p

    def get_status(self, room):
        """방의 전력 사용량 조회"""
        try:
            p = self._get_plug(room)
            energy = p.getEnergyUsage()
            info = p.getDeviceInfo()
            return {
                "room": room,
                "on": info["result"]["device_on"],
                "current_power": energy["result"].get("current_power", 0),
                "today_energy": energy["result"].get("today_energy", 0),
            }
        except Exception as e:
            return {"room": room, "error": str(e)}

    def get_all_status(self):
        """전체 방 전력 현황"""
        return [self.get_status(room) for room in self.plugs]

    def turn_on(self, room):
        self._get_plug(room).turnOn()
        return {"room": room, "action": "on"}

    def turn_off(self, room):
        self._get_plug(room).turnOff()
        return {"action": "off", "room": room}

    def get_total_power(self):
        """전체 전력 소비 합산"""
        total = 0
        for room in self.plugs:
            s = self.get_status(room)
            total += s.get("current_power", 0)
        return total


# 테스트
if __name__ == "__main__":
    creds = {"email": "your@email.com", "password": "yourpassword"}
    plugs = RoomPlugs(creds)

    for status in plugs.get_all_status():
        print(f"{status['room']}: {status.get('current_power', 0)}W "
              f"(오늘: {status.get('today_energy', 0)}Wh)")
```

---

## STEP 7: AI 자율 에이전트

이게 핵심이다. 사람 없이 5분마다 스스로 판단하고 행동한다.

```python
# agent.py — 홈 캐빈 AI 자율 에이전트
import requests
import schedule
import time
import json
import os
from datetime import datetime
from tapo_controller import RoomPlugs

# ═══════════════════════════════════════
# 설정
# ═══════════════════════════════════════
SENSOR_URL = "http://localhost:5000"
TAPO_CREDS = {
    "email": "your@email.com",
    "password": "yourpassword"
}
LOG_FILE = "/home/pi/cabin/agent_log.json"
MEMORY_FILE = "/home/pi/cabin/memory.json"

plugs = RoomPlugs(TAPO_CREDS)

# ═══════════════════════════════════════
# 메모리 (학습 저장소)
# ═══════════════════════════════════════
def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE) as f:
            return json.load(f)
    return {
        "empty_room_off_count": 0,   # 빈 방 전력 차단 횟수
        "co2_alert_count": 0,        # CO2 경고 횟수
        "avg_temp": [],              # 평균 온도 기록
        "total_saved_wh": 0          # 절약한 전력량
    }

def save_memory(mem):
    with open(MEMORY_FILE, "w") as f:
        json.dump(mem, f, ensure_ascii=False, indent=2)

# ═══════════════════════════════════════
# 로그
# ═══════════════════════════════════════
def log_action(action, reason, data=None):
    entry = {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action": action,
        "reason": reason,
        "data": data or {}
    }
    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            logs = json.load(f)
    logs.append(entry)
    logs = logs[-200:]  # 최근 200개만 유지
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, ensure_ascii=False, indent=2)
    print(f"[{entry['time']}] {action} — {reason}")

# ═══════════════════════════════════════
# 판단 엔진 (Rule-based + 학습)
# ═══════════════════════════════════════
def run_agent():
    """5분마다 실행되는 자율 판단 루프"""
    print(f"\n{'='*40}")
    print(f"에이전트 실행: {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*40}")

    mem = load_memory()
    actions_taken = []

    # --- 센서 데이터 읽기 ---
    try:
        r = requests.get(f"{SENSOR_URL}/cabin/all", timeout=5)
        sensors = r.json()
    except Exception as e:
        log_action("ERROR", f"센서 읽기 실패: {e}")
        return

    temp = sensors.get("Vehicle.Cabin.HVAC.AmbientAirTemperature", 25)
    humidity = sensors.get("Vehicle.Cabin.HVAC.Humidity", 50)
    co2 = sensors.get("Vehicle.Cabin.Air.CO2", 400)
    lux = sensors.get("Vehicle.Cabin.Light.Lux", 100)
    occupied = sensors.get("Vehicle.Cabin.IsOccupied", False)

    # --- 전력 현황 읽기 ---
    power_status = plugs.get_all_status()
    total_power = sum(s.get("current_power", 0) for s in power_status)

    # ══════════════════════════
    # 규칙 1: 빈 방 전력 낭비
    # ══════════════════════════
    if not occupied:
        for status in power_status:
            room = status["room"]
            power = status.get("current_power", 0)
            is_on = status.get("on", False)

            # 사람 없는데 50W 이상 소비 중이면 끄기
            if is_on and power > 50:
                plugs.turn_off(room)
                saved = power
                mem["empty_room_off_count"] += 1
                mem["total_saved_wh"] += saved / 12  # 5분 기준
                log_action(
                    f"{room} 전원 OFF",
                    f"사람 없음 + {power}W 소비 중",
                    {"power_saved": saved}
                )
                actions_taken.append(f"빈 {room} 절전 ({power}W 차단)")

    # ══════════════════════════
    # 규칙 2: 공기질 경고
    # ══════════════════════════
    if co2 > 1000:
        # 공기청정기가 꽂혀있는 플러그 켜기 (침실에 있다고 가정)
        plugs.turn_on("침실")
        mem["co2_alert_count"] += 1
        log_action(
            "공기청정기 ON",
            f"CO2 {co2}ppm 초과 (기준: 1000ppm)",
            {"co2": co2}
        )
        # LED 경고색
        requests.post(f"{SENSOR_URL}/cabin/led",
                     json={"mood": "alert"}, timeout=3)
        actions_taken.append(f"CO2 경고 ({co2}ppm) — 공기청정기 가동")

    # ══════════════════════════
    # 규칙 3: 온도에 따른 LED
    # ══════════════════════════
    elif occupied:  # 사람이 있을 때만 무드 변경
        if temp > 28:
            requests.post(f"{SENSOR_URL}/cabin/led",
                         json={"mood": "cool"}, timeout=3)
            log_action("LED → 쿨 블루", f"온도 {temp}°C (더움)")
        elif temp < 18:
            requests.post(f"{SENSOR_URL}/cabin/led",
                         json={"mood": "warm"}, timeout=3)
            log_action("LED → 웜 앰버", f"온도 {temp}°C (추움)")
        else:
            requests.post(f"{SENSOR_URL}/cabin/led",
                         json={"mood": "fresh"}, timeout=3)

    # ══════════════════════════
    # 규칙 4: 야간 수면 모드
    # ══════════════════════════
    hour = datetime.now().hour
    if hour >= 23 or hour < 6:
        # 밤 11시 ~ 새벽 6시: 조명 끄기, 수면 모드
        if lux > 10:  # 조명이 켜져 있으면
            requests.post(f"{SENSOR_URL}/cabin/led/off", timeout=3)
            log_action("수면 모드", f"야간 시간 ({hour}시)")

    # --- 메모리 업데이트 ---
    mem["avg_temp"].append(temp)
    mem["avg_temp"] = mem["avg_temp"][-288:]  # 24시간 (5분 × 288)
    save_memory(mem)

    # --- 상태 출력 ---
    avg_temp = sum(mem["avg_temp"]) / len(mem["avg_temp"]) if mem["avg_temp"] else temp
    print(f"온도: {temp}°C | CO2: {co2}ppm | 점유: {'있음' if occupied else '없음'}")
    print(f"전체 소비: {total_power}W | 총 절약: {mem['total_saved_wh']:.1f}Wh")
    if actions_taken:
        print(f"행동: {', '.join(actions_taken)}")
    else:
        print("이상 없음 — 대기 중")

# ═══════════════════════════════════════
# 아침 브리핑 (매일 8시)
# ═══════════════════════════════════════
def morning_brief():
    mem = load_memory()

    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            logs = json.load(f)

    # 어제 로그만 필터
    today = datetime.now().strftime("%Y-%m-%d")
    today_logs = [l for l in logs if l["time"].startswith(today)]

    avg_temp = (sum(mem["avg_temp"][-288:]) / len(mem["avg_temp"][-288:])
                if mem["avg_temp"] else 0)

    brief = f"""
🏠 홈 캐빈 AI — 아침 브리핑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 {today}

🌡️  평균 온도: {avg_temp:.1f}°C
⚡ 오늘 절약: {mem['total_saved_wh']:.1f}Wh
🔌 빈 방 절전: {mem['empty_room_off_count']}회
💨 CO2 경고: {mem['co2_alert_count']}회
📋 총 행동: {len(today_logs)}건

이상 없음 — 쾌적한 하루 되세요!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    """.strip()

    print(brief)

    # 하루 카운터 리셋
    mem["empty_room_off_count"] = 0
    mem["co2_alert_count"] = 0
    save_memory(mem)

# ═══════════════════════════════════════
# 스케줄 실행
# ═══════════════════════════════════════
if __name__ == "__main__":
    print("홈 캐빈 AI 에이전트 시작")

    # 5분마다 자율 판단
    schedule.every(5).minutes.do(run_agent)

    # 매일 아침 8시 브리핑
    schedule.every().day.at("08:00").do(morning_brief)

    # 시작 즉시 한 번 실행
    run_agent()

    while True:
        schedule.run_pending()
        time.sleep(30)
```

---

## STEP 8: 자동 시작 설정

Pi를 껐다 켜도 자동으로 시작되게 한다.

### 8-1. 센서 서버 서비스

```bash
sudo nano /etc/systemd/system/cabin-sensor.service
```

```ini
[Unit]
Description=Home Cabin AI Sensor Server
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi/cabin
Environment=PATH=/home/pi/cabin/bin
ExecStart=sudo /home/pi/cabin/bin/python3 /home/pi/cabin/sensor_server.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 8-2. 에이전트 서비스

```bash
sudo nano /etc/systemd/system/cabin-agent.service
```

```ini
[Unit]
Description=Home Cabin AI Agent
After=network.target cabin-sensor.service

[Service]
User=pi
WorkingDirectory=/home/pi/cabin
Environment=PATH=/home/pi/cabin/bin
ExecStart=/home/pi/cabin/bin/python3 /home/pi/cabin/agent.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 8-3. 서비스 등록 및 시작

```bash
sudo systemctl daemon-reload
sudo systemctl enable cabin-sensor cabin-agent
sudo systemctl start cabin-sensor cabin-agent

# 상태 확인
sudo systemctl status cabin-sensor
sudo systemctl status cabin-agent
```

→ `Active: active (running)` 나오면 성공. 이제 Pi를 껐다 켜도 자동 시작된다.

---

## STEP 9: 데모 시나리오

시스템이 정상 작동하는지 직접 테스트한다.

### 시나리오 A: 빈 방 절전

1. FSR402 센서에서 손을 뗀다 (사람 없음 시뮬레이션)
2. Tapo P110 플러그에 전등 스탠드를 꽂아둔다 (50W 이상)
3. 5분 기다린다
4. → 플러그 자동 OFF + 로그 기록

### 시나리오 B: CO2 경고

1. SGP30 센서에 숨을 세게 불어넣는다
2. CO2 1000ppm 초과 즉시:
   - LED → 빨간 경고색
   - 공기청정기 플러그 ON
   - 로그 기록

### 시나리오 C: 온도 반응 무드램프

1. DHT22 센서를 손으로 감싼다 (체온 28°C 이상)
2. → LED가 시원한 파란색으로 변경

### 시나리오 D: 야간 수면 모드

1. `datetime.now().hour`가 23 이상이 되면
2. → LED 자동 OFF

---

## STEP 10: 확인 및 모니터링

### 로그 실시간 보기

```bash
tail -f /home/pi/cabin/agent_log.json
```

### 전력 현황 수동 조회

```bash
source ~/cabin/bin/activate
python3 -c "
from tapo_controller import RoomPlugs
plugs = RoomPlugs({'email':'your@email.com','password':'yourpw'})
for s in plugs.get_all_status():
    print(s)
"
```

### 센서 API 전체 조회

```bash
curl http://localhost:5000/cabin/all | python3 -m json.tool
```

---

## 전체 아키텍처

```
┌─────────────────────────────────────────────────┐
│              Raspberry Pi 5 (홈 서버)            │
│                                                 │
│  ┌─────────────┐    ┌──────────────────────┐    │
│  │  센서 5종   │───▶│  sensor_server.py    │    │
│  │ DHT22       │    │  Flask REST API      │    │
│  │ BH1750      │    │  :5000/cabin/...     │    │
│  │ SGP30       │    └──────────┬───────────┘    │
│  │ FSR402      │               │                │
│  │ Pi Camera   │    ┌──────────▼───────────┐    │
│  └─────────────┘    │  agent.py            │    │
│                     │  자율 판단 루프       │    │
│  ┌─────────────┐    │  5분마다 실행        │    │
│  │ NeoPixel    │◀───│  규칙 기반 행동      │    │
│  │ LED Strip   │    │  메모리 학습         │    │
│  └─────────────┘    └──────────┬───────────┘    │
│                                │                │
└────────────────────────────────│────────────────┘
                                 │ Wi-Fi
                    ┌────────────▼────────────┐
                    │    Tapo P110 × 3         │
                    │    거실 / 침실 / 서재    │
                    │    전력 모니터링 + 제어  │
                    └─────────────────────────┘
```

---

## 다음 단계

이 시스템이 집에서 안정적으로 돌아가면, 다음 단계로 확장할 수 있다.

**1단계 완료** (지금): 센서 → 규칙 기반 자율 제어

**2단계**: Claude AI 연결 — 규칙이 아닌 자연어 판단
```python
# Claude가 센서 데이터를 보고 자유롭게 판단
response = claude.messages.create(
    model="claude-sonnet-4-6",
    messages=[{
        "role": "user",
        "content": f"현재 집 상태: {sensors}.
                    전력 현황: {power}.
                    최적 행동을 결정해줘."
    }]
)
```

**3단계**: 카메라 + 얼굴 인식 — 누가 어디 있는지 파악

**4단계**: 차량 캐빈 이식 — 동일한 코드를 차량 중앙 컴퓨터에 올리기

---

집이 살아있어지면, 차도 살아있어진다.

---

*이 가이드는 SDV(Software-Defined Vehicle) 캐빈 AI 개념을 가정 환경에서 실험하기 위해 작성되었습니다.*
