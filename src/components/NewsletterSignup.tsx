import React, { useState, useRef } from 'react';
import { Mail } from 'lucide-react';

// The unique URL for your Brevo form submission.
const BREVO_ACTION_URL = "https://98574844.sibforms.com/serve/MUIFAIe2rZashOaeVWBpJmYB6ZY0Rfn9ySYGHBnF0S8TdAFFFc2IzrK7Obmq9i7q4xLKg7h1qdDJVlXdj5ME6Hk4Bb-tGX_Bb30vq0z-KmxY26uvq2IsQil6mR4702MSBo16CiuIjWoQBv9Cve_p5IDulk4LIWbRiEmZZoxdjloeJxsBRk44LU7fZi_YolbeNi8NYrcc1A5nFVzghg==";

const NewsletterSignup: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle the form submission using iframe method (most reliable for Brevo)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    const form = event.currentTarget;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Create a hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'brevo-form-iframe';
    iframe.id = 'brevo-form-iframe-' + Date.now(); // Unique ID
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);
    
    // Set form target to the iframe
    form.target = iframe.name;
    
    // Handle iframe load (success)
    const handleLoad = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setStatus('success');
      form.reset();
      // Clean up iframe after a delay
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2000);
    };
    
    // Handle iframe error
    const handleError = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setStatus('error');
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
    
    iframe.addEventListener('load', handleLoad, { once: true });
    iframe.addEventListener('error', handleError, { once: true });
    
    // Submit the form - it will post to the iframe
    form.submit();
    
    // Fallback timeout - if iframe doesn't load within 5 seconds, assume success
    // (Brevo forms sometimes don't trigger load events properly)
    timeoutRef.current = setTimeout(() => {
      setStatus((currentStatus) => {
        if (currentStatus === 'submitting') {
          // Assume success if no error after timeout
          return 'success';
        }
        return currentStatus;
      });
      form.reset();
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 5000);
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wedding-rust/10 mb-4">
          <Mail className="text-wedding-rust" size={32} />
        </div>
        <h2 className="text-4xl md:text-5xl mb-6 text-wedding-olive">
          Honeymoon Recap
        </h2>
        <p className="text-lg text-wedding-warm-text">
          We are headed to Sri Lanka on December 8th for our honeymoon! Share your email address with us and we will send you a Photo Recap of our trip in January 2026.
        </p>

        {/* Status Messages */}
        {status === 'success' && (
          <p className="mt-4 p-3 bg-wedding-cream text-wedding-warm-text rounded-lg border border-wedding-rust">
            Stay Tuned! We will send you a recap of our trip in January 2026.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
            Oops! Something went wrong. Please check your email address and try again.
          </p>
        )}
        
        {/* The Form */}
        <form 
          id="sib-form-clean" 
          method="POST" 
          action={BREVO_ACTION_URL} 
          onSubmit={handleSubmit}
          encType="application/x-www-form-urlencoded"
          className="mt-8 flex flex-col items-center space-y-4"
        >
          {/* FIRST NAME Field (Corresponds to Brevo's FIRSTNAME) */}
          <input
            type="text"
            id="FIRSTNAME_clean"
            name="FIRSTNAME" // CRITICAL: Must match Brevo's field name
            placeholder="First Name"
            required
            className="w-full max-w-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-wedding-gold focus:border-wedding-gold transition duration-150"
          />
          
          {/* EMAIL Field (Corresponds to Brevo's EMAIL) */}
          <input
            type="email"
            id="EMAIL_clean"
            name="EMAIL" // CRITICAL: Must match Brevo's field name
            placeholder="Email Address"
            required
            className="w-full max-w-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-wedding-gold focus:border-wedding-gold transition duration-150"
          />

          {/* Hidden Fields required by Brevo */}
          <input type="hidden" name="email_address_check" value="" />
          <input type="hidden" name="locale" value="en" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting' || status === 'success'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-wedding-olive text-white rounded-lg hover:bg-wedding-olive/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status === 'idle' ? 'SUBSCRIBE FOR UPDATES' : (status === 'submitting' ? 'SUBSCRIBING...' : (status === 'success' ? 'SUBSCRIBED!' : 'TRY AGAIN'))}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;

