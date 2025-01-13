'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    title: 'Budgeting Made Simple',
    description: 'Easily create and manage budgets to stay on top of your finances.',
    icon: '💰',
  },
  {
    title: 'Track Every Transaction',
    description: 'Gain insights into your spending habits with detailed transaction tracking.',
    icon: '💸',
  },
  {
    title: 'Visualize Your Spending',
    description: 'Understand your financial trends through interactive charts and reports.',
    icon: '📊',
  },
  {
    title: 'Seamless Integrations',
    description: 'Connect your banks and credit cards for automated transaction syncing.',
    icon: '🔗',
  },
];

const benefits = [
  {
    title: 'Take Control of Your Money',
    description: 'With powerful budgeting tools and real-time tracking, you\'ll always know where your money is going.',
  },
  {
    title: 'Make Informed Decisions',
    description: 'Gain valuable insights into your spending patterns to make smarter financial choices.',
  },
  {
    title: 'Achieve Your Financial Goals',
    description: 'Whether you\'re saving for a big purchase or paying off debt, MoneyWise helps you stay on track.',
  },
];

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <motion.h1 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white"
            >
              Simplify Your Finances with <span className="text-purple-400">MoneyWise</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-3 text-base text-purple-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
            >
              MoneyWise is a comprehensive budgeting and expense tracking app designed to help you take control of your financial life. With powerful features and an intuitive interface, managing your money has never been easier.
            </motion.p>
            <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
              <motion.div 
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="rounded-md shadow"
              >
                <a
                  href="/auth/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features to Simplify Your Finances
            </h2>
          </div>
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="pt-6"
                  initial="hidden"
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 50 },
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                          <span className="text-3xl text-white" aria-hidden="true">{feature.icon}</span>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-b from-purple-800 to-indigo-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Unlock the Benefits of Better Money Management
            </h2>
          </div>
          <div className="mt-20" ref={ref}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="pt-6"
                  initial="hidden"
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 50 },
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to take control of your finances?</span>
            <span className="block text-purple-600">Start using MoneyWise today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}