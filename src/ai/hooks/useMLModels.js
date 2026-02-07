import { useState, useEffect, useCallback } from 'react';
import MLAIService from '../services/MLAIService';

export const useMLModels = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);

  const initializeModels = useCallback(async () => {
    if (isInitialized || isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      console.log('🤖 Initializing ML Models...');
      await MLAIService.initialize();
      
      const status = MLAIService.getModelStatus();
      setModelStatus(status);
      setIsInitialized(true);
      
      console.log('✅ ML Models initialized successfully!');
    } catch (err) {
      console.error('❌ Failed to initialize ML Models:', err);
      setError(err.message || 'Failed to initialize ML models');
    } finally {
      setIsInitializing(false);
    }
  }, [isInitialized, isInitializing]);

  useEffect(() => {
    // Auto-initialize on mount
    initializeModels();
  }, [initializeModels]);

  return {
    isInitialized,
    isInitializing,
    error,
    modelStatus,
    initializeModels,
    mlService: MLAIService
  };
};

export default useMLModels;
