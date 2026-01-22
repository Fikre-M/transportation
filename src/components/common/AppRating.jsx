import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AppRating = () => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState('rating'); // 'rating', 'feedback', 'thanks'
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    // Check if user has already rated
    const hasUserRated = localStorage.getItem('app-rated');
    if (hasUserRated) {
      setHasRated(true);
      return;
    }

    // Show rating prompt after some time or interactions
    const timer = setTimeout(() => {
      const visits = parseInt(localStorage.getItem('app-visits') || '0') + 1;
      localStorage.setItem('app-visits', visits.toString());
      
      // Show rating after 3 visits
      if (visits >= 3) {
        setShowRating(true);
      }
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleRatingClick = (value) => {
    setRating(value);
    if (value >= 4) {
      // High rating - go directly to thanks
      setTimeout(() => {
        setStep('thanks');
        handleSubmitRating(value, '');
      }, 500);
    } else {
      // Low rating - ask for feedback
      setStep('feedback');
    }
  };

  const handleSubmitRating = async (ratingValue, feedbackText) => {
    try {
      // Here you would typically send to your analytics service
      const ratingData = {
        rating: ratingValue,
        feedback: feedbackText,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Store locally for now
      localStorage.setItem('app-rating', JSON.stringify(ratingData));
      localStorage.setItem('app-rated', 'true');
      
      console.log('Rating submitted:', ratingData);
      
      setHasRated(true);
      
      // Hide after showing thanks
      setTimeout(() => {
        setShowRating(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleFeedbackSubmit = () => {
    setStep('thanks');
    handleSubmitRating(rating, feedback);
  };

  const handleClose = () => {
    setShowRating(false);
    // Don't show again for a while
    localStorage.setItem('rating-dismissed', Date.now().toString());
  };

  if (hasRated || !showRating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">
              Rate Our App
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'rating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-gray-600 text-sm">
              How would you rate your experience with our rideshare app?
            </p>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </motion.button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Tap a star to rate
            </p>
          </motion.div>
        )}

        {step === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {rating} star{rating !== 1 ? 's' : ''}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm">
              Thanks for your rating! Could you tell us how we can improve?
            </p>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback helps us improve..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-500"
              rows={3}
            />
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleSubmitRating(rating, '')}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'thanks' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </motion.div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Thank you!
              </h4>
              <p className="text-sm text-gray-600">
                Your feedback helps us make the app better for everyone.
              </p>
            </div>
            
            {rating >= 4 && (
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-sm text-indigo-700">
                  Love the app? Consider sharing it with friends! 🚗✨
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRating;