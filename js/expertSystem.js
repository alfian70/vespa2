// Expert System Module - Handles CF calculations and diagnosis logic
const ExpertSystem = (function() {
    
    // Perform diagnosis based on selected symptoms
    function diagnose(selectedSymptoms) {
        try {
            const rules = DataManager.getAllRules();
            const damages = DataManager.getAllDamages();
            
            if (!rules || rules.length === 0) {
                throw new Error('Tidak ada aturan diagnosis yang tersedia');
            }
            
            if (!selectedSymptoms || selectedSymptoms.length === 0) {
                throw new Error('Tidak ada gejala yang dipilih');
            }
            
            console.log('Starting diagnosis with:', selectedSymptoms);
            console.log('Available rules:', rules.length);
            
            const results = [];
            
            // Process each damage/rule
            rules.forEach(rule => {
                if (!rule.rule_symptoms || rule.rule_symptoms.length === 0) {
                    return; // Skip rules without symptoms
                }
                
                // Find matching symptoms between user selection and rule
                const matchingSymptoms = [];
                
                rule.rule_symptoms.forEach(ruleSymptom => {
                    const userSymptom = selectedSymptoms.find(us => us.symptomId === ruleSymptom.symptom_id);
                    if (userSymptom) {
                        matchingSymptoms.push({
                            symptomId: ruleSymptom.symptom_id,
                            symptomName: ruleSymptom.symptom?.name || 'Unknown',
                            cfExpert: parseFloat(ruleSymptom.cf_expert),
                            cfUser: parseFloat(userSymptom.cf),
                            cfCombined: parseFloat(ruleSymptom.cf_expert) * parseFloat(userSymptom.cf)
                        });
                    }
                });
                
                // Only process if there are matching symptoms
                if (matchingSymptoms.length > 0) {
                    // Calculate final CF using CF combination formula
                    let finalCF = 0;
                    
                    if (matchingSymptoms.length === 1) {
                        finalCF = matchingSymptoms[0].cfCombined;
                    } else {
                        // Combine multiple CFs using: CF(A,B) = CF(A) + CF(B) * (1 - CF(A))
                        finalCF = matchingSymptoms[0].cfCombined;
                        
                        for (let i = 1; i < matchingSymptoms.length; i++) {
                            const cfB = matchingSymptoms[i].cfCombined;
                            finalCF = finalCF + cfB * (1 - finalCF);
                        }
                    }
                    
                    // Get damage information
                    const damage = rule.damage || damages.find(d => d.id === rule.damage_id);
                    
                    if (damage) {
                        results.push({
                            id: damage.id,
                            name: damage.name,
                            description: damage.description,
                            solution: damage.solution,
                            cf: finalCF,
                            percentage: Math.round(finalCF * 100),
                            matchingSymptoms: matchingSymptoms,
                            totalSymptoms: rule.rule_symptoms.length,
                            matchedSymptoms: matchingSymptoms.length
                        });
                    }
                }
            });
            
            // Sort results by CF (highest first)
            results.sort((a, b) => b.cf - a.cf);
            
            // Add ranking
            results.forEach((result, index) => {
                result.rank = index + 1;
            });
            
            console.log('Diagnosis results:', results);
            
            return results;
            
        } catch (error) {
            console.error('Error in diagnosis:', error);
            throw error;
        }
    }
    
    // Get confidence level description
    function getConfidenceLevel(cf) {
        const percentage = cf * 100;
        
        if (percentage >= 90) return 'Sangat Yakin';
        if (percentage >= 80) return 'Yakin';
        if (percentage >= 70) return 'Cukup Yakin';
        if (percentage >= 60) return 'Agak Yakin';
        if (percentage >= 50) return 'Kurang Yakin';
        return 'Tidak Yakin';
    }
    
    // Get confidence color
    function getConfidenceColor(cf) {
        const percentage = cf * 100;
        
        if (percentage >= 80) return '#10b981'; // Green
        if (percentage >= 60) return '#f59e0b'; // Orange
        if (percentage >= 40) return '#ef4444'; // Red
        return '#6b7280'; // Gray
    }
    
    // Format CF calculation steps for display
    function formatCalculationSteps(result) {
        const steps = [];
        
        // Individual symptom calculations
        result.matchingSymptoms.forEach((symptom, index) => {
            steps.push({
                step: index + 1,
                description: `${symptom.symptomName}`,
                formula: `CF = CF_Expert × CF_User = ${symptom.cfExpert} × ${symptom.cfUser} = ${symptom.cfCombined.toFixed(4)}`,
                result: symptom.cfCombined
            });
        });
        
        // Combination steps (if multiple symptoms)
        if (result.matchingSymptoms.length > 1) {
            let combinedCF = result.matchingSymptoms[0].cfCombined;
            
            for (let i = 1; i < result.matchingSymptoms.length; i++) {
                const cfB = result.matchingSymptoms[i].cfCombined;
                const newCF = combinedCF + cfB * (1 - combinedCF);
                
                steps.push({
                    step: steps.length + 1,
                    description: `Kombinasi CF`,
                    formula: `CF = ${combinedCF.toFixed(4)} + ${cfB.toFixed(4)} × (1 - ${combinedCF.toFixed(4)}) = ${newCF.toFixed(4)}`,
                    result: newCF
                });
                
                combinedCF = newCF;
            }
        }
        
        return steps;
    }
    
    // Save diagnosis session to database
    async function saveDiagnosisSession(selectedSymptoms, results) {
        try {
            const sessionData = {
                totalSymptoms: selectedSymptoms.length,
                totalResults: results.length,
                userSymptoms: selectedSymptoms.map(s => ({
                    symptomId: s.symptomId,
                    cf: s.cf
                })),
                results: results.map(r => ({
                    id: r.id,
                    cf: r.cf,
                    percentage: r.percentage
                }))
            };
            
            const session = await DataManager.saveDiagnosisSession(sessionData);
            console.log('Diagnosis session saved:', session);
            
            return session;
        } catch (error) {
            console.error('Error saving diagnosis session:', error);
            // Don't throw error, just log it - diagnosis can continue without saving
        }
    }
    
    // Public API
    return {
        diagnose,
        getConfidenceLevel,
        getConfidenceColor,
        formatCalculationSteps,
        saveDiagnosisSession
    };
})();