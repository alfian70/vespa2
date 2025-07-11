// UI Controller Module - Handles all UI interactions and page rendering
const UIController = (function() {
    let currentPage = 'beranda';
    let currentModal = null;
    let diagnosisResults = [];

    // Load page content
    function loadPage(pageId) {
        currentPage = pageId;
        const contentArea = document.querySelector('.content-area');
        
        switch (pageId) {
            case 'beranda':
                renderHomepage(contentArea);
                break;
            case 'gejala':
                renderSymptomsPage(contentArea);
                break;
            case 'kerusakan':
                renderDamagesPage(contentArea);
                break;
            case 'diagnosa':
                renderDiagnosisPage(contentArea);
                break;
            default:
                renderHomepage(contentArea);
        }
    }

    // Render homepage
    function renderHomepage(container) {
        const symptoms = DataManager.getAllSymptoms();
        const damages = DataManager.getAllDamages();
        const rules = DataManager.getAllRules();
        const diagnosisCount = DataManager.getDiagnosisCount();

        container.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-home"></i> Dashboard Sistem Pakar Vespa Excel</h1>
                <p>Selamat datang di sistem pakar diagnosis kerusakan Vespa Excel</p>
            </div>
            
            <div class="homepage-hero">
                <div class="hero-content">
                    <h1><i class="fas fa-motorcycle"></i> Sistem Pakar Vespa Excel</h1>
                    <p>Sistem diagnosis cerdas untuk mengidentifikasi kerusakan pada motor Vespa Excel menggunakan metode Certainty Factor</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon primary">
                            <i class="fas fa-list-check"></i>
                        </div>
                    </div>
                    <div class="stat-number">${symptoms.length}</div>
                    <div class="stat-label">Total Gejala</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon secondary">
                            <i class="fas fa-triangle-exclamation"></i>
                        </div>
                    </div>
                    <div class="stat-number">${damages.length}</div>
                    <div class="stat-label">Total Kerusakan</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon success">
                            <i class="fas fa-brain"></i>
                        </div>
                    </div>
                    <div class="stat-number">${rules.length}</div>
                    <div class="stat-label">Aturan Expert System</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon warning">
                            <i class="fas fa-stethoscope"></i>
                        </div>
                    </div>
                    <div class="stat-number">${diagnosisCount}</div>
                    <div class="stat-label">Total Diagnosis</div>
                </div>
            </div>

            <div class="info-grid">
                <div class="card">
                    <div class="card-content">
                        <h3><i class="fas fa-info-circle"></i> Tentang Sistem</h3>
                        <p>Sistem pakar ini menggunakan metode <strong>Certainty Factor (CF)</strong> untuk mendiagnosis kerusakan pada motor Vespa Excel berdasarkan gejala-gejala yang dialami.</p>
                        <ul>
                            <li>Diagnosis berdasarkan gejala yang dipilih</li>
                            <li>Tingkat keyakinan yang dapat disesuaikan</li>
                            <li>Hasil diagnosis dengan persentase akurasi</li>
                            <li>Solusi perbaikan untuk setiap kerusakan</li>
                        </ul>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-content">
                        <h3><i class="fas fa-cogs"></i> Cara Menggunakan</h3>
                        <ol>
                            <li>Pilih menu <strong>Diagnosa</strong></li>
                            <li>Pilih gejala yang dialami motor Anda</li>
                            <li>Tentukan tingkat keyakinan untuk setiap gejala</li>
                            <li>Klik <strong>Mulai Diagnosa</strong></li>
                            <li>Lihat hasil diagnosis dan solusi perbaikan</li>
                        </ol>
                        <p class="mt-3"><strong>Tips:</strong> Semakin akurat pemilihan gejala dan tingkat keyakinan, semakin akurat hasil diagnosis.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Render symptoms page
    function renderSymptomsPage(container) {
        const symptoms = DataManager.getAllSymptoms();
        const currentUser = Auth.getCurrentUser();
        const isAdmin = currentUser && currentUser.role === 'expert';

        container.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-list-check"></i> Kode Gejala</h1>
                <p>Daftar gejala yang dapat terjadi pada motor Vespa Excel</p>
                <div class="page-controls">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Cari gejala..." id="symptom-search">
                    </div>
                    ${isAdmin ? '<button class="btn btn-primary" onclick="UIController.showAddSymptomModal()"><i class="fas fa-plus"></i> Tambah Gejala</button>' : ''}
                </div>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Gejala</th>
                                <th>Deskripsi</th>
                                ${isAdmin ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody id="symptoms-table-body">
                            ${renderSymptomsTable(symptoms, isAdmin)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Add search functionality
        document.getElementById('symptom-search').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredSymptoms = symptoms.filter(symptom => 
                symptom.id.toLowerCase().includes(searchTerm) ||
                symptom.name.toLowerCase().includes(searchTerm) ||
                symptom.description.toLowerCase().includes(searchTerm)
            );
            document.getElementById('symptoms-table-body').innerHTML = renderSymptomsTable(filteredSymptoms, isAdmin);
        });
    }

    // Render symptoms table
    function renderSymptomsTable(symptoms, isAdmin) {
        if (symptoms.length === 0) {
            return `<tr><td colspan="${isAdmin ? '4' : '3'}" class="no-results"><i class="fas fa-search"></i><br>Tidak ada gejala yang ditemukan</td></tr>`;
        }

        return symptoms.map(symptom => `
            <tr>
                <td><span class="badge">${symptom.id}</span></td>
                <td>${symptom.name}</td>
                <td>${symptom.description}</td>
                ${isAdmin ? `
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-warning" onclick="UIController.showEditSymptomModal('${symptom.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="UIController.showDeleteSymptomModal('${symptom.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                ` : ''}
            </tr>
        `).join('');
    }

    // Render damages page
    function renderDamagesPage(container) {
        const damages = DataManager.getAllDamages();
        const currentUser = Auth.getCurrentUser();
        const isAdmin = currentUser && currentUser.role === 'expert';

        container.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-triangle-exclamation"></i> Kode Kerusakan</h1>
                <p>Daftar kerusakan yang dapat terjadi pada motor Vespa Excel</p>
                <div class="page-controls">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Cari kerusakan..." id="damage-search">
                    </div>
                    ${isAdmin ? '<button class="btn btn-primary" onclick="UIController.showAddDamageModal()"><i class="fas fa-plus"></i> Tambah Kerusakan</button>' : ''}
                </div>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Kerusakan</th>
                                <th>Deskripsi</th>
                                <th>Solusi</th>
                                ${isAdmin ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody id="damages-table-body">
                            ${renderDamagesTable(damages, isAdmin)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Add search functionality
        document.getElementById('damage-search').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredDamages = damages.filter(damage => 
                damage.id.toLowerCase().includes(searchTerm) ||
                damage.name.toLowerCase().includes(searchTerm) ||
                damage.description.toLowerCase().includes(searchTerm) ||
                damage.solution.toLowerCase().includes(searchTerm)
            );
            document.getElementById('damages-table-body').innerHTML = renderDamagesTable(filteredDamages, isAdmin);
        });
    }

    // Render damages table
    function renderDamagesTable(damages, isAdmin) {
        if (damages.length === 0) {
            return `<tr><td colspan="${isAdmin ? '5' : '4'}" class="no-results"><i class="fas fa-search"></i><br>Tidak ada kerusakan yang ditemukan</td></tr>`;
        }

        return damages.map(damage => `
            <tr>
                <td><span class="badge">${damage.id}</span></td>
                <td>${damage.name}</td>
                <td>${damage.description}</td>
                <td>${damage.solution}</td>
                ${isAdmin ? `
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-warning" onclick="UIController.showEditDamageModal('${damage.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="UIController.showDeleteDamageModal('${damage.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                ` : ''}
            </tr>
        `).join('');
    }

    // Render diagnosis page
    function renderDiagnosisPage(container) {
        const symptoms = DataManager.getAllSymptoms();

        container.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-stethoscope"></i> Diagnosa Kerusakan</h1>
                <p>Pilih gejala yang dialami motor Vespa Excel Anda</p>
            </div>

            <div class="diagnosis-instructions">
                <i class="fas fa-info-circle"></i>
                <div class="instructions-text">
                    <strong>Petunjuk Diagnosis:</strong> Pilih gejala yang sesuai dengan kondisi motor Anda, kemudian tentukan tingkat keyakinan untuk setiap gejala.
                    <div class="confidence-levels">
                        <strong>Tingkat Keyakinan:</strong> 
                        Tidak Yakin (0.2) • Kurang Yakin (0.4) • Cukup Yakin (0.6) • Yakin (0.8) • Sangat Yakin (1.0)
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-content">
                    <h3><i class="fas fa-clipboard-list"></i> Pilih Gejala</h3>
                    <div class="symptom-list" id="symptom-list">
                        ${renderSymptomsList(symptoms)}
                    </div>
                    
                    <div class="diagnosis-actions">
                        <button class="btn btn-primary" onclick="UIController.startDiagnosis()">
                            <i class="fas fa-play"></i> Mulai Diagnosa
                        </button>
                        <button class="btn btn-secondary" onclick="UIController.resetDiagnosis()">
                            <i class="fas fa-refresh"></i> Reset
                        </button>
                    </div>
                </div>
            </div>

            <div id="diagnosis-results-container"></div>
        `;
    }

    // Render symptoms list for diagnosis
    function renderSymptomsList(symptoms) {
        return symptoms.map(symptom => `
            <div class="symptom-item">
                <div class="symptom-header">
                    <input type="checkbox" class="symptom-checkbox" id="symptom-${symptom.id}" data-symptom-id="${symptom.id}">
                    <div class="symptom-info">
                        <div class="symptom-code">${symptom.id} - ${symptom.name}</div>
                        <div class="symptom-desc">${symptom.description}</div>
                    </div>
                </div>
                <select class="cf-selector" id="cf-${symptom.id}" disabled>
                    <option value="0.2">Tidak Yakin (0.2)</option>
                    <option value="0.4">Kurang Yakin (0.4)</option>
                    <option value="0.6" selected>Cukup Yakin (0.6)</option>
                    <option value="0.8">Yakin (0.8)</option>
                    <option value="1.0">Sangat Yakin (1.0)</option>
                </select>
            </div>
        `).join('');
    }

    // Start diagnosis
    async function startDiagnosis() {
        try {
            // Get selected symptoms
            const selectedSymptoms = [];
            const checkboxes = document.querySelectorAll('.symptom-checkbox:checked');
            
            if (checkboxes.length === 0) {
                DataManager.showNotification('Pilih minimal satu gejala untuk melakukan diagnosis!', 'warning');
                return;
            }
            
            checkboxes.forEach(checkbox => {
                const symptomId = checkbox.dataset.symptomId;
                const cfValue = document.getElementById(`cf-${symptomId}`).value;
                selectedSymptoms.push({
                    symptomId: symptomId,
                    cf: parseFloat(cfValue)
                });
            });
            
            // Show loading
            const resultsContainer = document.getElementById('diagnosis-results-container');
            resultsContainer.innerHTML = `
                <div class="card">
                    <div class="card-content" style="text-align: center; padding: 3rem;">
                        <div class="loading"></div>
                        <p style="margin-top: 1rem;">Sedang melakukan diagnosis...</p>
                    </div>
                </div>
            `;
            
            // Perform diagnosis
            setTimeout(async () => {
                try {
                    const results = ExpertSystem.diagnose(selectedSymptoms);
                    
                    if (results.length === 0) {
                        DataManager.showNotification('Tidak ditemukan kerusakan yang sesuai dengan gejala yang dipilih', 'warning');
                        resultsContainer.innerHTML = '';
                        return;
                    }
                    
                    // Save diagnosis session
                    await ExpertSystem.saveDiagnosisSession(selectedSymptoms, results);
                    
                    // Store results for detail view
                    diagnosisResults = results;
                    
                    // Display results
                    displayDiagnosisResults(results, selectedSymptoms);
                    
                    // Scroll to results
                    resultsContainer.scrollIntoView({ behavior: 'smooth' });
                    
                    DataManager.showNotification('Diagnosis berhasil dilakukan!', 'success');
                    
                } catch (error) {
                    console.error('Diagnosis error:', error);
                    DataManager.showNotification('Terjadi kesalahan saat melakukan diagnosis: ' + error.message, 'error');
                    resultsContainer.innerHTML = '';
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error starting diagnosis:', error);
            DataManager.showNotification('Terjadi kesalahan: ' + error.message, 'error');
        }
    }

    // Display diagnosis results
    function displayDiagnosisResults(results, selectedSymptoms) {
        const resultsContainer = document.getElementById('diagnosis-results-container');
        
        // Get selected symptoms info
        const symptomsInfo = selectedSymptoms.map(s => {
            const symptom = DataManager.getSymptomById(s.symptomId);
            return {
                ...s,
                name: symptom ? symptom.name : 'Unknown'
            };
        });
        
        resultsContainer.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <h3><i class="fas fa-chart-line"></i> Hasil Diagnosis</h3>
                    
                    <!-- Selected Symptoms Summary -->
                    <div class="detail-section">
                        <h4><i class="fas fa-list-check"></i> Gejala yang Dipilih</h4>
                        <div class="user-symptoms">
                            ${symptomsInfo.map(s => `
                                <div class="user-symptom-item">
                                    <span class="symptom-code">${s.symptomId}</span>
                                    <span class="symptom-name">${s.name}</span>
                                    <span class="symptom-cf">CF: ${s.cf}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Diagnosis Results -->
                    <div class="detail-section">
                        <h4><i class="fas fa-trophy"></i> Hasil Diagnosis (${results.length} kerusakan ditemukan)</h4>
                        <div class="results-grid">
                            ${results.map((result, index) => `
                                <div class="result-card" style="border-left-color: ${getResultColor(index)}">
                                    <div class="result-header">
                                        <div class="result-rank" style="background: ${getResultColor(index)}">
                                            #${result.rank}
                                        </div>
                                        <div class="result-percentage" style="color: ${getResultColor(index)}">
                                            ${result.percentage}%
                                        </div>
                                    </div>
                                    
                                    <div class="result-content">
                                        <div class="result-title">
                                            <span class="badge">${result.id}</span> ${result.name}
                                        </div>
                                        
                                        <div class="result-confidence">
                                            <span class="confidence-label">Tingkat Keyakinan:</span>
                                            <span class="confidence-value">${ExpertSystem.getConfidenceLevel(result.cf)}</span>
                                        </div>
                                        
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${result.percentage}%; background: ${getResultColor(index)}"></div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <label>Deskripsi Kerusakan:</label>
                                            <div class="detail-text">${result.description}</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <label>Solusi Perbaikan:</label>
                                            <div class="detail-text solution-text">${result.solution}</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <label>Ringkasan Perhitungan:</label>
                                            <div class="detail-text">
                                                <strong>Gejala Cocok:</strong> ${result.matchedSymptoms}/${result.totalSymptoms} gejala<br>
                                                <strong>CF Akhir:</strong> ${result.cf.toFixed(4)}<br>
                                                <strong>Persentase:</strong> ${result.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="result-actions">
                                        <button class="btn btn-sm btn-outline" onclick="UIController.showDiagnosisDetail(${index})">
                                            <i class="fas fa-info-circle"></i> Detail Perhitungan
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Recommendations -->
                    <div class="detail-section">
                        <h4><i class="fas fa-lightbulb"></i> Rekomendasi</h4>
                        ${generateRecommendations(results)}
                    </div>
                    
                    <!-- Additional Information -->
                    <div class="info-box">
                        <h3><i class="fas fa-info-circle"></i> Informasi Tambahan</h3>
                        <p><strong>Metode Diagnosis:</strong> Sistem ini menggunakan metode Certainty Factor (CF) untuk menghitung tingkat keyakinan diagnosis berdasarkan gejala yang dipilih.</p>
                        <p><strong>Interpretasi Hasil:</strong> Semakin tinggi persentase, semakin besar kemungkinan kerusakan tersebut terjadi pada motor Anda.</p>
                        <p><strong>Saran:</strong> Untuk diagnosis yang akurat, disarankan untuk berkonsultasi dengan teknisi berpengalaman.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Get result color based on rank
    function getResultColor(index) {
        const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[index % colors.length];
    }

    // Generate recommendations based on results
    function generateRecommendations(results) {
        if (results.length === 0) return '';
        
        const topResult = results[0];
        let alertClass = 'alert-info';
        let alertIcon = 'fas fa-info-circle';
        let recommendation = '';
        
        if (topResult.percentage >= 70) {
            alertClass = 'alert-success';
            alertIcon = 'fas fa-check-circle';
            recommendation = `Berdasarkan gejala yang dipilih, kemungkinan besar motor Anda mengalami <strong>${topResult.name}</strong> dengan tingkat keyakinan ${topResult.percentage}%. Disarankan untuk segera melakukan perbaikan sesuai solusi yang diberikan.`;
        } else if (topResult.percentage >= 50) {
            alertClass = 'alert-warning';
            alertIcon = 'fas fa-exclamation-triangle';
            recommendation = `Terdapat kemungkinan motor Anda mengalami <strong>${topResult.name}</strong> dengan tingkat keyakinan ${topResult.percentage}%. Disarankan untuk melakukan pemeriksaan lebih lanjut atau berkonsultasi dengan teknisi.`;
        } else {
            alertClass = 'alert-info';
            alertIcon = 'fas fa-question-circle';
            recommendation = `Berdasarkan gejala yang dipilih, tingkat keyakinan diagnosis masih rendah (${topResult.percentage}%). Disarankan untuk memeriksa gejala lain atau berkonsultasi dengan teknisi berpengalaman.`;
        }
        
        return `
            <div class="alert ${alertClass}">
                <i class="${alertIcon}"></i>
                <div>
                    <p>${recommendation}</p>
                    <p><strong>Catatan:</strong> Hasil diagnosis ini bersifat prediktif dan tidak menggantikan pemeriksaan langsung oleh teknisi ahli.</p>
                </div>
            </div>
        `;
    }

    // Show diagnosis detail modal
    function showDiagnosisDetail(resultIndex) {
        const result = diagnosisResults[resultIndex];
        if (!result) return;
        
        const calculationSteps = ExpertSystem.formatCalculationSteps(result);
        
        showModal('Detail Perhitungan Diagnosis', `
            <div class="diagnosis-detail">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Informasi Kerusakan</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Kode Kerusakan:</label>
                            <span class="badge">${result.id}</span>
                        </div>
                        <div class="detail-item">
                            <label>Nama Kerusakan:</label>
                            <span>${result.name}</span>
                        </div>
                        <div class="detail-item full-width">
                            <label>Deskripsi:</label>
                            <div class="detail-text">${result.description}</div>
                        </div>
                        <div class="detail-item full-width">
                            <label>Solusi Perbaikan:</label>
                            <div class="detail-text solution-text">${result.solution}</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-calculator"></i> Detail Perhitungan CF</h4>
                    <div class="calculation-info">
                        <div class="calc-summary">
                            <span><strong>Total Gejala dalam Aturan:</strong> ${result.totalSymptoms}</span>
                            <span><strong>Gejala yang Cocok:</strong> ${result.matchedSymptoms}</span>
                            <span><strong>CF Akhir:</strong> ${result.cf.toFixed(4)}</span>
                            <span><strong>Persentase:</strong> ${result.percentage}%</span>
                        </div>
                        
                        <div class="calc-details">
                            <h5>Langkah Perhitungan:</h5>
                            ${calculationSteps.map(step => `
                                <div class="calc-item">
                                    <div class="calc-symptom">Langkah ${step.step}: ${step.description}</div>
                                    <div class="calc-formula">${step.formula}</div>
                                </div>
                            `).join('')}
                            
                            <div class="calc-final">
                                <strong>Hasil Akhir: CF = ${result.cf.toFixed(4)} = ${result.percentage}%</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-list-check"></i> Gejala yang Dipilih User</h4>
                    <div class="user-symptoms">
                        ${result.matchingSymptoms.map(symptom => `
                            <div class="user-symptom-item">
                                <span class="symptom-code">${symptom.symptomId}</span>
                                <span class="symptom-name">${symptom.symptomName}</span>
                                <span class="symptom-cf">CF Expert: ${symptom.cfExpert} | CF User: ${symptom.cfUser} | CF Combined: ${symptom.cfCombined.toFixed(4)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `);
    }

    // Reset diagnosis
    function resetDiagnosis() {
        // Uncheck all checkboxes
        document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            const symptomId = checkbox.dataset.symptomId;
            const cfSelector = document.getElementById(`cf-${symptomId}`);
            cfSelector.disabled = true;
            cfSelector.value = '0.6';
        });
        
        // Clear results
        document.getElementById('diagnosis-results-container').innerHTML = '';
        diagnosisResults = [];
        
        DataManager.showNotification('Diagnosis telah direset', 'info');
    }

    // Modal functions
    function showModal(title, content, size = 'medium') {
        // Remove existing modal
        if (currentModal) {
            currentModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal ${size}">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="UIController.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        currentModal = modal;
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
    }

    // Symptom modal functions
    async function showAddSymptomModal() {
        showModal('Tambah Gejala Baru', `
            <form id="add-symptom-form">
                <div class="form-group">
                    <label>Kode Gejala</label>
                    <input type="text" id="symptom-id" readonly style="background: var(--bg-secondary); opacity: 0.7;">
                </div>
                <div class="form-group">
                    <label>Nama Gejala *</label>
                    <input type="text" id="symptom-name" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea id="symptom-description" rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="UIController.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `);
        
        // Generate next ID
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            const nextId = await DatabaseService.generateNextSymptomId();
            document.getElementById('symptom-id').value = nextId;
        } catch (error) {
            console.error('Error generating symptom ID:', error);
        }
        
        // Handle form submission
        document.getElementById('add-symptom-form').addEventListener('submit', handleAddSymptom);
    }

    async function handleAddSymptom(e) {
        e.preventDefault();
        
        const name = document.getElementById('symptom-name').value.trim();
        const description = document.getElementById('symptom-description').value.trim();
        
        if (!name) {
            DataManager.showNotification('Nama gejala harus diisi!', 'error');
            return;
        }
        
        try {
            const symptom = await DataManager.addSymptom({ name, description });
            DataManager.showNotification(`Gejala "${symptom.name}" berhasil ditambahkan dengan kode ${symptom.id}`, 'success');
            closeModal();
            
            // Refresh page if on symptoms page
            if (currentPage === 'gejala') {
                loadPage('gejala');
            }
        } catch (error) {
            DataManager.showNotification('Gagal menambahkan gejala: ' + error.message, 'error');
        }
    }

    function showEditSymptomModal(id) {
        const symptom = DataManager.getSymptomById(id);
        if (!symptom) return;
        
        showModal('Edit Gejala', `
            <form id="edit-symptom-form">
                <div class="form-group">
                    <label>Kode Gejala</label>
                    <input type="text" value="${symptom.id}" readonly style="background: var(--bg-secondary); opacity: 0.7;">
                </div>
                <div class="form-group">
                    <label>Nama Gejala *</label>
                    <input type="text" id="edit-symptom-name" value="${symptom.name}" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea id="edit-symptom-description" rows="3">${symptom.description}</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="UIController.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Update</button>
                </div>
            </form>
        `);
        
        // Handle form submission
        document.getElementById('edit-symptom-form').addEventListener('submit', function(e) {
            handleEditSymptom(e, id);
        });
    }

    async function handleEditSymptom(e, id) {
        e.preventDefault();
        
        const name = document.getElementById('edit-symptom-name').value.trim();
        const description = document.getElementById('edit-symptom-description').value.trim();
        
        if (!name) {
            DataManager.showNotification('Nama gejala harus diisi!', 'error');
            return;
        }
        
        try {
            const symptom = await DataManager.updateSymptom({ id, name, description });
            DataManager.showNotification(`Gejala "${symptom.name}" berhasil diperbarui`, 'success');
            closeModal();
            
            // Refresh page if on symptoms page
            if (currentPage === 'gejala') {
                loadPage('gejala');
            }
        } catch (error) {
            DataManager.showNotification('Gagal memperbarui gejala: ' + error.message, 'error');
        }
    }

    function showDeleteSymptomModal(id) {
        const symptom = DataManager.getSymptomById(id);
        if (!symptom) return;
        
        showModal('Konfirmasi Hapus', `
            <div class="delete-confirmation">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Hapus Gejala</h3>
                <p>Apakah Anda yakin ingin menghapus gejala:</p>
                <p><strong class="item-name">${symptom.id} - ${symptom.name}</strong></p>
                <p>Tindakan ini tidak dapat dibatalkan!</p>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="UIController.closeModal()">Batal</button>
                    <button type="button" class="btn btn-danger" onclick="UIController.handleDeleteSymptom('${id}')">Hapus</button>
                </div>
            </div>
        `);
    }

    async function handleDeleteSymptom(id) {
        try {
            const symptom = DataManager.getSymptomById(id);
            await DataManager.deleteSymptom(id);
            DataManager.showNotification(`Gejala "${symptom.name}" berhasil dihapus`, 'success');
            closeModal();
            
            // Refresh page if on symptoms page
            if (currentPage === 'gejala') {
                loadPage('gejala');
            }
        } catch (error) {
            DataManager.showNotification('Gagal menghapus gejala: ' + error.message, 'error');
        }
    }

    // Damage modal functions
    async function showAddDamageModal() {
        showModal('Tambah Kerusakan Baru', `
            <form id="add-damage-form">
                <div class="form-group">
                    <label>Kode Kerusakan</label>
                    <input type="text" id="damage-id" readonly style="background: var(--bg-secondary); opacity: 0.7;">
                </div>
                <div class="form-group">
                    <label>Nama Kerusakan *</label>
                    <input type="text" id="damage-name" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea id="damage-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Solusi Perbaikan</label>
                    <textarea id="damage-solution" rows="3"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="UIController.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `);
        
        // Generate next ID
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            const nextId = await DatabaseService.generateNextDamageId();
            document.getElementById('damage-id').value = nextId;
        } catch (error) {
            console.error('Error generating damage ID:', error);
        }
        
        // Handle form submission
        document.getElementById('add-damage-form').addEventListener('submit', handleAddDamage);
    }

    async function handleAddDamage(e) {
        e.preventDefault();
        
        const name = document.getElementById('damage-name').value.trim();
        const description = document.getElementById('damage-description').value.trim();
        const solution = document.getElementById('damage-solution').value.trim();
        
        if (!name) {
            DataManager.showNotification('Nama kerusakan harus diisi!', 'error');
            return;
        }
        
        try {
            const damage = await DataManager.addDamage({ name, description, solution });
            DataManager.showNotification(`Kerusakan "${damage.name}" berhasil ditambahkan dengan kode ${damage.id}`, 'success');
            closeModal();
            
            // Refresh page if on damages page
            if (currentPage === 'kerusakan') {
                loadPage('kerusakan');
            }
        } catch (error) {
            DataManager.showNotification('Gagal menambahkan kerusakan: ' + error.message, 'error');
        }
    }

    function showEditDamageModal(id) {
        const damage = DataManager.getDamageById(id);
        if (!damage) return;
        
        showModal('Edit Kerusakan', `
            <form id="edit-damage-form">
                <div class="form-group">
                    <label>Kode Kerusakan</label>
                    <input type="text" value="${damage.id}" readonly style="background: var(--bg-secondary); opacity: 0.7;">
                </div>
                <div class="form-group">
                    <label>Nama Kerusakan *</label>
                    <input type="text" id="edit-damage-name" value="${damage.name}" required>
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea id="edit-damage-description" rows="3">${damage.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Solusi Perbaikan</label>
                    <textarea id="edit-damage-solution" rows="3">${damage.solution}</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="UIController.closeModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Update</button>
                </div>
            </form>
        `);
        
        // Handle form submission
        document.getElementById('edit-damage-form').addEventListener('submit', function(e) {
            handleEditDamage(e, id);
        });
    }

    async function handleEditDamage(e, id) {
        e.preventDefault();
        
        const name = document.getElementById('edit-damage-name').value.trim();
        const description = document.getElementById('edit-damage-description').value.trim();
        const solution = document.getElementById('edit-damage-solution').value.trim();
        
        if (!name) {
            DataManager.showNotification('Nama kerusakan harus diisi!', 'error');
            return;
        }
        
        try {
            const damage = await DataManager.updateDamage({ id, name, description, solution });
            DataManager.showNotification(`Kerusakan "${damage.name}" berhasil diperbarui`, 'success');
            closeModal();
            
            // Refresh page if on damages page
            if (currentPage === 'kerusakan') {
                loadPage('kerusakan');
            }
        } catch (error) {
            DataManager.showNotification('Gagal memperbarui kerusakan: ' + error.message, 'error');
        }
    }

    function showDeleteDamageModal(id) {
        const damage = DataManager.getDamageById(id);
        if (!damage) return;
        
        showModal('Konfirmasi Hapus', `
            <div class="delete-confirmation">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Hapus Kerusakan</h3>
                <p>Apakah Anda yakin ingin menghapus kerusakan:</p>
                <p><strong class="item-name">${damage.id} - ${damage.name}</strong></p>
                <p>Tindakan ini tidak dapat dibatalkan!</p>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="UIController.closeModal()">Batal</button>
                    <button type="button" class="btn btn-danger" onclick="UIController.handleDeleteDamage('${id}')">Hapus</button>
                </div>
            </div>
        `);
    }

    async function handleDeleteDamage(id) {
        try {
            const damage = DataManager.getDamageById(id);
            await DataManager.deleteDamage(id);
            DataManager.showNotification(`Kerusakan "${damage.name}" berhasil dihapus`, 'success');
            closeModal();
            
            // Refresh page if on damages page
            if (currentPage === 'kerusakan') {
                loadPage('kerusakan');
            }
        } catch (error) {
            DataManager.showNotification('Gagal menghapus kerusakan: ' + error.message, 'error');
        }
    }

    // Initialize UI
    function init() {
        // Add event listeners for symptom checkboxes
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('symptom-checkbox')) {
                const symptomId = e.target.dataset.symptomId;
                const cfSelector = document.getElementById(`cf-${symptomId}`);
                cfSelector.disabled = !e.target.checked;
            }
        });
    }

    // Public API
    return {
        loadPage,
        init,
        showModal,
        closeModal,
        showAddSymptomModal,
        showEditSymptomModal,
        showDeleteSymptomModal,
        handleDeleteSymptom,
        showAddDamageModal,
        showEditDamageModal,
        showDeleteDamageModal,
        handleDeleteDamage,
        startDiagnosis,
        resetDiagnosis,
        showDiagnosisDetail
    };
})();