/**
 * Gestão de Frotas - Sistema de Cadastro de Veículos
 * CRUD completo com sincronização Firebase
 */

// ===== Firebase Configuration =====
const firebaseConfig = {
    apiKey: "AIzaSyDIQ1NYUBF6ZFwRzvZTaivhUWlkJrQN16k",
    authDomain: "id-search-52d2d.firebaseapp.com",
    databaseURL: "https://id-search-52d2d-default-rtdb.firebaseio.com",
    projectId: "id-search-52d2d",
    storageBucket: "id-search-52d2d.firebasestorage.app",
    messagingSenderId: "23874380914",
    appId: "1:23874380914:web:2cdbaaa06b36e412078eeb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const frotasRef = database.ref('frotas');

// ===== Global State =====
const state = {
    veiculos: [],
    filteredVeiculos: [],
    editingId: null,
    firebaseConnected: false
};

// ===== Dados Iniciais =====
const DADOS_INICIAIS = [
    { frota: "33001", chassis: "1NWC570HJMT210059", tipo: "" },
    { frota: "33002", chassis: "1NWC570HPMT210060", tipo: "" },
    { frota: "33003", chassis: "1NWC570HTMT210574", tipo: "" },
    { frota: "33004", chassis: "1NWC570HJNT230040", tipo: "" },
    { frota: "33005", chassis: "1NWC570HCNT230041", tipo: "" },
    { frota: "33006", chassis: "1NWC570HHNT230062", tipo: "" },
    { frota: "33007", chassis: "1NWC570HTST250179", tipo: "" },
    { frota: "15046", chassis: "1NWC570HHHT170045", tipo: "" },
    { frota: "10215", chassis: "1BM6150JALD001787", tipo: "" },
    { frota: "30042", chassis: "1BM7230JPNH007163", tipo: "" },
    { frota: "30030", chassis: "1BM6115JJMD002324", tipo: "" },
    { frota: "30068", chassis: "1BM6150JERD641575", tipo: "Tratos Imã" },
    { frota: "12015", chassis: "953658269DR307224", tipo: "Comboio" },
    { frota: "32037", chassis: "E947585", tipo: "Volvo 540 Euro 6" },
    { frota: "32021", chassis: "9BSG6X400P4033530", tipo: "SCANIA G540" },
    { frota: "32046", chassis: "93KK0Y1A3RE200204", tipo: "Volvo VM290 4×2R" },
    { frota: "32026", chassis: "9BM958154NB313441", tipo: "Atego Oficina CCT" },
    { frota: "32010", chassis: "9BM958154MB205018", tipo: "Atego Oficina CCT" },
    { frota: "10154", chassis: "1BM6190JKHD000230", tipo: "" },
    { frota: "30044", chassis: "1BM7230JJNH007182", tipo: "" },
    { frota: "30054", chassis: "1BM7230JCPH009292", tipo: "" },
    { frota: "30034", chassis: "1BM7200JPMH002249", tipo: "" },
    { frota: "30031", chassis: "1BM7200JCMH002238", tipo: "" },
    { frota: "30032", chassis: "1BM7200JCMH002241", tipo: "" },
    { frota: "30052", chassis: "1BM7230JHPH009265", tipo: "" },
    { frota: "30040", chassis: "1BM7230JHNH7142", tipo: "" },
    { frota: "32042", chassis: "9BVXT60D8RE602610", tipo: "Volvo Euro 6 2024" },
    { frota: "12081", chassis: "9BVJG30DXCE785634", tipo: "FM500" },
    { frota: "32001", chassis: "93KK0EOODXB124270", tipo: "" },
    { frota: "30027", chassis: "1BM6150JAMD003444", tipo: "" },
    { frota: "32004", chassis: "9BVXG40D8ME896711", tipo: "" },
    { frota: "32038", chassis: "9BVXT60D7RE602520", tipo: "" },
    { frota: "32015", chassis: "9BFZEANE9EBS65892", tipo: "Ford" },
    { frota: "32007", chassis: "9BVXG40D3ME896713", tipo: "Volvo" },
    { frota: "32006", chassis: "9BVXG40D9ME896715", tipo: "" },
    { frota: "32043", chassis: "9BVXT60D2RE602517", tipo: "Volvo 540" },
    { frota: "32023", chassis: "9BSG6X400P4033508", tipo: "Scania" },
    { frota: "32024", chassis: "9BSG6X400P4033431", tipo: "Scania" },
    { frota: "31151", chassis: "164459", tipo: "NONINHO" },
    { frota: "32002", chassis: "93KK0S1D2LE168277", tipo: "RFB5B85" },
    { frota: "32013", chassis: "93KK0S1DXME173640", tipo: "" },
    { frota: "32003", chassis: "93KK0S1D5LE168278", tipo: "" },
    { frota: "30050", chassis: "CAT0140KVJPA06368", tipo: "" },
    { frota: "30079", chassis: "1BM7230CCSH001347", tipo: "" },
    { frota: "32033", chassis: "9BM958264NB312571", tipo: "" },
    { frota: "32009", chassis: "9BVXG40D4ME896717", tipo: "" },
    { frota: "30048", chassis: "HBZN0200CMAF09131", tipo: "" },
    { frota: "30061", chassis: "93KK0S1DXME173640", tipo: "CAT" },
    { frota: "30069", chassis: "1BM6150JKRD641582", tipo: "" },
    { frota: "32027", chassis: "9BM958264NB314203", tipo: "" },
    { frota: "30072", chassis: "CAT00320CBR660300", tipo: "" },
    { frota: "30073", chassis: "CAT00140HRZW00314", tipo: "" },
    { frota: "32028", chassis: "9BM958154NB313368", tipo: "" },
    { frota: "22079", chassis: "9BVASW0D1AE764264", tipo: "" },
    { frota: "30028", chassis: "1BM6150JJMD003472", tipo: "" },
    { frota: "30029", chassis: "1BM6150JKMD003471", tipo: "" },
    { frota: "30066", chassis: "1BZ624KACPD002156", tipo: "" },
    { frota: "30067", chassis: "1BZ624KAPPD002158", tipo: "" },
    { frota: "32032", chassis: "9BM958260PB298841", tipo: "" },
    { frota: "32017", chassis: "9BM979078NB251316", tipo: "" }
];

// ===== DOM Elements =====
const elements = {
    // Table
    tableBody: document.getElementById('tableBody'),
    noResults: document.getElementById('noResults'),
    totalCount: document.getElementById('totalCount'),
    resultCount: document.getElementById('resultCount'),

    // Search
    searchInput: document.getElementById('searchInput'),

    // Buttons
    novoVeiculoBtn: document.getElementById('novoVeiculoBtn'),

    // Modal
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalClose: document.getElementById('modalClose'),
    veiculoForm: document.getElementById('veiculoForm'),
    veiculoId: document.getElementById('veiculoId'),
    inputFrota: document.getElementById('inputFrota'),
    inputChassis: document.getElementById('inputChassis'),
    inputTipo: document.getElementById('inputTipo'),
    btnCancelar: document.getElementById('btnCancelar'),
    btnSalvar: document.getElementById('btnSalvar'),

    // Delete Modal
    deleteModalOverlay: document.getElementById('deleteModalOverlay'),
    deleteVeiculoInfo: document.getElementById('deleteVeiculoInfo'),
    btnCancelDelete: document.getElementById('btnCancelDelete'),
    btnConfirmDelete: document.getElementById('btnConfirmDelete'),

    // Status
    syncStatus: document.getElementById('syncStatus'),

    // UI
    toast: document.getElementById('toast'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    carregarVeiculos();
});

function initEventListeners() {
    // Search
    elements.searchInput.addEventListener('input', debounce(filtrarVeiculos, 200));

    // Novo Veículo
    elements.novoVeiculoBtn.addEventListener('click', abrirModalNovo);

    // Modal
    elements.modalClose.addEventListener('click', fecharModal);
    elements.btnCancelar.addEventListener('click', fecharModal);
    elements.btnSalvar.addEventListener('click', salvarVeiculo);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) fecharModal();
    });

    // Delete Modal
    elements.btnCancelDelete.addEventListener('click', fecharDeleteModal);
    elements.btnConfirmDelete.addEventListener('click', confirmarExclusao);
    elements.deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.deleteModalOverlay) fecharDeleteModal();
    });

    // Input transformations
    elements.inputChassis.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });

    elements.inputFrota.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
}

// ===== CRUD Operations =====
function abrirModalNovo() {
    state.editingId = null;
    elements.modalTitle.textContent = 'Novo Veículo';
    elements.veiculoForm.reset();
    elements.modalOverlay.classList.remove('hidden');
    elements.inputFrota.focus();
}

function abrirModalEditar(id) {
    const veiculo = state.veiculos.find(v => v.id === id);
    if (!veiculo) return;

    state.editingId = id;
    elements.modalTitle.textContent = 'Editar Veículo';
    elements.inputFrota.value = veiculo.frota;
    elements.inputChassis.value = veiculo.chassis;
    elements.inputTipo.value = veiculo.tipo || '';
    elements.modalOverlay.classList.remove('hidden');
    elements.inputFrota.focus();
}

function fecharModal() {
    elements.modalOverlay.classList.add('hidden');
    elements.veiculoForm.reset();
    state.editingId = null;
}

function salvarVeiculo() {
    const frota = elements.inputFrota.value.trim();
    const chassis = elements.inputChassis.value.trim().toUpperCase();
    const tipo = elements.inputTipo.value.trim();

    // Validações
    if (!frota || frota.length !== 5) {
        showToast('Frota deve ter 5 dígitos!', 'error');
        elements.inputFrota.focus();
        return;
    }

    if (!chassis) {
        showToast('Informe o chassis!', 'error');
        elements.inputChassis.focus();
        return;
    }

    // Verificar duplicidade
    const duplicado = state.veiculos.find(v =>
        v.frota === frota && v.id !== state.editingId
    );
    if (duplicado) {
        showToast('Já existe um veículo com esta frota!', 'error');
        return;
    }

    if (state.editingId) {
        // Editar
        const index = state.veiculos.findIndex(v => v.id === state.editingId);
        if (index !== -1) {
            state.veiculos[index] = {
                ...state.veiculos[index],
                frota,
                chassis,
                tipo
            };
        }
        showToast('Veículo atualizado!', 'success');
    } else {
        // Novo
        const novoVeiculo = {
            id: Date.now().toString(),
            frota,
            chassis,
            tipo
        };
        state.veiculos.push(novoVeiculo);
        showToast('Veículo cadastrado!', 'success');
    }

    // Ordenar por frota
    state.veiculos.sort((a, b) => a.frota.localeCompare(b.frota));

    salvarNoFirebase();
    filtrarVeiculos();
    fecharModal();
}

let veiculoParaExcluir = null;

function confirmarExcluir(id) {
    const veiculo = state.veiculos.find(v => v.id === id);
    if (!veiculo) return;

    veiculoParaExcluir = id;
    elements.deleteVeiculoInfo.textContent = `Frota ${veiculo.frota}`;
    elements.deleteModalOverlay.classList.remove('hidden');
}

function fecharDeleteModal() {
    elements.deleteModalOverlay.classList.add('hidden');
    veiculoParaExcluir = null;
}

function confirmarExclusao() {
    if (!veiculoParaExcluir) return;

    state.veiculos = state.veiculos.filter(v => v.id !== veiculoParaExcluir);
    salvarNoFirebase();
    filtrarVeiculos();
    fecharDeleteModal();
    showToast('Veículo excluído!', 'success');
}

// ===== Search & Filter =====
function filtrarVeiculos() {
    const query = elements.searchInput.value.toLowerCase().trim();

    if (!query) {
        state.filteredVeiculos = [...state.veiculos];
    } else {
        state.filteredVeiculos = state.veiculos.filter(v =>
            v.frota.toLowerCase().includes(query) ||
            v.chassis.toLowerCase().includes(query) ||
            (v.tipo && v.tipo.toLowerCase().includes(query))
        );
    }

    renderTable();
}

// ===== Render =====
function renderTable() {
    elements.tableBody.innerHTML = '';

    if (state.filteredVeiculos.length === 0) {
        elements.noResults.classList.remove('hidden');
        document.getElementById('frotaTable').classList.add('hidden');
        elements.resultCount.textContent = 'Mostrando: 0';
        return;
    }

    elements.noResults.classList.add('hidden');
    document.getElementById('frotaTable').classList.remove('hidden');

    state.filteredVeiculos.forEach(veiculo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-frota">${veiculo.frota}</td>
            <td class="col-chassis">${veiculo.chassis}</td>
            <td class="col-tipo">${veiculo.tipo || '-'}</td>
            <td class="col-acoes">
                <div class="action-buttons">
                    <button class="btn btn-icon btn-edit" onclick="abrirModalEditar('${veiculo.id}')" title="Editar">✏️</button>
                    <button class="btn btn-icon btn-danger" onclick="confirmarExcluir('${veiculo.id}')" title="Excluir">🗑️</button>
                </div>
            </td>
        `;
        elements.tableBody.appendChild(tr);
    });

    // Update counts
    elements.totalCount.textContent = `Total: ${state.veiculos.length} veículos`;
    elements.resultCount.textContent = `Mostrando: ${state.filteredVeiculos.length}`;
}

// ===== Firebase =====
function salvarNoFirebase() {
    try {
        frotasRef.set(state.veiculos)
            .then(() => {
                console.log('Dados sincronizados com Firebase!');
                updateSyncStatus(true);
            })
            .catch((error) => {
                console.warn('Erro ao sincronizar:', error);
                salvarNoLocalStorage();
            });
    } catch (error) {
        console.warn('Erro ao salvar:', error);
        salvarNoLocalStorage();
    }
}

function carregarVeiculos() {
    // Escutar mudanças em tempo real
    frotasRef.on('value', (snapshot) => {
        const data = snapshot.val();

        if (data && Array.isArray(data) && data.length > 0) {
            state.veiculos = data;
            state.firebaseConnected = true;
            updateSyncStatus(true);
            console.log(`Firebase: ${state.veiculos.length} veículos carregados`);
        } else {
            // Se Firebase vazio, carregar dados iniciais ou localStorage
            carregarDoLocalStorage();

            if (state.veiculos.length === 0) {
                // Carregar dados iniciais
                state.veiculos = DADOS_INICIAIS.map((v, i) => ({
                    id: (i + 1).toString(),
                    ...v
                }));
                salvarNoFirebase();
            }
        }

        filtrarVeiculos();
        showToast(`☁️ ${state.veiculos.length} veículos sincronizados`, 'success');

    }, (error) => {
        console.warn('Erro Firebase:', error);
        state.firebaseConnected = false;
        updateSyncStatus(false);
        carregarDoLocalStorage();

        if (state.veiculos.length === 0) {
            state.veiculos = DADOS_INICIAIS.map((v, i) => ({
                id: (i + 1).toString(),
                ...v
            }));
        }

        filtrarVeiculos();
        showToast('📴 Modo offline', 'warning');
    });
}

function salvarNoLocalStorage() {
    try {
        localStorage.setItem('frotaVeiculos', JSON.stringify(state.veiculos));
    } catch (error) {
        console.warn('Erro localStorage:', error);
    }
}

function carregarDoLocalStorage() {
    try {
        const saved = localStorage.getItem('frotaVeiculos');
        if (saved) {
            state.veiculos = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Erro ao carregar localStorage:', error);
        state.veiculos = [];
    }
}

function updateSyncStatus(online) {
    const statusEl = elements.syncStatus;
    if (online) {
        statusEl.classList.add('online');
        statusEl.classList.remove('offline');
        statusEl.innerHTML = '<span class="status-icon">☁️</span><span class="status-text">Sincronizado</span>';
    } else {
        statusEl.classList.add('offline');
        statusEl.classList.remove('online');
        statusEl.innerHTML = '<span class="status-icon">📴</span><span class="status-text">Offline</span>';
    }
}

// Detectar conexão
window.addEventListener('online', () => {
    showToast('🌐 Conexão restaurada!', 'success');
    salvarNoFirebase();
});

window.addEventListener('offline', () => {
    showToast('📴 Sem conexão', 'warning');
    updateSyncStatus(false);
});

// ===== Utilities =====
function showToast(message, type = 'success') {
    const toast = elements.toast;
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
