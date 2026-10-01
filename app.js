/**
 * EMAILNET — Modern Interactive Social Network Analysis Application
 * JavaScript Logic & Controller
 */

// Application State
let cy = null;
let currentSelectedNodeId = null;
let chartsInitialized = false;
let degreeChartInstance = null;
let closenessChartInstance = null;
let betweennessChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initCytoscapeGraph();
  initCentralityTablesAndCharts();
  initNodeExplorer();
  initGlobalSearch();
});

// ==========================================================================
// 1. PAGE ROUTER
// ==========================================================================
function initRouter() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPageId = tab.getAttribute('data-page');
      navigateToPage(targetPageId);
    });
  });
}

function navigateToPage(pageId) {
  // Update Tab active states
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-page') === pageId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update Page visibility
  document.querySelectorAll('.app-page').forEach(page => {
    if (page.id === pageId) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  // Lifecycle hooks for specific views
  if (pageId === 'page-explorer') {
    if (cy) {
      setTimeout(() => {
        cy.resize();
        if (!currentSelectedNodeId) {
          cy.fit(undefined, 40);
        }
      }, 50);
    }
  } else if (pageId === 'page-centrality') {
    if (!chartsInitialized) {
      setTimeout(renderAllCentralityCharts, 100);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// 2. CYTOSCAPE NETWORK EXPLORER
// ==========================================================================
function initCytoscapeGraph() {
  const container = document.getElementById('cy-network');
  if (!container || typeof cytoscape === 'undefined' || typeof NETWORK_DATA === 'undefined') {
    console.warn('Cytoscape or NETWORK_DATA not ready.');
    return;
  }

  // Build Cytoscape elements from precomputed verified data
  const elements = [];
  const topHubs = new Set([49, 25, 60, 35, 4, 54, 85, 48, 30, 87]);

  // Nodes
  NETWORK_DATA.nodes.forEach(n => {
    elements.push({
      group: 'nodes',
      data: {
        id: 'n' + n.id,
        rawId: n.id,
        label: n.id.toString(),
        degree_centrality: n.degree_centrality,
        in_degree: n.in_degree,
        out_degree: n.out_degree,
        total_degree: n.total_degree,
        closeness_centrality: n.closeness_centrality,
        betweenness_centrality: n.betweenness_centrality,
        isTopHub: topHubs.has(n.id)
      },
      position: {
        x: n.x * 650,
        y: n.y * 650
      }
    });
  });

  // Edges
  NETWORK_DATA.edges.forEach(e => {
    elements.push({
      group: 'edges',
      data: {
        id: 'e_' + e.source + '_' + e.target,
        source: 'n' + e.source,
        target: 'n' + e.target,
        rawSource: e.source,
        rawTarget: e.target
      }
    });
  });

  // Initialize Cytoscape
  cy = cytoscape({
    container: container,
    elements: elements,
    layout: {
      name: 'preset',
      fit: true,
      padding: 40
    },
    style: [
      // Base Node
      {
        selector: 'node',
        style: {
          'width': 'mapData(total_degree, 1, 98, 14, 44)',
          'height': 'mapData(total_degree, 1, 98, 14, 44)',
          'background-color': function(ele) {
            const deg = ele.data('total_degree');
            if (deg > 75) return '#eab308'; // Hub yellow
            if (deg > 50) return '#10b981'; // Core green
            if (deg > 25) return '#0284c7'; // Active blue
            return '#475569'; // Peripheral slate
          },
          'border-width': 1.5,
          'border-color': '#090d16',
          'label': function(ele) {
            return ele.data('isTopHub') ? ele.data('rawId') : '';
          },
          'color': '#ffffff',
          'font-size': '10px',
          'font-family': 'JetBrains Mono, monospace',
          'font-weight': 'bold',
          'text-valign': 'center',
          'text-halign': 'center',
          'text-outline-color': '#090d16',
          'text-outline-width': 1.5,
          'transition-property': 'background-color, border-color, opacity, border-width',
          'transition-duration': '0.2s'
        }
      },
      // Base Edge
      {
        selector: 'edge',
        style: {
          'width': 0.8,
          'line-color': '#334155',
          'opacity': 0.28,
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#475569',
          'arrow-scale': 0.7,
          'transition-property': 'line-color, opacity, width, target-arrow-color',
          'transition-duration': '0.2s'
        }
      },
      // Node Hover
      {
        selector: 'node:hover',
        style: {
          'label': 'data(rawId)',
          'font-size': '12px',
          'border-width': 2.5,
          'border-color': '#ffffff'
        }
      },
      // Selected Focus Node
      {
        selector: 'node.selected-focus',
        style: {
          'background-color': '#ef4444',
          'border-color': '#ffffff',
          'border-width': 3.5,
          'label': 'data(rawId)',
          'font-size': '13px',
          'z-index': 999
        }
      },
      // Neighbor Nodes
      {
        selector: 'node.neighbor-outgoing',
        style: {
          'border-color': '#3b82f6',
          'border-width': 2.5,
          'label': 'data(rawId)'
        }
      },
      {
        selector: 'node.neighbor-incoming',
        style: {
          'border-color': '#10b981',
          'border-width': 2.5,
          'label': 'data(rawId)'
        }
      },
      {
        selector: 'node.neighbor-mutual',
        style: {
          'border-color': '#f59e0b',
          'border-width': 2.5,
          'label': 'data(rawId)'
        }
      },
      // Highlighted Outgoing Edges
      {
        selector: 'edge.highlight-outgoing',
        style: {
          'line-color': '#3b82f6',
          'target-arrow-color': '#3b82f6',
          'width': 2.2,
          'opacity': 0.9,
          'z-index': 888
        }
      },
      // Highlighted Incoming Edges
      {
        selector: 'edge.highlight-incoming',
        style: {
          'line-color': '#10b981',
          'target-arrow-color': '#10b981',
          'width': 2.2,
          'opacity': 0.9,
          'z-index': 888
        }
      },
      // Dimmed Elements
      {
        selector: '.dimmed',
        style: {
          'opacity': 0.08
        }
      }
    ],
    minZoom: 0.25,
    maxZoom: 3.5
  });

  // Cytoscape Interactions
  cy.on('tap', 'node', function(evt) {
    const node = evt.target;
    selectAndHighlightNode(node.data('rawId'));
  });

  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      clearSelectionHighlights();
    }
  });

  // Explorer Toolbar Controls
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    cy.zoom({ level: cy.zoom() * 1.25, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    cy.zoom({ level: cy.zoom() * 0.8, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  });

  document.getElementById('btn-fit')?.addEventListener('click', () => {
    cy.fit(undefined, 40);
  });

  document.getElementById('btn-reset-selection')?.addEventListener('click', () => {
    clearSelectionHighlights();
  });

  // Layout Selector
  document.getElementById('select-layout')?.addEventListener('change', (e) => {
    const layoutName = e.target.value;
    applyLayout(layoutName);
  });

  // Floating Quick Card Close
  document.getElementById('btn-quick-close')?.addEventListener('click', () => {
    document.getElementById('quick-node-card')?.classList.add('hidden');
  });

  document.getElementById('btn-quick-inspect')?.addEventListener('click', () => {
    if (currentSelectedNodeId !== null) {
      navigateToPage('page-node-explorer');
      renderNodeExplorerProfile(currentSelectedNodeId);
    }
  });
}

function applyLayout(name) {
  if (!cy) return;
  if (name === 'preset') {
    cy.layout({
      name: 'preset',
      fit: true,
      padding: 40,
      animate: true,
      animationDuration: 600
    }).run();
  } else if (name === 'concentric') {
    cy.layout({
      name: 'concentric',
      concentric: function(node) {
        return node.data('degree_centrality') * 100;
      },
      levelWidth: () => 20,
      fit: true,
      padding: 40,
      animate: true,
      animationDuration: 600
    }).run();
  } else if (name === 'circle') {
    cy.layout({
      name: 'circle',
      fit: true,
      padding: 40,
      animate: true,
      animationDuration: 600
    }).run();
  } else if (name === 'cose') {
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 800,
      nodeRepulsion: 6500,
      idealEdgeLength: 60,
      padding: 40
    }).run();
  }
}

function selectAndHighlightNode(rawNodeId) {
  if (!cy) return;
  currentSelectedNodeId = rawNodeId;
  const targetNode = cy.getElementById('n' + rawNodeId);
  if (!targetNode || targetNode.length === 0) return;

  cy.batch(() => {
    // Reset classes
    cy.elements().removeClass('selected-focus neighbor-outgoing neighbor-incoming neighbor-mutual highlight-outgoing highlight-incoming dimmed');

    // Dim all
    cy.elements().addClass('dimmed');

    // Focus target
    targetNode.removeClass('dimmed').addClass('selected-focus');

    // Outgoing edges and neighbors
    const outEdges = targetNode.outgoers('edge');
    const inEdges = targetNode.incomers('edge');

    const outNeighbors = targetNode.outgoers('node');
    const inNeighbors = targetNode.incomers('node');

    outEdges.removeClass('dimmed').addClass('highlight-outgoing');
    inEdges.removeClass('dimmed').addClass('highlight-incoming');

    outNeighbors.removeClass('dimmed').addClass('neighbor-outgoing');
    inNeighbors.removeClass('dimmed').addClass('neighbor-incoming');

    // Mutual neighbors
    outNeighbors.intersection(inNeighbors).addClass('neighbor-mutual');
  });

  // Pan to node
  cy.animate({
    center: { eles: targetNode },
    duration: 350
  });

  // Show Quick Floating Card
  showQuickNodeCard(rawNodeId);
}

function clearSelectionHighlights() {
  if (!cy) return;
  currentSelectedNodeId = null;
  cy.batch(() => {
    cy.elements().removeClass('selected-focus neighbor-outgoing neighbor-incoming neighbor-mutual highlight-outgoing highlight-incoming dimmed');
  });
  document.getElementById('quick-node-card')?.classList.add('hidden');
}

function showQuickNodeCard(rawId) {
  const card = document.getElementById('quick-node-card');
  const title = document.getElementById('quick-node-title');
  const metricsBox = document.getElementById('quick-card-metrics');
  if (!card || !title || !metricsBox) return;

  const nodeObj = NETWORK_DATA.nodes.find(n => n.id === rawId);
  if (!nodeObj) return;

  title.textContent = `Node ${nodeObj.id}`;
  metricsBox.innerHTML = `
    <div class="quick-stat-row">
      <span class="quick-stat-label">Degree Centrality:</span>
      <span class="quick-stat-val" style="color: #60a5fa;">${nodeObj.degree_centrality.toFixed(4)}</span>
    </div>
    <div class="quick-stat-row">
      <span class="quick-stat-label">Closeness Centrality:</span>
      <span class="quick-stat-val" style="color: #34d399;">${nodeObj.closeness_centrality.toFixed(4)}</span>
    </div>
    <div class="quick-stat-row">
      <span class="quick-stat-label">Betweenness Centrality:</span>
      <span class="quick-stat-val" style="color: #c084fc;">${nodeObj.betweenness_centrality.toFixed(4)}</span>
    </div>
    <div class="quick-stat-row" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 4px; margin-top: 4px;">
      <span class="quick-stat-label">In-Degree:</span>
      <span class="quick-stat-val">${nodeObj.in_degree}</span>
    </div>
    <div class="quick-stat-row">
      <span class="quick-stat-label">Out-Degree:</span>
      <span class="quick-stat-val">${nodeObj.out_degree}</span>
    </div>
    <div class="quick-stat-row">
      <span class="quick-stat-label">Total Directed Ties:</span>
      <span class="quick-stat-val">${nodeObj.total_degree}</span>
    </div>
  `;
  card.classList.remove('hidden');
}

function jumpToNode(rawId) {
  navigateToPage('page-explorer');
  setTimeout(() => {
    selectAndHighlightNode(rawId);
  }, 150);
}

// ==========================================================================
// 3. CENTRALITY ANALYSIS TABLES & CHARTS
// ==========================================================================
function initCentralityTablesAndCharts() {
  if (typeof NETWORK_DATA === 'undefined') return;

  // Sub-tabs handling
  const subTabs = document.querySelectorAll('.sub-tab');
  subTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      subTabs.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.centrality-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = 'panel-' + btn.getAttribute('data-centrality');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Populate Tables
  populateTable('tbody-top10-degree', NETWORK_DATA.degree_centrality_top10, (row) => `
    <td>${row.rank}</td>
    <td><span class="node-tag" onclick="jumpToNode(${row.node})">Node ${row.node}</span></td>
    <td><code>${row.degree_centrality.toFixed(4)}</code></td>
    <td>${row.in_degree}</td>
    <td>${row.out_degree}</td>
    <td><strong>${row.total_degree}</strong></td>
  `);

  populateTable('tbody-top10-closeness', NETWORK_DATA.closeness_centrality_top10, (row) => `
    <td>${row.rank}</td>
    <td><span class="node-tag" onclick="jumpToNode(${row.node})">Node ${row.node}</span></td>
    <td><code>${row.closeness_centrality.toFixed(4)}</code></td>
    <td>${row.in_degree}</td>
    <td>${row.out_degree}</td>
  `);

  populateTable('tbody-top10-betweenness', NETWORK_DATA.betweenness_centrality_top10, (row) => `
    <td>${row.rank}</td>
    <td><span class="node-tag" onclick="jumpToNode(${row.node})">Node ${row.node}</span></td>
    <td><code>${row.betweenness_centrality.toFixed(4)}</code></td>
    <td>${row.in_degree}</td>
    <td>${row.out_degree}</td>
  `);
}

function populateTable(tbodyId, dataList, rowRenderer) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody || !dataList) return;
  tbody.innerHTML = dataList.map(item => `
    <tr onclick="jumpToNode(${item.node})">
      ${rowRenderer(item)}
    </tr>
  `).join('');
}

function renderAllCentralityCharts() {
  if (typeof Chart === 'undefined' || typeof NETWORK_DATA === 'undefined') return;
  chartsInitialized = true;

  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Degree Chart
  const degCtx = document.getElementById('chart-degree')?.getContext('2d');
  if (degCtx) {
    const degData = NETWORK_DATA.degree_centrality_top10;
    degreeChartInstance = new Chart(degCtx, {
      type: 'bar',
      data: {
        labels: degData.map(d => 'Node ' + d.node),
        datasets: [{
          label: 'Degree Centrality',
          data: degData.map(d => d.degree_centrality),
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: getCommonChartOptions((index) => {
        const rawId = degData[index].node;
        jumpToNode(rawId);
      })
    });
  }

  // Closeness Chart
  const closeCtx = document.getElementById('chart-closeness')?.getContext('2d');
  if (closeCtx) {
    const closeData = NETWORK_DATA.closeness_centrality_top10;
    closenessChartInstance = new Chart(closeCtx, {
      type: 'bar',
      data: {
        labels: closeData.map(d => 'Node ' + d.node),
        datasets: [{
          label: 'Closeness Centrality',
          data: closeData.map(d => d.closeness_centrality),
          backgroundColor: '#10b981',
          borderRadius: 4
        }]
      },
      options: getCommonChartOptions((index) => {
        const rawId = closeData[index].node;
        jumpToNode(rawId);
      })
    });
  }

  // Betweenness Chart
  const betCtx = document.getElementById('chart-betweenness')?.getContext('2d');
  if (betCtx) {
    const betData = NETWORK_DATA.betweenness_centrality_top10;
    betweennessChartInstance = new Chart(betCtx, {
      type: 'bar',
      data: {
        labels: betData.map(d => 'Node ' + d.node),
        datasets: [{
          label: 'Betweenness Centrality',
          data: betData.map(d => d.betweenness_centrality),
          backgroundColor: '#8b5cf6',
          borderRadius: 4
        }]
      },
      options: getCommonChartOptions((index) => {
        const rawId = betData[index].node;
        jumpToNode(rawId);
      })
    });
  }
}

function getCommonChartOptions(onClickHandler) {
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Value: ${context.parsed.x.toFixed(4)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#f8fafc', font: { weight: 600 } }
      }
    },
    onClick: (evt, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        onClickHandler(index);
      }
    }
  };
}

// ==========================================================================
// 4. NODE EXPLORER (PAGE 5)
// ==========================================================================
function initNodeExplorer() {
  const inspectBtn = document.getElementById('btn-inspect-node');
  const input = document.getElementById('node-id-input');

  const triggerInspect = () => {
    const rawVal = parseInt(input.value.trim(), 10);
    if (!isNaN(rawVal) && rawVal >= 0 && rawVal <= 88) {
      renderNodeExplorerProfile(rawVal);
    }
  };

  inspectBtn?.addEventListener('click', triggerInspect);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') triggerInspect();
  });

  // Quick Chips
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rawId = parseInt(btn.getAttribute('data-node'), 10);
      input.value = rawId;
      renderNodeExplorerProfile(rawId);
    });
  });

  // Default to Node 49
  renderNodeExplorerProfile(49);
}

function renderNodeExplorerProfile(nodeId) {
  const container = document.getElementById('node-profile-container');
  if (!container || typeof NETWORK_DATA === 'undefined') return;

  const node = NETWORK_DATA.nodes.find(n => n.id === nodeId);
  if (!node) {
    container.innerHTML = `<p style="color: #ef4444;">Node ID ${nodeId} not found in Department 3.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="node-header-row">
      <div class="node-main-badge">
        Node ${node.id}
        <span class="node-tag-sub">Department 3 Participant</span>
      </div>
      <button class="btn-primary" onclick="jumpToNode(${node.id})">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Highlight in Network Explorer
      </button>
    </div>

    <!-- Centrality & Degree Summary Grid -->
    <div class="node-metrics-stat-grid">
      <div class="node-stat-pill">
        <span class="stat-pill-label">Degree Centrality</span>
        <span class="stat-pill-val" style="color: #60a5fa;">${node.degree_centrality.toFixed(4)}</span>
      </div>
      <div class="node-stat-pill">
        <span class="stat-pill-label">Closeness Centrality</span>
        <span class="stat-pill-val" style="color: #34d399;">${node.closeness_centrality.toFixed(4)}</span>
      </div>
      <div class="node-stat-pill">
        <span class="stat-pill-label">Betweenness Centrality</span>
        <span class="stat-pill-val" style="color: #c084fc;">${node.betweenness_centrality.toFixed(4)}</span>
      </div>
      <div class="node-stat-pill">
        <span class="stat-pill-label">In-Degree (Received)</span>
        <span class="stat-pill-val">${node.in_degree}</span>
      </div>
      <div class="node-stat-pill">
        <span class="stat-pill-label">Out-Degree (Sent)</span>
        <span class="stat-pill-val">${node.out_degree}</span>
      </div>
      <div class="node-stat-pill">
        <span class="stat-pill-label">Total Connections</span>
        <span class="stat-pill-val">${node.total_degree}</span>
      </div>
    </div>

    <!-- Direct Connections Section -->
    <div class="connections-section">
      <h4>Direct Connections (${node.total_degree} total directed ties)</h4>
      <div class="connections-columns">
        
        <!-- Outgoing -->
        <div class="conn-box">
          <div class="conn-box-header">
            <span>Sent Emails To</span>
            <span class="conn-count-badge badge-out">${node.out_neighbors.length} nodes</span>
          </div>
          <div class="conn-tags-list">
            ${node.out_neighbors.length > 0
              ? node.out_neighbors.map(nbr => `<span class="conn-tag" onclick="inspectFromTag(${nbr})">Node ${nbr}</span>`).join('')
              : '<span style="color: #64748b; font-size: 11px;">No outgoing ties</span>'
            }
          </div>
        </div>

        <!-- Incoming -->
        <div class="conn-box">
          <div class="conn-box-header">
            <span>Received Emails From</span>
            <span class="conn-count-badge badge-in">${node.in_neighbors.length} nodes</span>
          </div>
          <div class="conn-tags-list">
            ${node.in_neighbors.length > 0
              ? node.in_neighbors.map(nbr => `<span class="conn-tag" onclick="inspectFromTag(${nbr})">Node ${nbr}</span>`).join('')
              : '<span style="color: #64748b; font-size: 11px;">No incoming ties</span>'
            }
          </div>
        </div>

        <!-- Mutual -->
        <div class="conn-box">
          <div class="conn-box-header">
            <span>Mutual (Bilateral Ties)</span>
            <span class="conn-count-badge badge-mutual">${node.mutual_neighbors.length} pairs</span>
          </div>
          <div class="conn-tags-list">
            ${node.mutual_neighbors.length > 0
              ? node.mutual_neighbors.map(nbr => `<span class="conn-tag" onclick="inspectFromTag(${nbr})">Node ${nbr}</span>`).join('')
              : '<span style="color: #64748b; font-size: 11px;">No mutual ties</span>'
            }
          </div>
        </div>

      </div>
    </div>
  `;
}

function inspectFromTag(nodeId) {
  const input = document.getElementById('node-id-input');
  if (input) input.value = nodeId;
  renderNodeExplorerProfile(nodeId);
}

// ==========================================================================
// 5. GLOBAL SEARCH AUTOCOMPLETE
// ==========================================================================
function initGlobalSearch() {
  const searchInput = document.getElementById('global-node-search');
  const dropdown = document.getElementById('search-suggestions');
  if (!searchInput || !dropdown || typeof NETWORK_DATA === 'undefined') return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      dropdown.classList.add('hidden');
      return;
    }

    const matches = NETWORK_DATA.nodes.filter(n => n.id.toString().includes(q)).slice(0, 6);
    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="search-item" style="color: #64748b;">No matching node ID</div>`;
    } else {
      dropdown.innerHTML = matches.map(n => `
        <div class="search-item" onclick="handleGlobalSelect(${n.id})">
          <span><strong>Node ${n.id}</strong> (Degree: ${n.total_degree})</span>
          <span style="font-family: var(--font-mono); font-size: 11px; color: #60a5fa;">C_D: ${n.degree_centrality.toFixed(2)}</span>
        </div>
      `).join('');
    }
    dropdown.classList.remove('hidden');
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const parsed = parseInt(searchInput.value.trim(), 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 88) {
        handleGlobalSelect(parsed);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function handleGlobalSelect(nodeId) {
  const searchInput = document.getElementById('global-node-search');
  const dropdown = document.getElementById('search-suggestions');
  if (searchInput) searchInput.value = '';
  if (dropdown) dropdown.classList.add('hidden');

  jumpToNode(nodeId);
}
