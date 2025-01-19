'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    title: 'Budgeting Made Simple',
    description: 'Create and manage budgets effortlessly with our intuitive tools and smart categorization system.',
    icon: '💰',
  },
  {
    title: 'Track Every Transaction',
    description: 'Get real-time insights into your spending with automated transaction tracking and customizable categories.',
    icon: '💸',
  },
  {
    title: 'Visualize Your Spending',
    description: 'Transform your financial data into actionable insights with beautiful, interactive charts and detailed reports.',
    icon: '📊',
  },
  {
    title: 'Seamless Integrations',
    description: 'Connect all your financial accounts in one secure place with our bank-grade encryption and automated syncing.',
    icon: '🔗',
  },
];

const benefits = [
  {
    title: 'Take Control of Your Money',
    description: 'Master your finances with our comprehensive suite of budgeting tools and real-time tracking features.',
  },
  {
    title: 'Make Informed Decisions',
    description: 'Transform raw data into actionable insights with our advanced analytics and personalized recommendations.',
  },
  {
    title: 'Achieve Your Financial Goals',
    description: 'Set, track, and reach your financial milestones with our goal-tracking system and progress indicators.',
  },
];

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="lg:text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                Simplify Your Finances with{' '}
                <span className="text-purple-400 inline-block">Wallet</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
                Take control of your financial life with our comprehensive budgeting and expense tracking platform. 
                Experience the power of smart money management with an interface designed for clarity and efficiency.
              </p>
              <div className="mt-10 flex justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <a
                    href="/auth/register"
                    className="px-8 py-4 bg-purple-600 text-white text-lg font-medium rounded-xl hover:bg-purple-700 
                    transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                                      Get Started Now

                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Powerful Features for Smart Finance
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your money effectively, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 30 },
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute -top-6 left-8">
                    <span className="inline-flex items-center justify-center p-4 bg-purple-600 rounded-xl shadow-lg">
                      <span className="text-3xl" aria-hidden="true">{feature.icon}</span>
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-b from-purple-800 to-indigo-900 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Transform Your Financial Future
            </h2>
            <p className="mt-4 text-xl text-purple-200 max-w-3xl mx-auto">
              Experience the benefits of intelligent money management.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial="hidden"
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 30 },
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-white rounded-2xl p-8 h-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-purple-50 rounded-3xl px-8 py-16 md:p-16 shadow-xl">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:max-w-2xl">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                  Ready to transform your finances?
                </h2>
                <p className="mt-4 text-xl text-gray-600">
                  Join thousands of users who have already taken control of their financial future.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <a
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl 
                  text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-0.5"
                >
                  Get Started Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}