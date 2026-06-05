# CardioSim 3D — Interactive Heart Anatomy Simulation

![CardioSim 3D Logo](https://img.shields.io/badge/CardioSim-3D-red?style=for-the-badge&logo=heart)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Built%20With-HTML%20%7C%20CSS%20%7C%20JS-orange?style=for-the-badge)

**CardioSim 3D** is a premium, ultra-realistic interactive 3D human heart educational visualization. Designed for medical students, healthcare professionals, and biology enthusiasts, it provides a cinematic experience to explore the complex anatomy and physiology of the human heart.

---

## 🌟 Key Features

### 1. Interactive 3D Visualization
- **Photorealistic Model**: High-fidelity 3D human heart model rendered using the **Sketchfab Viewer API**.
- **Full Control**: Rotate, zoom, and pan around the heart to inspect every detail from any angle.
- **Dynamic Interaction**: Hover over or click on specific parts of the heart to see instant anatomical callouts and detailed descriptions.

### 2. Heart Rate Control (BPM)
- **Real-time Adjustment**: Change the heart rate from **30 BPM (Bradycardia)** to **200 BPM (Tachycardia)**.
- **Visual Feedback**: The 3D animation speed and UI pulsing synchronize with the selected BPM.
- **Presets**: Quick-toggle between **Resting (60 BPM)**, **Normal (72 BPM)**, and **Exercise (150 BPM)** states.

### 3. Comprehensive Anatomy Database
- **24+ Annotated Structures**: Detailed information on chambers (Atria, Ventricles), vessels (Aorta, Vena Cava), valves (Mitral, Tricuspid), and the electrical system (SA Node, AV Node).
- **Functional Insights**: Learn not just the names, but the specific **functional role** and **blood flow details** for each structure.
- **Color-Coded Learning**: Visual indicators for oxygenated (red) vs. deoxygenated (blue) blood.

### 4. Disease Simulation
- Explore how different conditions affect the heart:
  - ✅ **Healthy**: Standard sinus rhythm.
  - 🚫 **Blocked Artery**: Simulating coronary artery blockage and its impact.
  - ⚠️ **Valve Malfunction**: Simulating mitral valve regurgitation and backward blood flow.
  - 💔 **Arrhythmia**: Simulating atrial fibrillation with irregular, rapid heartbeats.

### 5. Educational Guided Tour
- A step-by-step interactive walkthrough that explains the complete cardiac cycle.
- Covers blood return, pulmonary circulation, systemic ejection, and the electrical conduction pathway.

### 6. Interactive Quiz Mode
- Test your knowledge with a built-in quiz.
- Randomized questions covering heart anatomy, valve functions, and circulatory paths.
- Instant feedback with detailed medical explanations for every answer.

---

## 🛠️ Technical Stack

- **Core**: Semantic HTML5 & Modern JavaScript (Vanilla ES6+).
- **3D Engine**: [Sketchfab Viewer API](https://sketchfab.com/developers/viewer) for high-performance 3D rendering.
- **Styling**: Vanilla CSS3 with:
  - **Glassmorphism**: Sleek, frosted-glass UI panels.
  - **Neon Aesthetics**: Cyber-medical theme with vibrant gradients and glowing accents.
  - **Responsive Design**: Optimized for desktops and large tablets.
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) and [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.

---

## 📂 Project Structure

```text
├── index.html      # Main application entry point and layout
├── app.js          # Core logic, API integration, and UI state management
├── data.js         # Modular anatomy data and conduction curves
├── style.css       # Premium CSS design system and animations
└── README.md       # Project documentation (this file)
```

---

## 🚀 How to Run

1. Clone or download the repository.
2. Open `index.html` in any modern web browser.
3. *Note: An internet connection is required to load the 3D model via the Sketchfab API and Google Fonts.*

---

## 🏥 Medical Accuracy Disclaimer
While CardioSim 3D is designed for educational purposes and based on anatomical models, it is **not** a diagnostic tool. Always consult a qualified medical professional for health-related advice or clinical diagnoses.

---

*Designed with ❤️ for Medical Education.*
