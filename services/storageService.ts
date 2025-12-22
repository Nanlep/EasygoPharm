
import { DrugRequest, Consultation, AuditLog, RequestStatus, ConsultStatus, User, UserRole, GroundingSource } from '../types';
import { supabase, hasValidDb } from './supabaseClient';
import { MOCK_USERS } from '../constants';

export const StorageService = {
  // Users
  getUsers: async (): Promise<User[]> => {
    if (!hasValidDb()) return MOCK_USERS.map(({password, ...u}) => u as User);
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || [];
  },

  addUser: async (user: Omit<User, 'id'> & { password?: string }) => {
    if (!hasValidDb()) throw new Error("Database not connected.");
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) throw error;
    await StorageService.logAudit(`Created user ${user.username}`, 'Admin');
    return data;
  },

  // Requests
  getRequests: async (): Promise<DrugRequest[]> => {
    if (!hasValidDb()) return [];
    const { data, error } = await supabase
      .from('drug_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  addRequest: async (req: any) => {
    if (!hasValidDb()) throw new Error("Database connection unavailable.");
    
    const newReq = {
      genericName: req.genericName,
      brandName: req.brandName || null,
      dosageStrength: req.dosageStrength,
      quantity: req.quantity,
      requesterName: req.requesterName,
      requesterType: req.requesterType,
      contactEmail: req.contactEmail,
      contactPhone: req.contactPhone,
      urgency: req.urgency || 'NORMAL',
      notes: req.notes || null,
      status: RequestStatus.PENDING,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('drug_requests').insert([newReq]).select().single();
    
    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Trigger Notifications
    try {
      const notifyResponse = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'DRUG_REQUEST', data: data })
      });
      
      if (!notifyResponse.ok) {
        const errData = await notifyResponse.json();
        console.warn("Notification Service Warning:", errData);
      } else {
        console.log("Notification trigger successful");
      }
    } catch (e) {
      console.warn("Notification API unreachable. Check if serverless functions are running (use 'vercel dev').");
    }

    await StorageService.logAudit('New Drug Request', 'System');
    return data;
  },

  updateRequestStatus: async (id: string, status: RequestStatus, aiAnalysis?: string, aiSources?: GroundingSource[]) => {
    if (!hasValidDb()) return;
    const update: any = { status };
    if (aiAnalysis) update.aiAnalysis = aiAnalysis;
    if (aiSources) update.aiSources = aiSources;

    const { error } = await supabase.from('drug_requests').update(update).eq('id', id);
    if (error) throw error;
    await StorageService.logAudit(`Request ${id} updated to ${status}`, 'Admin');
  },

  // Consultations
  getConsultations: async (): Promise<Consultation[]> => {
    if (!hasValidDb()) return [];
    const { data, error } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  addConsultation: async (consult: any) => {
    if (!hasValidDb()) throw new Error("Database connection unavailable.");
    
    const newConsult = {
      patientName: consult.patientName,
      contactEmail: consult.contactEmail,
      contactPhone: consult.contactPhone,
      preferredDate: consult.preferredDate,
      reason: consult.reason,
      status: ConsultStatus.SCHEDULED,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('consultations').insert([newConsult]).select().single();
    
    if (error) {
      console.error("Supabase Consultation Error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    // Trigger Notifications
    try {
      const notifyResponse = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONSULTATION', data: data })
      });
      
      if (!notifyResponse.ok) {
        const errData = await notifyResponse.json();
        console.warn("Notification Service Warning:", errData);
      }
    } catch (e) {
      console.warn("Notification API unreachable.");
    }

    await StorageService.logAudit('New Consultation Booked', 'System');
    return data;
  },

  // Audit
  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (!hasValidDb()) return [];
    const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(100);
    if (error) throw error;
    return data || [];
  },

  logAudit: async (action: string, user: string) => {
    if (!hasValidDb()) return;
    await supabase.from('audit_logs').insert([{ action, user, timestamp: new Date().toISOString() }]);
  },

  // Auth
  login: async (username: string, password: string): Promise<User | null> => {
    let user: User | null = null;

    if (hasValidDb()) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();
      
      if (data) user = data;
    }

    if (!user) {
      const mock = MOCK_USERS.find(u => u.username === username && u.password === password);
      if (mock) {
        const { password: _, ...userData } = mock;
        user = userData as User;
      }
    }

    if (user) {
      localStorage.setItem('egp_session', JSON.stringify(user));
      await StorageService.logAudit('Login Success', user.username);
      return user;
    }
    
    return null;
  },

  logout: () => {
    localStorage.removeItem('egp_session');
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('egp_session');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  updatePassword: async (username: string, newPassword: string) => {
    if (!hasValidDb()) return;
    const { error } = await supabase.from('users').update({ password: newPassword }).eq('username', username);
    if (error) throw error;
    await StorageService.logAudit('Password Updated', username);
  }
};
