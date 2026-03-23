import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Shield,
  BarChart3,
  Zap,
  DollarSign,
  Navigation
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: <Navigation className='w-8 h-8' />,
      title: 'Real-time Tracking',
      description: 'Live GPS tracking with 2-second updates'
    },
    {
      icon: <MapPin className='w-8 h-8' />,
      title: 'Geo-Fence Alerts',
      description:
        'Instant notifications for boundary breaches'
    },
    {
      icon: <BarChart3 className='w-8 h-8' />,
      title: 'Driver Scoring',
      description:
        'AI-powered behavior analysis and scoring'
    },
    {
      icon: <Shield className='w-8 h-8' />,
      title: 'Engine Immobilizer',
      description: 'Remote vehicle control and security'
    },
    {
      icon: <Zap className='w-8 h-8' />,
      title: 'Predictive Analytics',
      description: 'Smart insights and maintenance alerts'
    },
    {
      icon: <DollarSign className='w-8 h-8' />,
      title: 'Dynamic Billing',
      description:
        'Automated rental and usage-based billing'
    }
  ]

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center'>
            <h1 className='text-5xl md:text-7xl font-bold mb-6'>
              BizRoute
            </h1>
            <p className='text-xl md:text-2xl mb-8 text-blue-100'>
              Track Smarter. Drive Safer.
            </p>
            <p className='text-lg mb-12 max-w-2xl mx-auto text-blue-200'>
              Intelligent IoT-driven vehicle tracking and
              analytics platform for rental and fleet
              management with real-time insights and
              control.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link
                to='/login?role=owner'
                className='bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg'>
                Login as Owner
              </Link>
              <Link
                to='/login?role=enterprise'
                className='border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors'>
                Login as Enterprise
              </Link>
              <button className='border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-300 hover:text-blue-900 transition-colors'>
                Request Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent'></div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Smart Vehicle Management
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Comprehensive IoT platform that transforms how
              you track, manage, and secure your vehicles
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1
                }}
                className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'>
                <div className='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-blue-600 text-white'>
        <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready to Transform Your Vehicle Management?
            </h2>
            <p className='text-xl mb-8 text-blue-100'>
              Join thousands of owners and enterprises using
              Yantra Kavasam
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/register?role=owner'
                className='bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors'>
                Start Free Trial
              </Link>
              <Link
                to='/register?role=enterprise'
                className='border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors'>
                Enterprise Solution
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
