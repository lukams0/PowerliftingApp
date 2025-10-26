import { supabase } from '../lib/supabase';
import { BodyWeightLog } from '../types/database.types';

class BodyWeightService {
  /**
   * Get all body weight logs for a user
   */
  async getUserWeightLogs(userId: string): Promise<BodyWeightLog[]> {
    try {
      console.log('Fetching weight logs for user:', userId);
      
      const { data, error } = await supabase
        .from('body_weight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('Fetch weight logs error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} weight logs`);
      return data || [];
    } catch (error) {
      console.error('Get user weight logs error:', error);
      throw error;
    }
  }

  /**
   * Get most recent body weight for a user
   */
  async getRecentWeight(userId: string): Promise<BodyWeightLog | null> {
    try {
      console.log('Fetching recent weight for user:', userId);
      
      const { data, error } = await supabase
        .from('body_weight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Fetch recent weight error:', error);
        throw error;
      }

      console.log('Recent weight fetched:', !!data);
      return data;
    } catch (error) {
      console.error('Get recent weight error:', error);
      throw error;
    }
  }

  /**
   * Get weight logs within a date range
   */
  async getWeightLogsInRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<BodyWeightLog[]> {
    try {
      console.log('Fetching weight logs in range:', startDate, 'to', endDate);
      
      const { data, error } = await supabase
        .from('body_weight_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', startDate)
        .lte('logged_at', endDate)
        .order('logged_at', { ascending: true });

      if (error) {
        console.error('Fetch weight logs in range error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} weight logs in range`);
      return data || [];
    } catch (error) {
      console.error('Get weight logs in range error:', error);
      throw error;
    }
  }

  /**
   * Log a new body weight measurement
   */
  async logWeight(
    userId: string,
    weight: {
      weight_lbs: number;
      logged_at?: string;
      notes?: string;
    }
  ): Promise<BodyWeightLog> {
    try {
      console.log('Logging new weight:', weight.weight_lbs);
      
      const { data, error } = await supabase
        .from('body_weight_logs')
        .insert({
          user_id: userId,
          weight_lbs: weight.weight_lbs,
          logged_at: weight.logged_at || new Date().toISOString(),
          notes: weight.notes,
        })
        .select()
        .single();

      if (error) {
        console.error('Log weight error:', error);
        throw error;
      }

      console.log('Weight logged successfully');
      return data;
    } catch (error) {
      console.error('Log weight error:', error);
      throw error;
    }
  }

  /**
   * Update a body weight log
   */
  async updateWeightLog(
    logId: string,
    updates: {
      weight_lbs?: number;
      logged_at?: string;
      notes?: string;
    }
  ): Promise<BodyWeightLog> {
    try {
      console.log('Updating weight log:', logId);
      
      const { data, error } = await supabase
        .from('body_weight_logs')
        .update(updates)
        .eq('id', logId)
        .select()
        .single();

      if (error) {
        console.error('Update weight log error:', error);
        throw error;
      }

      console.log('Weight log updated successfully');
      return data;
    } catch (error) {
      console.error('Update weight log error:', error);
      throw error;
    }
  }

  /**
   * Delete a body weight log
   */
  async deleteWeightLog(logId: string): Promise<void> {
    try {
      console.log('Deleting weight log:', logId);
      
      const { error } = await supabase
        .from('body_weight_logs')
        .delete()
        .eq('id', logId);

      if (error) {
        console.error('Delete weight log error:', error);
        throw error;
      }

      console.log('Weight log deleted successfully');
    } catch (error) {
      console.error('Delete weight log error:', error);
      throw error;
    }
  }

  /**
   * Get weight change over time
   */
  async getWeightChange(
    userId: string,
    daysBack: number = 30
  ): Promise<{ change: number; percentage: number } | null> {
    try {
      console.log('Calculating weight change over', daysBack, 'days');
      
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

      const logs = await this.getWeightLogsInRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      );

      if (logs.length < 2) {
        return null; // Not enough data
      }

      const oldestWeight = logs[0].weight_lbs;
      const newestWeight = logs[logs.length - 1].weight_lbs;
      const change = newestWeight - oldestWeight;
      const percentage = (change / oldestWeight) * 100;

      return { change, percentage };
    } catch (error) {
      console.error('Get weight change error:', error);
      throw error;
    }
  }

  /**
   * Get average weight over a period
   */
  async getAverageWeight(
    userId: string,
    daysBack: number = 7
  ): Promise<number | null> {
    try {
      console.log('Calculating average weight over', daysBack, 'days');
      
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

      const logs = await this.getWeightLogsInRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      );

      if (logs.length === 0) {
        return null;
      }

      const total = logs.reduce((sum, log) => sum + log.weight_lbs, 0);
      return total / logs.length;
    } catch (error) {
      console.error('Get average weight error:', error);
      throw error;
    }
  }

  /**
   * Sync athlete profile weight with most recent log
   */
  async syncProfileWeight(userId: string): Promise<void> {
    try {
      console.log('Syncing profile weight for user:', userId);
      
      const recentWeight = await this.getRecentWeight(userId);
      
      if (!recentWeight) {
        console.log('No weight logs to sync');
        return;
      }

      // Update athlete profile with most recent weight
      const { error } = await supabase
        .from('athlete_profiles')
        .update({ weight_lbs: recentWeight.weight_lbs })
        .eq('user_id', userId);

      if (error) {
        console.error('Sync profile weight error:', error);
        throw error;
      }

      console.log('Profile weight synced successfully');
    } catch (error) {
      console.error('Sync profile weight error:', error);
      throw error;
    }
  }
}

export const bodyWeightService = new BodyWeightService();