# Email Communication Network Analysis and Identification of Structurally Central Individuals
**College Social Network Analysis (SNA) — Activity 1 (10 Marks)**

---

## 1. Activity 1: Network Visualization and Analysis

### Original Activity Problem Statement & Objective
> "Investigate an organizational email communication network by constructing a directed graph from empirical email exchange logs. Perform network visualization using a force-directed layout, compute and compare the three fundamental centrality measures (Degree, Closeness, and Betweenness Centrality) to identify key individuals, determine network-level cohesion metrics (Transitivity and Reciprocity), evaluate connectivity patterns through Degree Assortativity, and formulate evidence-based conclusions regarding organizational communication dynamics."

---

## 2. Objective

The objective of this project is to construct a directed social network from the verified **Email-Eu-Core Department 3** interaction logs, quantify both microscopic (node-level) and macroscopic (network-level) structural characteristics without synthetic data generation, identify structurally central individuals (hubs, authorities, and brokers), and analyze how information propagates through the departmental hierarchy.

Specifically, the project aims to answer:
1. **Network Visualization:** How are members of Department 3 organized in communication space, and what does the force-directed topology reveal about the presence of a cohesive core versus a sparse periphery?
2. **Degree Centrality:** Who are the highest-volume communicators (in-degree, out-degree, and total connections)?
3. **Closeness Centrality:** Which individuals possess the shortest communication paths to rapidly receive or absorb information from across the department?
4. **Betweenness Centrality:** Which individuals serve as critical structural bridges and informational gatekeepers controlling shortest paths between disparate subgroups?
5. **Network Transitivity:** To what extent are communication ties locally clustered into closed triangles (triadic closure)?
6. **Network Reciprocity:** How prevalent are bilateral (two-way) mutual communication relationships compared to unidirectional broadcasts?
7. **Degree Assortativity:** Do individuals tend to communicate with peers of similar connectivity levels (assortative mixing), or do high-degree hubs connect across connectivity tiers with peripheral members (disassortative mixing)?

---

## 3. Tools & Dataset

### Computational Stack
* **Language:** Python 3.x
* **Network Analysis:** NetworkX (v3.7)
* **Data Processing:** Pandas (v3.0.6)
* **Visualization:** Matplotlib (v3.10)

### Dataset Specification
* **Dataset:** Email-Eu-Core Temporal (Department 3)
* **Filename:** `email-Eu-core-temporal-Dept3.txt`
* **Data Source:** Stanford Large Network Dataset Collection (SNAP) ([Stanford SNAP Repository](https://snap.stanford.edu/data/email-Eu-core-temporal.html))
* **Raw Record Count:** **12,216 email records**
* **Unique Nodes ($|V|$):** **89 individuals**
* **Unique Directed Edges ($|E|$):** **1,506 directed ties**
* **Edge Semantics:** A directed edge $A \rightarrow B$ denotes that person $A$ sent at least one email to person $B$. Multiple emails between the same sender and receiver collapse into a single directed tie for static topology analysis. Direction of communication is strictly preserved.

---

## 4. Methodology

The end-to-end analytical workflow follows a deterministic 11-stage pipeline:

```
Dataset (12,216 temporal records)
       ↓
Data Preprocessing (Deduplication of static pairs, direction preservation)
       ↓
Directed Network Construction (NetworkX DiGraph: 89 nodes, 1,506 directed edges)
       ↓
Network Visualization (Spring Force-Directed Layout, k=1.45, arrowheads)
       ↓
Degree Centrality (C_D(v) = (in_deg + out_deg) / (n - 1))
       ↓
Closeness Centrality (C_C(u) = (n - 1) / sum(d(v, u)))
       ↓
Betweenness Centrality (C_B(v) = sum(sigma_st(v) / sigma_st))
       ↓
Network Transitivity (T = 3 * triangles / triads)
       ↓
Network Reciprocity (r = |E ∩ E^T| / |E|)
       ↓
Degree Assortativity (Pearson correlation of out-degree to in-degree)
       ↓
Academic Interpretation & Conclusion (10-Mark Report Synthesis)
```

---

## 5. Results & Conclusion

### 5.1 Basic Network Statistics

| Metric | Calculated Value | Interpretation |
| :--- | :--- | :--- |
| **Nodes ($|V|$)** | **89** | Total active individuals within Department 3. |
| **Directed Edges ($|E|$)** | **1,506** | Unique directed communication channels. |
| **Raw Email Records** | **12,216** | Total email exchanges (~8.1 emails per directed tie). |
| **Network Density ($D$)** | **0.1923 (19.23%)** | $\frac{1506}{89 \times 88}$; nearly 1 in 5 possible ties exist. |
| **Mutual Directed Edges** | **1,066** | 533 bidirectional pairs of mutually communicating individuals. |
| **Weakly Connected Components** | **1** | All 89 nodes belong to a single connected network structure. |
| **Strongly Connected Core** | **79 nodes** | 79 nodes can mutually reach each other; 10 nodes are peripheral sinks (in > 0, out = 0). |

---

### 5.2 Network Visualization

The static email communication network of Department 3 was rendered using a force-directed spring layout (`nx.spring_layout`, seed=42, $k=1.45$, iterations=200).

* **Nodes:** All 89 nodes are displayed. Node size and color correspond to total degree centrality using the continuous Viridis palette (dark blue/purple = peripheral; yellow/green = dense core).
* **Edges:** All 1,506 directed ties are drawn with subtle directional arrows and alpha transparency to reveal network density without visual clumping.
* **Labels:** Prominent departmental hubs (Nodes 49, 25, 60, 35, 4, 54, 85, 48, 30, 87) are distinctly labeled with high-contrast identifiers.
* **Artifact File:** `email_network_visualization.png` / `network_visualization.png`

**Figure Title:**
> **Email Communication Network – Department 3**

---

### 5.3 Centrality Analysis

#### Table 1: Degree Centrality (Top Individuals)

| Rank | Node | Degree Centrality | In-Degree (Received) | Out-Degree (Sent) | Total Degree |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Node 49** | **1.1136** | 42 | 56 | 98 |
| **2** | **Node 25** | **1.0682** | 46 | 48 | 94 |
| **3** | **Node 60** | **1.0568** | 42 | 51 | 93 |
| **4** | **Node 35** | **0.9432** | 32 | 51 | 83 |
| **5** | **Node 4** | **0.9205** | 37 | 44 | 81 |
| 6 | Node 30 | 0.8295 | 31 | 42 | 73 |
| 7 | Node 54 | 0.7727 | 32 | 36 | 68 |
| 8 | Node 87 | 0.7614 | 29 | 38 | 67 |
| 9 | Node 48 | 0.7386 | 28 | 37 | 65 |
| 10 | Node 23 | 0.7386 | 32 | 33 | 65 |

*Note on NetworkX normalization:* For directed graphs, NetworkX normalizes degree centrality by $(n-1) = 88$. Node 49's total degree of 98 yields $\frac{98}{88} = 1.1136$.

#### Table 2: Closeness Centrality (Top Individuals)

| Rank | Node | Closeness Centrality | Substantive Meaning |
| :---: | :---: | :---: | :--- |
| **1** | **Node 25** | **0.6285** | Shortest average incoming path distance; most accessible recipient. |
| **2** | **Node 49** | **0.6065** | Highly proximate to all communication streams. |
| **3** | **Node 60** | **0.6012** | Rapid reception capability from diverse subgroups. |
| **4** | **Node 4** | **0.5761** | Close structural proximity to the operational core. |
| **5** | **Node 54** | **0.5531** | Efficient information receiver. |
| 6 | Node 35 | 0.5531 | Tied 5th rank in overall proximity. |
| 7 | Node 30 | 0.5487 | Compact shortest path distribution. |
| 8 | Node 88 | 0.5487 | Tied 7th rank in overall proximity. |
| 9 | Node 85 | 0.5401 | Well-integrated core communicator. |
| 10 | Node 23 | 0.5401 | Tied 9th rank in overall proximity. |

#### Table 3: Betweenness Centrality (Top Individuals)

| Rank | Node | Betweenness Centrality | Structural Role |
| :---: | :---: | :---: | :--- |
| **1** | **Node 60** | **0.0661** | Chief Information Broker; controls critical inter-group pathways. |
| **2** | **Node 49** | **0.0600** | Secondary Broker and high-volume departmental coordinator. |
| **3** | **Node 25** | **0.0571** | Key Intermediary in administrative and technical flow. |
| **4** | **Node 85** | **0.0454** | Conduit connecting core nodes to specialized periphery. |
| **5** | **Node 4** | **0.0412** | Cross-subgroup router. |
| 6 | Node 48 | 0.0400 | Subgroup boundary spanner. |
| 7 | Node 35 | 0.0380 | Dissemination bridge for outward email chains. |
| 8 | Node 88 | 0.0370 | Relay node for research sub-clusters. |
| 9 | Node 30 | 0.0296 | Support broker within the core cluster. |
| 10 | Node 80 | 0.0292 | Gateway between peripheral nodes and core leadership. |

#### Table 4: Compact Comparison Table of Top Individuals Across All Centrality Measures

| Rank | Degree Centrality | Closeness Centrality | Betweenness Centrality |
| :---: | :---: | :---: | :---: |
| **1** | **Node 49** (1.1136) | **Node 25** (0.6285) | **Node 60** (0.0661) |
| **2** | **Node 25** (1.0682) | **Node 49** (0.6065) | **Node 49** (0.0600) |
| **3** | **Node 60** (1.0568) | **Node 60** (0.6012) | **Node 25** (0.0571) |
| **4** | **Node 35** (0.9432) | **Node 4** (0.5761) | **Node 85** (0.0454) |
| **5** | **Node 4** (0.9205) | **Node 54** (0.5531) | **Node 4** (0.0412) |

**Key Structural Observation:**
Nodes **49, 25, and 60** consistently dominate the top three positions across all three centrality dimensions. They form the structural core of Department 3, playing complementary roles: Node 49 is the most active outreach communicator, Node 25 is the most accessible receiver, and Node 60 is the leading structural broker.

---

### 5.4 Network Measures

#### Network Transitivity: `0.3688`
* **Network Transitivity: 0.3688**
* **Interpretation:** Transitivity measures the fraction of potential directed triads (two directed edges sharing a vertex) that form closed triangles ($T = 3 \times \frac{\#\text{triangles}}{\#\text{triads}}$). A value of **0.3688** indicates that approximately **36.88%** of two-step directed communication paths are closed by a direct tie. This demonstrates substantial localized clustering within Department 3, indicating that communication is organized around tightly knit working groups where colleagues of a member frequently communicate with each other. *(Note: The undirected transitivity is 0.4571).*

#### Network Reciprocity: `0.7078`
* **Network Reciprocity: 0.7078**
* **Interpretation:** Network reciprocity measures the proportion of directed edges that possess an edge in the reverse direction ($A \rightarrow B$ and $B \rightarrow A$). Out of 1,506 directed ties, **1,066 edges belong to mutual reciprocal pairs (533 bidirectional connections)**. A reciprocity score of **0.7078 (70.78%)** indicates that more than 7 out of 10 email relationships are actively reciprocated. This proves that Department 3 possesses an interactive, conversational workplace culture dominated by bilateral dialogue rather than unidirectional announcements or broadcast memos.

#### Degree Assortativity: `-0.1387`
* **Degree Assortativity: -0.1387**
* **Measure Used:** Directed out-degree to in-degree assortativity (`nx.degree_assortativity_coefficient(G, x='out', y='in')`).
* **Interpretation:** Degree assortativity quantifies the correlation between the degrees of connected nodes across directed edges. A negative coefficient of **-0.1387** demonstrates mild degree disassortativity. In Department 3, individuals with high connectivity (hubs and coordinators) frequently connect with individuals possessing lower or moderate connectivity (specialized researchers or junior staff). This structural pattern is characteristic of functional organizational hierarchies where central figures coordinate tasks across diverse organizational tiers rather than confining their communication to an exclusive high-degree elite clique.

---

### 5.5 Key Findings

1. **Highest Degree Centrality:** **Node 49** attains the highest degree centrality of **1.1136** with **98 total ties** (42 in-degree, 56 out-degree), establishing it as the primary volume communicator and outreach leader in Department 3.
2. **Highest Closeness Centrality:** **Node 25** achieves the highest closeness centrality of **0.6285** (and highest in-degree of 46), indicating that it possesses the shortest average communication path distance from all departmental peers and is the most accessible receiver of information.
3. **Highest Betweenness Centrality:** **Node 60** achieves the highest betweenness centrality of **0.0661**, followed closely by Node 49 (0.0600) and Node 25 (0.0571), identifying Node 60 as the chief structural broker and boundary spanner controlling information flow between departmental subgroups.
4. **Dominant Core Triad:** Nodes **49, 25, and 60** consistently capture the top three positions across Degree, Closeness, and Betweenness centrality, proving that departmental communication is anchored by this core triad.
5. **High Communication Reciprocity (70.78%):** Over 70% of directed email ties are mutual (1,066 edges forming 533 reciprocal pairs), confirming a collaborative culture characterized by active two-way dialogue.
6. **Disassortative Hierarchical Mixing (-0.1387):** The negative degree assortativity of **-0.1387** reveals that high-degree coordinators maintain frequent direct communication with peripheral, lower-degree team members, providing structural cohesion across all levels of the department.

---

### 5.6 Conclusion

The social network analysis of Department 3's email communications reveals a dense, cohesive, and highly reciprocal (70.78%) organizational network comprising 89 individuals and 1,506 directed ties. Centrality analysis definitively identifies Nodes 49, 25, and 60 as the structural anchors of the department, fulfilling complementary roles as the primary volume communicator, the most efficient receiver, and the essential boundary broker, respectively. A transitivity of 0.3688 confirms strong local team clustering, while the negative degree assortativity (-0.1387) reflects an accessible hierarchical structure where central leaders actively communicate across connectivity strata to coordinate departmental operations.
