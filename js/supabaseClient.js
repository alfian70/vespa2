// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false // We're not using Supabase auth, just the database
    }
});

// Database service functions
export const DatabaseService = {
    // Symptoms (Gejala) operations
    async getAllSymptoms() {
        try {
            const { data, error } = await supabase
                .from('symptoms')
                .select('*')
                .order('id');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching symptoms:', error);
            return [];
        }
    },

    async getSymptomById(id) {
        try {
            const { data, error } = await supabase
                .from('symptoms')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching symptom:', error);
            return null;
        }
    },

    async addSymptom(symptom) {
        try {
            const { data, error } = await supabase
                .from('symptoms')
                .insert([symptom])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding symptom:', error);
            throw error;
        }
    },

    async updateSymptom(symptom) {
        try {
            const { data, error } = await supabase
                .from('symptoms')
                .update({
                    name: symptom.name,
                    description: symptom.description,
                    updated_at: new Date().toISOString()
                })
                .eq('id', symptom.id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating symptom:', error);
            throw error;
        }
    },

    async deleteSymptom(id) {
        try {
            const { error } = await supabase
                .from('symptoms')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting symptom:', error);
            throw error;
        }
    },

    // Damages (Kerusakan) operations
    async getAllDamages() {
        try {
            const { data, error } = await supabase
                .from('damages')
                .select('*')
                .order('id');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching damages:', error);
            return [];
        }
    },

    async getDamageById(id) {
        try {
            const { data, error } = await supabase
                .from('damages')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching damage:', error);
            return null;
        }
    },

    async addDamage(damage) {
        try {
            const { data, error } = await supabase
                .from('damages')
                .insert([damage])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding damage:', error);
            throw error;
        }
    },

    async updateDamage(damage) {
        try {
            const { data, error } = await supabase
                .from('damages')
                .update({
                    name: damage.name,
                    description: damage.description,
                    solution: damage.solution,
                    updated_at: new Date().toISOString()
                })
                .eq('id', damage.id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating damage:', error);
            throw error;
        }
    },

    async deleteDamage(id) {
        try {
            const { error } = await supabase
                .from('damages')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting damage:', error);
            throw error;
        }
    },

    // Rules operations
    async getAllRules() {
        try {
            const { data, error } = await supabase
                .from('rules')
                .select(`
                    *,
                    damage:damages(*),
                    rule_symptoms(
                        symptom_id,
                        cf_expert,
                        symptom:symptoms(*)
                    )
                `)
                .order('id');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching rules:', error);
            return [];
        }
    },

    async getRulesByDamageId(damageId) {
        try {
            const { data, error } = await supabase
                .from('rules')
                .select(`
                    *,
                    rule_symptoms(
                        symptom_id,
                        cf_expert,
                        symptom:symptoms(*)
                    )
                `)
                .eq('damage_id', damageId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching rule:', error);
            return null;
        }
    },

    // Diagnosis operations
    async saveDiagnosisSession(sessionData) {
        try {
            // Create diagnosis session
            const { data: session, error: sessionError } = await supabase
                .from('diagnosis_sessions')
                .insert([{
                    total_symptoms: sessionData.totalSymptoms,
                    total_results: sessionData.totalResults
                }])
                .select()
                .single();
            
            if (sessionError) throw sessionError;

            // Save user symptoms
            if (sessionData.userSymptoms && sessionData.userSymptoms.length > 0) {
                const userSymptomsData = sessionData.userSymptoms.map(symptom => ({
                    session_id: session.id,
                    symptom_id: symptom.symptomId,
                    cf_user: symptom.cf
                }));

                const { error: symptomsError } = await supabase
                    .from('user_symptoms')
                    .insert(userSymptomsData);
                
                if (symptomsError) throw symptomsError;
            }

            // Save diagnosis results
            if (sessionData.results && sessionData.results.length > 0) {
                const resultsData = sessionData.results.map((result, index) => ({
                    session_id: session.id,
                    damage_id: result.id,
                    cf_final: result.cf,
                    percentage: result.percentage,
                    rank: index + 1
                }));

                const { error: resultsError } = await supabase
                    .from('diagnosis_results')
                    .insert(resultsData);
                
                if (resultsError) throw resultsError;
            }

            return session;
        } catch (error) {
            console.error('Error saving diagnosis session:', error);
            throw error;
        }
    },

    async getDiagnosisCount() {
        try {
            const { count, error } = await supabase
                .from('diagnosis_sessions')
                .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error getting diagnosis count:', error);
            return 0;
        }
    },

    // Generate next IDs
    async generateNextSymptomId() {
        try {
            const symptoms = await this.getAllSymptoms();
            if (symptoms.length === 0) return 'G001';
            
            const numbers = symptoms.map(s => parseInt(s.id.substring(1)));
            const maxNumber = Math.max(...numbers);
            const nextNumber = maxNumber + 1;
            
            return 'G' + nextNumber.toString().padStart(3, '0');
        } catch (error) {
            console.error('Error generating symptom ID:', error);
            return 'G001';
        }
    },

    async generateNextDamageId() {
        try {
            const damages = await this.getAllDamages();
            if (damages.length === 0) return 'K001';
            
            const numbers = damages.map(d => parseInt(d.id.substring(1)));
            const maxNumber = Math.max(...numbers);
            const nextNumber = maxNumber + 1;
            
            return 'K' + nextNumber.toString().padStart(3, '0');
        } catch (error) {
            console.error('Error generating damage ID:', error);
            return 'K001';
        }
    }
};