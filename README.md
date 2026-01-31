# AeroGuard — Hyperlocal AQI & Health Risk Forecaster

AeroGuard is an AI-powered system that goes beyond displaying city-wide AQI values.  
It provides **hyper-local**, **6-hour air quality forecasts** and translates them into **personalized health risk alerts** with **human-readable explanations**.

This project was built for the **AeroGuard Hackathon – Problem Statement PS02**.

---

## Problem Statement

Most air quality applications report a **single AQI value for an entire city**, masking critical variations across:

- Traffic junctions  
- Residential neighborhoods  
- Industrial zones  
- Green areas  

Additionally, **air pollution impacts people differently**.  
An AQI level that may be safe for a healthy adult can be harmful to:

- Children  
- Elderly individuals  
- Outdoor workers and athletes  

**AeroGuard** addresses these gaps by combining forecasting, spatial intelligence, persona-based health risk assessment, and explainable AI.

---

## System Architecture

AQI & Weather APIs → Data Preprocessing (24-hour history) → Time-Series Forecasting (SARIMA / XGBoost) → 6-Hour AQI Prediction → Spatial Interpolation (IDW) →Persona-Based Risk Engine → Explainability Engine → Streamlit Dashboard & Heatmap


---

## Features (Mapped to Problem Statement)

| Requirement | Implementation |
|------------|----------------|
| AQI forecast for next 6 hours | SARIMA & XGBoost models |
| Use last 24 hours of data | Time-series preprocessing pipeline |
| Handle noisy / missing data | Forward-fill & smoothing |
| Compare multiple models | Model comparison report |
| Persona-based health risk | Rule-based thresholds per persona |
| WHO/EPA-aligned AQI logic | Health-aware AQI mapping |
| Explainable predictions | Natural-language reasoning |
| Hyperlocal AQI estimation | IDW spatial interpolation |
| Visual heatmap | Folium (Leaflet-based) |
| Interactive UI | Streamlit dashboard |

---

## Supported Personas

- **Children / Elderly**
- **Outdoor Workers / Athletes**
- **General Public**

Each persona receives **different health advisories** for the same AQI level.

---

## Explainability Examples

AeroGuard explains *why* AQI levels change, not just *what* they are:

- Low wind speed is preventing pollutant dispersion  
- High humidity is trapping pollutants near ground level  
- Evening traffic emissions are increasing AQI  
- Sustained PM2.5 levels over recent hours  

---

## Repository Structure

```
├── app.py
├── requirements.txt
├── utils/
│   ├── fetch_data.py
│   ├── preprocess.py
│   ├── forecast.py
│   ├── spatial.py
│   ├── persona.py
│   └── explain.py
├── data/
│   └── sample_aqi_data.csv
└── report/
    └── model_comparison.pdf
```


---

## Tech Stack

### Backend & Machine Learning
- Python
- Pandas, NumPy
- SARIMA (statsmodels)
- XGBoost
- Scikit-learn

### Frontend & Visualization
- Streamlit
- Folium (Leaflet maps)

### APIs
- OpenWeather AQI API
- OpenWeather Weather API

---

## How to Run the Project

### 1. Install dependencies
pip install -r requirements.txt


### 2. Add your OpenWeather API key
Edit `utils/fetch_data.py`:
API_KEY = "YOUR_API_KEY"


### 3. Run the application
streamlit run app.py


---

## Model Comparison

To comply with the problem statement, multiple forecasting approaches were evaluated:

- SARIMA (selected for stability)
- XGBoost
- LSTM (experimental)

Details are documented in:
report/model_comparison.pdf


---

## What Makes AeroGuard Different

Most AQI dashboards show **current pollution levels**.

**AeroGuard delivers:**

> Forecasting → Hyperlocal Mapping → Personalized Health Risk → Explainable Insights

---

## Future Enhancements

- Advanced spatial interpolation using Kriging
- Real-time IoT sensor integration
- Mobile-optimized UI
- Long-term trend analytics

---

## Team

Aarya Tanwade - Team Leader, Project Manager and Full Stack Developer  
Surabhi Chopadekar - UI/UX Designer and Frontend Developer  
Parth Sonar - UI/UX Designer and Frontend Developer  
Atharva Vaidya - Product and Github Manager  

---
