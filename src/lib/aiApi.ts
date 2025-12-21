import apiClient from '@/lib/apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// AI Chat
export const sendChatMessage = async (message: string, context?: any) => {
  const session = localStorage.getItem('session');
  const token = session ? JSON.parse(session).access_token : null;

  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ message, context })
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  return response.json();
};

// AI Image Identification
export const identifyPestImage = async (imageBase64: string, crop?: string, language?: string) => {
  const session = localStorage.getItem('session');
  const token = session ? JSON.parse(session).access_token : null;

  const response = await fetch(`${API_URL}/api/ai/identify-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      image: imageBase64,
      crop,
      language
    })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  return response.json();
};

// Symptom Check
export const checkSymptoms = async (crop: string, symptoms: string[], severity?: string, language?: string) => {
  const session = localStorage.getItem('session');
  const token = session ? JSON.parse(session).access_token : null;

  const response = await fetch(`${API_URL}/api/ai/symptom-check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      crop,
      symptoms,
      severity,
      language
    })
  });

  if (!response.ok) {
    throw new Error('Failed to check symptoms');
  }

  return response.json();
};

export default {
  sendChatMessage,
  identifyPestImage,
  checkSymptoms
};
