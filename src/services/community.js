import { supabase } from './supabase';

export async function getResidents() {
  if (!supabase) return { data: [], error: null };
  return supabase.from('warga').select('id,name,joined').order('joined', { ascending: true });
}

export async function getRecentMessages() {
  if (!supabase) return { data: [], error: null };
  return supabase.from('chat')
    .select('id,user_id,text,ts,warga(name)')
    .order('ts', { ascending: true })
    .limit(60);
}

export function createResident(userId, name) {
  return supabase.from('warga').insert({ id: userId, name });
}

export function createMessage(userId, text) {
  return supabase.from('chat').insert({ user_id: userId, text });
}

export function subscribeToCommunity(onResidentsChanged, onMessagesChanged) {
  if (!supabase) return null;
  return supabase.channel('kampung-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'warga' }, onResidentsChanged)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, onMessagesChanged)
    .subscribe();
}

export async function removeCommunitySubscription(channel) {
  if (channel && supabase) await supabase.removeChannel(channel);
}
