// src/components/ui/index.jsx
// Composants UI Premium - Design Éblouissant

import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';

// ============================================
// BUTTON - Bouton Premium avec effets
// ============================================
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props 
}) => {
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true
    });
    setTimeout(() => setRipple(r => ({ ...r, show: false })), 600);
    if (onClick && !disabled && !loading) onClick(e);
  };

  const baseStyles = `
    relative overflow-hidden
    inline-flex items-center justify-center gap-2
    font-semibold tracking-wide
    rounded-xl
    transition-all duration-300 ease-out
    transform active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600
      hover:from-blue-500 hover:to-indigo-500
      text-white shadow-lg shadow-blue-500/30
      hover:shadow-xl hover:shadow-blue-500/40
      focus:ring-blue-500
    `,
    secondary: `
      bg-white/10 backdrop-blur-sm
      border border-white/20
      text-gray-700 dark:text-white
      hover:bg-white/20 hover:border-white/30
      shadow-lg shadow-black/5
      focus:ring-gray-400
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-green-500
      hover:from-emerald-400 hover:to-green-400
      text-white shadow-lg shadow-emerald-500/30
      hover:shadow-xl hover:shadow-emerald-500/40
      focus:ring-emerald-500
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-500
      hover:from-red-400 hover:to-rose-400
      text-white shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40
      focus:ring-red-500
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-orange-500
      hover:from-amber-400 hover:to-orange-400
      text-white shadow-lg shadow-amber-500/30
      hover:shadow-xl hover:shadow-amber-500/40
      focus:ring-amber-500
    `,
    ghost: `
      bg-transparent
      text-gray-600 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-white/10
      focus:ring-gray-400
    `,
    outline: `
      bg-transparent
      border-2 border-blue-500
      text-blue-600 dark:text-blue-400
      hover:bg-blue-50 dark:hover:bg-blue-500/10
      focus:ring-blue-500
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple Effect */}
      {ripple.show && (
        <span
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      )}
      
      {/* Loading Spinner */}
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      
      {/* Icon Left */}
      {Icon && iconPosition === 'left' && !loading && <Icon className="w-4 h-4" />}
      
      {/* Content */}
      <span>{children}</span>
      
      {/* Icon Right */}
      {Icon && iconPosition === 'right' && !loading && <Icon className="w-4 h-4" />}
    </button>
  );
};

// ============================================
// MODAL - Modale Premium Glassmorphism
// ============================================
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  size = 'md',
  children,
  footer,
  icon: Icon,
  iconColor = 'blue'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };

  const iconColors = {
    blue: 'from-blue-500 to-indigo-500 shadow-blue-500/30',
    green: 'from-emerald-500 to-green-500 shadow-emerald-500/30',
    red: 'from-red-500 to-rose-500 shadow-red-500/30',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/30',
    purple: 'from-purple-500 to-violet-500 shadow-purple-500/30'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop avec blur */}
      <div 
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full ${sizes[size]}
            bg-white/95 dark:bg-gray-900/95
            backdrop-blur-xl
            rounded-3xl
            shadow-2xl shadow-black/20
            border border-white/20
            transition-all duration-300 ease-out
            ${isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
            }
          `}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                p-2 rounded-full
                text-gray-400 hover:text-gray-600
                hover:bg-gray-100 dark:hover:bg-white/10
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-gray-300
              "
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            {Icon && (
              <div className={`
                inline-flex p-3 rounded-2xl mb-4
                bg-gradient-to-br ${iconColors[iconColor]}
                shadow-lg
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Title */}
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-8">
                {title}
              </h2>
            )}
            
            {/* Subtitle */}
            {subtitle && (
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 rounded-b-3xl border-t border-gray-100 dark:border-white/10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// CARD - Carte Premium avec hover effects
// ============================================
export const Card = ({ 
  children, 
  className = '',
  hover = true,
  onClick,
  padding = 'md',
  gradient,
  glow
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const glowColors = {
    blue: 'hover:shadow-blue-500/20',
    green: 'hover:shadow-emerald-500/20',
    red: 'hover:shadow-red-500/20',
    amber: 'hover:shadow-amber-500/20',
    purple: 'hover:shadow-purple-500/20'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800/50
        backdrop-blur-sm
        rounded-2xl
        border border-gray-100 dark:border-white/10
        shadow-lg shadow-gray-200/50 dark:shadow-black/20
        ${paddings[padding]}
        ${hover ? `
          transition-all duration-300 ease-out
          hover:shadow-xl hover:-translate-y-1
          ${glow ? glowColors[glow] : ''}
        ` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${gradient ? `bg-gradient-to-br ${gradient}` : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ============================================
// STAT CARD - Carte de statistique premium
// ============================================
export const StatCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  trend,
  trendValue,
  color = 'blue',
  onClick,
  pulse = false
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animation du compteur
  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colors = {
    blue: {
      bg: 'from-blue-500 to-indigo-600',
      light: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-blue-500/20'
    },
    green: {
      bg: 'from-emerald-500 to-green-600',
      light: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-500/20'
    },
    red: {
      bg: 'from-red-500 to-rose-600',
      light: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      shadow: 'shadow-red-500/20'
    },
    amber: {
      bg: 'from-amber-500 to-orange-600',
      light: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      shadow: 'shadow-amber-500/20'
    },
    purple: {
      bg: 'from-purple-500 to-violet-600',
      light: 'bg-purple-50 dark:bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      shadow: 'shadow-purple-500/20'
    }
  };

  const colorSet = colors[color];

  return (
    <Card 
      onClick={onClick} 
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      glow={color}
    >
      {/* Background decoration */}
      <div className={`
        absolute -top-10 -right-10 w-32 h-32 
        bg-gradient-to-br ${colorSet.bg} 
        opacity-10 rounded-full blur-2xl
      `} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          
          {/* Value */}
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            {displayValue}
          </p>
          
          {/* Subtitle / Trend */}
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  ${trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : ''}
                  ${trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : ''}
                `}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
              )}
              {subtitle && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={`
            p-3 rounded-xl ${colorSet.light}
            ${pulse ? 'animate-pulse' : ''}
          `}>
            <Icon className={`w-6 h-6 ${colorSet.text}`} />
          </div>
        )}
      </div>
    </Card>
  );
};

// ============================================
// BADGE - Badge avec différents styles
// ============================================
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  pulse = false,
  icon: Icon
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    info: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center gap-1
      font-medium rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${pulse ? 'animate-pulse' : ''}
    `}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

// ============================================
// INPUT - Input Premium
// ============================================
export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-11' : ''}
            bg-white dark:bg-gray-800
            border-2 rounded-xl
            text-gray-900 dark:text-white
            placeholder-gray-400
            transition-all duration-200
            ${focused 
              ? 'border-blue-500 ring-4 ring-blue-500/10' 
              : 'border-gray-200 dark:border-gray-700'
            }
            ${error 
              ? 'border-red-500 ring-4 ring-red-500/10' 
              : ''
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' 
              : ''
            }
            focus:outline-none
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================
// SELECT - Select Premium
// ============================================
export const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Sélectionner...',
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full px-4 py-3
          bg-white dark:bg-gray-800
          border-2 rounded-xl
          text-gray-900 dark:text-white
          transition-all duration-200
          appearance-none
          cursor-pointer
          ${focused 
            ? 'border-blue-500 ring-4 ring-blue-500/10' 
            : 'border-gray-200 dark:border-gray-700'
          }
          ${error 
            ? 'border-red-500 ring-4 ring-red-500/10' 
            : ''
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }
          focus:outline-none
        `}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================
// TOAST - Notifications Toast
// ============================================
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info')
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const icons = {
    success: Check,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  const Icon = icons[type];

  return (
    <div className={`
      flex items-center gap-3
      px-4 py-3 rounded-xl
      bg-white dark:bg-gray-800
      shadow-xl shadow-black/10
      border border-gray-100 dark:border-gray-700
      transition-all duration-300
      ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
    `}>
      <div className={`p-1.5 rounded-lg ${colors[type]}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white">
        {message}
      </p>
    </div>
  );
};

// ============================================
// LOADING SKELETON
// ============================================
export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4'
  };

  return (
    <div className={`
      animate-pulse bg-gradient-to-r 
      from-gray-200 via-gray-100 to-gray-200
      dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
      background-size-200 animate-shimmer
      ${variants[variant]}
      ${className}
    `} />
  );
};

// ============================================
// EMPTY STATE
// ============================================
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && (
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
    {description && (
      <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-sm">
        {description}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default {
  Button,
  Modal,
  Card,
  StatCard,
  Badge,
  Input,
  Select,
  ToastProvider,
  useToast,
  Skeleton,
  EmptyState
};
