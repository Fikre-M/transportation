/**
 * PWA Integration Examples
 * 
 * This file demonstrates how to integrate PWA features
 * (notifications, offline support, install prompts) with
 * your existing AI rideshare components.
 */

import { useEffect, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { offlineManager, isStandalone } from '../utils/pwa';

// ============================================
// Example 1: Smart Matching with Notifications
// ============================================

export function SmartMatchingWithNotifications() {
  const {
    requestPermissionAfterMatch,
    notifyDriverMatched,
    enabled,
  } = useNotifications();

  const [matching, setMatching] = useState(false);

  const handleFindDriver = async () => {
    setMatching(true);

    try {
      // Your existing AI matching logic
      const response = await fetch('/api/ai/match-driver', {
        method: 'POST',
        body: JSON.stringify({
          pickup: 'Current Location',
          destination: 'Airport',
        }),
      });

      const driver = await response.json();

      // Request notification permission after first successful match
      if (!enabled) {
        await requestPermissionAfterMatch();
      }

      // Show notification
      await notifyDriverMatched({
        name: driver.name,
        eta: driver.eta,
        rating: driver.rating,
        vehicleType: driver.vehicleType,
      });

      // Save for offline viewing
      offlineManager.saveForOffline('lastAIMatches', {
        driverName: driver.name,
        eta: driver.eta,
        timestamp: new Date().toISOString(),
      });

      console.log('Driver matched:', driver);
    } catch (error) {
      console.error('Error matching driver:', error);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div>
      <button onClick={handleFindDriver} disabled={matching}>
        {matching ? 'Finding Driver...' : 'Find Driver'}
      </button>
    </div>
  );
}

// ============================================
// Example 2: Trip Tracking with Real-time Notifications
// ============================================

export function TripTrackerWithNotifications({ tripId }) {
  const {
    notifyDriverArriving,
    notifyTripUpdate,
  } = useNotifications();

  useEffect(() => {
    // Simulate WebSocket connection
    const ws = new WebSocket('ws://localhost:8000');

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'driver-arriving':
          await notifyDriverArriving(data.driverName, data.eta);
          break;

        case 'trip-started':
          await notifyTripUpdate('Your trip has started!', data.trip);
          break;

        case 'trip-completed':
          await notifyTripUpdate('Trip completed. Thanks for riding!', data.trip);
          break;

        default:
          break;
      }
    };

    return () => ws.close();
  }, [tripId, notifyDriverArriving, notifyTripUpdate]);

  return <div>Tracking trip {tripId}...</div>;
}

// ============================================
// Example 3: Dynamic Pricing with Price Drop Alerts
// ============================================

export function DynamicPricingWithAlerts() {
  const { notifyPriceDrop } = useNotifications();
  const [currentPrice, setCurrentPrice] = useState(25.00);
  const [savedPrice, setSavedPrice] = useState(null);

  useEffect(() => {
    // Monitor price changes
    const interval = setInterval(async () => {
      const response = await fetch('/api/ai/dynamic-pricing');
      const { price } = await response.json();

      if (savedPrice && price < savedPrice) {
        const savings = savedPrice - price;
        await notifyPriceDrop(savedPrice, price, savings);
      }

      setCurrentPrice(price);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [savedPrice, notifyPriceDrop]);

  const handleSavePrice = () => {
    setSavedPrice(currentPrice);
    alert('Price alert set! We\'ll notify you if the price drops.');
  };

  return (
    <div>
      <h3>Current Price: ${currentPrice.toFixed(2)}</h3>
      <button onClick={handleSavePrice}>
        Set Price Alert
      </button>
    </div>
  );
}

// ============================================
// Example 4: Offline-First AI Chat
// ============================================

export function OfflineAIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load cached messages
    const cached = offlineManager.getOfflineData('chatMessages');
    if (cached) {
      setMessages(cached);
    }

    // Listen for online/offline events
    const cleanup = offlineManager.listen(
      () => setIsOnline(true),
      () => setIsOnline(false)
    );

    return cleanup;
  }, []);

  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    if (!isOnline) {
      // Queue message for later
      const queued = offlineManager.getOfflineData('queuedMessages') || [];
      queued.push(userMessage);
      offlineManager.saveForOffline('queuedMessages', queued);
      
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'You\'re offline. Message will be sent when connection is restored.',
        },
      ]);
      return;
    }

    try {
      // Send to AI (OpenAI not cached per requirements)
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: newMessages }),
      });

      const { message } = await response.json();
      const updatedMessages = [...newMessages, message];
      
      setMessages(updatedMessages);
      
      // Cache for offline viewing
      offlineManager.saveForOffline('chatMessages', updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      {!isOnline && (
        <div style={{ background: '#fed7d7', padding: '10px' }}>
          ⚠️ You're offline. Messages will be sent when connection is restored.
        </div>
      )}
      
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

// ============================================
// Example 5: PWA Status Indicator
// ============================================

export function PWAStatusIndicator() {
  const [installed, setInstalled] = useState(isStandalone());
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const cleanup = offlineManager.listen(
      () => setOnline(true),
      () => setOnline(false)
    );

    return cleanup;
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'white',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '12px',
    }}>
      <div>
        📱 {installed ? 'Installed' : 'Not Installed'}
      </div>
      <div>
        {online ? '🟢 Online' : '🔴 Offline'}
      </div>
    </div>
  );
}

// ============================================
// Example 6: Background Sync for Offline Actions
// ============================================

export function OfflineBookingQueue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Load queued bookings
    const queued = offlineManager.getOfflineData('bookingQueue') || [];
    setQueue(queued);

    // Process queue when online
    const processQueue = async () => {
      if (navigator.onLine && queued.length > 0) {
        for (const booking of queued) {
          try {
            await fetch('/api/bookings', {
              method: 'POST',
              body: JSON.stringify(booking),
            });
            
            // Remove from queue
            const updated = queued.filter(b => b.id !== booking.id);
            offlineManager.saveForOffline('bookingQueue', updated);
            setQueue(updated);
          } catch (error) {
            console.error('Error processing booking:', error);
          }
        }
      }
    };

    const cleanup = offlineManager.listen(processQueue, () => {});
    
    return cleanup;
  }, []);

  const handleBookRide = (bookingData) => {
    if (!navigator.onLine) {
      // Add to queue
      const booking = { ...bookingData, id: Date.now() };
      const updated = [...queue, booking];
      setQueue(updated);
      offlineManager.saveForOffline('bookingQueue', updated);
      
      alert('You\'re offline. Booking will be processed when connection is restored.');
    } else {
      // Process immediately
      fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    }
  };

  return (
    <div>
      {queue.length > 0 && (
        <div style={{ background: '#fef3c7', padding: '10px' }}>
          ⏳ {queue.length} booking(s) queued for processing
        </div>
      )}
      
      <button onClick={() => handleBookRide({ from: 'A', to: 'B' })}>
        Book Ride
      </button>
    </div>
  );
}

// ============================================
// Example 7: Cache Management UI
// ============================================

export function CacheManagement() {
  const [cacheSize, setCacheSize] = useState(null);

  useEffect(() => {
    const loadCacheSize = async () => {
      if ('caches' in window && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setCacheSize({
          usage: (estimate.usage / 1024 / 1024).toFixed(2),
          quota: (estimate.quota / 1024 / 1024).toFixed(2),
          percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2),
        });
      }
    };

    loadCacheSize();
  }, []);

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      alert('Cache cleared!');
      window.location.reload();
    }
  };

  if (!cacheSize) return <div>Loading cache info...</div>;

  return (
    <div>
      <h3>Cache Storage</h3>
      <p>Used: {cacheSize.usage} MB / {cacheSize.quota} MB</p>
      <p>Usage: {cacheSize.percentage}%</p>
      <button onClick={handleClearCache}>Clear Cache</button>
    </div>
  );
}

// ============================================
// Export all examples
// ============================================

export default {
  SmartMatchingWithNotifications,
  TripTrackerWithNotifications,
  DynamicPricingWithAlerts,
  OfflineAIChat,
  PWAStatusIndicator,
  OfflineBookingQueue,
  CacheManagement,
};
