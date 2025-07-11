// Data Manager Module - Handles all data operations with Supabase integration
const DataManager = (function() {
    let symptoms = [];
    let damages = [];
    let rules = [];
    let diagnosisCount = 0;

    // Initialize data from Supabase
    async function init() {
        try {
            await loadAllData();
        } catch (error) {
            console.error('Error initializing data:', error);
            // Fallback to localStorage if Supabase fails
            loadFromLocalStorage();
        }
    }

    // Load all data from Supabase
    async function loadAllData() {
        try {
            // Import DatabaseService dynamically
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Load all data in parallel
            const [symptomsData, damagesData, rulesData, diagnosisCountData] = await Promise.all([
                DatabaseService.getAllSymptoms(),
                DatabaseService.getAllDamages(),
                DatabaseService.getAllRules(),
                DatabaseService.getDiagnosisCount()
            ]);

            symptoms = symptomsData || [];
            damages = damagesData || [];
            rules = rulesData || [];
            diagnosisCount = diagnosisCountData || 0;

            // Also save to localStorage as backup
            saveToLocalStorage();
            
            console.log('Data loaded from Supabase:', {
                symptoms: symptoms.length,
                damages: damages.length,
                rules: rules.length,
                diagnosisCount
            });
        } catch (error) {
            console.error('Error loading data from Supabase:', error);
            throw error;
        }
    }

    // Save to localStorage as backup
    function saveToLocalStorage() {
        try {
            localStorage.setItem('vespa_symptoms', JSON.stringify(symptoms));
            localStorage.setItem('vespa_damages', JSON.stringify(damages));
            localStorage.setItem('vespa_rules', JSON.stringify(rules));
            localStorage.setItem('vespa_diagnosis_count', diagnosisCount.toString());
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Load from localStorage as fallback
    function loadFromLocalStorage() {
        try {
            const storedSymptoms = localStorage.getItem('vespa_symptoms');
            const storedDamages = localStorage.getItem('vespa_damages');
            const storedRules = localStorage.getItem('vespa_rules');
            const storedDiagnosisCount = localStorage.getItem('vespa_diagnosis_count');

            symptoms = storedSymptoms ? JSON.parse(storedSymptoms) : [];
            damages = storedDamages ? JSON.parse(storedDamages) : [];
            rules = storedRules ? JSON.parse(storedRules) : [];
            diagnosisCount = storedDiagnosisCount ? parseInt(storedDiagnosisCount) : 0;

            console.log('Data loaded from localStorage as fallback');
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            // Initialize with empty data if all fails
            symptoms = [];
            damages = [];
            rules = [];
            diagnosisCount = 0;
        }
    }

    // Symptom operations
    async function addSymptom(symptom) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Generate next ID
            const nextId = await DatabaseService.generateNextSymptomId();
            const newSymptom = {
                id: nextId,
                name: symptom.name,
                description: symptom.description || ''
            };

            // Add to Supabase
            const addedSymptom = await DatabaseService.addSymptom(newSymptom);
            
            // Update local data
            symptoms.push(addedSymptom);
            saveToLocalStorage();
            
            return addedSymptom;
        } catch (error) {
            console.error('Error adding symptom:', error);
            throw error;
        }
    }

    async function updateSymptom(symptom) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Update in Supabase
            const updatedSymptom = await DatabaseService.updateSymptom(symptom);
            
            // Update local data
            const index = symptoms.findIndex(s => s.id === symptom.id);
            if (index !== -1) {
                symptoms[index] = updatedSymptom;
                saveToLocalStorage();
            }
            
            return updatedSymptom;
        } catch (error) {
            console.error('Error updating symptom:', error);
            throw error;
        }
    }

    async function deleteSymptom(id) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Delete from Supabase
            await DatabaseService.deleteSymptom(id);
            
            // Update local data
            symptoms = symptoms.filter(s => s.id !== id);
            saveToLocalStorage();
            
            return true;
        } catch (error) {
            console.error('Error deleting symptom:', error);
            throw error;
        }
    }

    // Damage operations
    async function addDamage(damage) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Generate next ID
            const nextId = await DatabaseService.generateNextDamageId();
            const newDamage = {
                id: nextId,
                name: damage.name,
                description: damage.description || '',
                solution: damage.solution || ''
            };

            // Add to Supabase
            const addedDamage = await DatabaseService.addDamage(newDamage);
            
            // Update local data
            damages.push(addedDamage);
            saveToLocalStorage();
            
            return addedDamage;
        } catch (error) {
            console.error('Error adding damage:', error);
            throw error;
        }
    }

    async function updateDamage(damage) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Update in Supabase
            const updatedDamage = await DatabaseService.updateDamage(damage);
            
            // Update local data
            const index = damages.findIndex(d => d.id === damage.id);
            if (index !== -1) {
                damages[index] = updatedDamage;
                saveToLocalStorage();
            }
            
            return updatedDamage;
        } catch (error) {
            console.error('Error updating damage:', error);
            throw error;
        }
    }

    async function deleteDamage(id) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Delete from Supabase
            await DatabaseService.deleteDamage(id);
            
            // Update local data
            damages = damages.filter(d => d.id !== id);
            saveToLocalStorage();
            
            return true;
        } catch (error) {
            console.error('Error deleting damage:', error);
            throw error;
        }
    }

    // Diagnosis operations
    async function saveDiagnosisSession(sessionData) {
        try {
            const { DatabaseService } = await import('./supabaseClient.js');
            
            // Save to Supabase
            const session = await DatabaseService.saveDiagnosisSession(sessionData);
            
            // Update local diagnosis count
            diagnosisCount++;
            saveToLocalStorage();
            
            return session;
        } catch (error) {
            console.error('Error saving diagnosis session:', error);
            // Still increment local count even if Supabase fails
            diagnosisCount++;
            saveToLocalStorage();
            throw error;
        }
    }

    // Utility functions
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Set icon based on type
        let icon = 'fas fa-info-circle';
        switch (type) {
            case 'success': icon = 'fas fa-check-circle'; break;
            case 'error': icon = 'fas fa-exclamation-circle'; break;
            case 'warning': icon = 'fas fa-exclamation-triangle'; break;
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Reset data (for admin login)
    function resetData() {
        // Don't actually clear data, just reload from Supabase
        init();
    }

    // Getters
    function getAllSymptoms() {
        return symptoms;
    }

    function getAllDamages() {
        return damages;
    }

    function getAllRules() {
        return rules;
    }

    function getDiagnosisCount() {
        return diagnosisCount;
    }

    function getSymptomById(id) {
        return symptoms.find(s => s.id === id);
    }

    function getDamageById(id) {
        return damages.find(d => d.id === id);
    }

    // Public API
    return {
        init,
        addSymptom,
        updateSymptom,
        deleteSymptom,
        addDamage,
        updateDamage,
        deleteDamage,
        saveDiagnosisSession,
        getAllSymptoms,
        getAllDamages,
        getAllRules,
        getDiagnosisCount,
        getSymptomById,
        getDamageById,
        showNotification,
        resetData
    };
})();