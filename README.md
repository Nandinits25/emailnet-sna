# EMAILNET — Email Communication Network Analysis
### Department 3 Communication Network | Social Network Analysis (Activity 1)

---

## Quick Start: How to Open the Application

The application is currently running locally. You can open it immediately at:

### 🔗 **Local URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
*(or [http://localhost:8000](http://localhost:8000))*

> **Direct File Access:** You can also double-click [`index.html`](file:///c:/Users/Nandini%20TS/OneDrive/Documents/SNA%20Project/index.html) in Windows File Explorer. All dependencies (`cytoscape.min.js`, `chart.umd.min.js`, `network_data.js`) are bundled locally for 100% offline operation.

---

## How to Run from Terminal

1. **Calculate SNA Metrics & Export Datasets:**
   ```bash
   python analyze_network.py
   ```
   This processes `email-Eu-core-temporal-Dept3.txt`, performs all NetworkX calculations, generates the publication figures (`email_network_visualization.png`, `centrality_comparison_charts.png`), and exports `results.json` and `network_data.js`.

2. **Start the Local Web Server:**
   ```bash
   python -m http.server 8000 --bind 127.0.0.1
   ```

3. **Open in Your Browser:**
   Navigate to: **`http://127.0.0.1:8000`**

---

## Application Structure (7 Interactive Pages)

1. **Page 1 — Overview:** Hero dashboard featuring the 5 primary metric cards (89 Nodes, 1,506 Directed Edges, 12,216 Records, 70.78% Reciprocity, 36.88% Transitivity), network preview, and concise dataset specifications.
2. **Page 2 — Network Explorer:** Fully interactive Cytoscape.js network graph of all 89 nodes and 1,506 directed ties. Supports zoom, pan, node dragging, click-to-highlight (incoming in green, outgoing in blue, mutual in amber), degree-scaled nodes, and layout switching (Preset Force, Concentric, Circular, COSE).
3. **Page 3 — Centrality Analysis:** Three dedicated tabs for Degree, Closeness, and Betweenness centrality with top 10 tables and Chart.js horizontal bar charts. Clicking any row or bar jumps to and highlights that node in the Network Explorer.
4. **Page 4 — Network Metrics:** Rigorous macroscopic metrics dashboard explaining Network Density (0.1923), Transitivity (0.3688), Reciprocity (0.7078), Degree Assortativity (-0.1387), Weakly Connected Components (1), and Strongly Connected Components (11).
5. **Page 5 — Node Explorer:** Search any Node ID (0 to 88) or use quick chips (Nodes 49, 25, 60, 35, 4, etc.) to inspect individual degree/centrality scores and detailed lists of outgoing, incoming, and mutual communication partners.
6. **Page 6 — Central Nodes:** Comparative synthesis of the top structurally central nodes across each centrality dimension using neutral scientific terminology.
7. **Page 7 — Academic Report:** Formal report following the professor's exact 5-section format (Activity 1, Objective, Tools & Dataset, Methodology, Results & Conclusion) with print/PDF support.

---

## Verified Dataset Metrics Summary

* **Dataset:** Email-Eu-Core Temporal Department 3 (Stanford SNAP)
* **Nodes:** 89
* **Unique Directed Edges:** 1,506
* **Email Records:** 12,216
* **Network Density:** 0.1923 (19.23%)
* **Reciprocity:** 0.7078 (70.78%) — 1,066 mutual directed ties (533 bidirectional pairs)
* **Transitivity:** 0.3688 (36.88% triadic closure)
* **Degree Assortativity:** -0.1387 (Out-to-In directed degree correlation)
* **Weakly Connected Components:** 1 (all 89 nodes connected)
* **Strongly Connected Components:** 11 (largest SCC: 79 nodes; 10 peripheral receiver nodes)
* **Top Central Nodes:**
  * **Degree Centrality:** Node 49 (1.1136 | In: 42, Out: 56, Total: 98)
  * **Closeness Centrality:** Node 25 (0.6285)
  * **Betweenness Centrality:** Node 60 (0.0661)
