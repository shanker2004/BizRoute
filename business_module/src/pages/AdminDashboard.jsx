import {useState} from 'react'
import {motion} from 'framer-motion'
import {
  Users,
  Car,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Shield,
  Download
} from 'lucide-react'
import {cloneElement} from 'react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <TrendingUp className='w-4 h-4' />
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className='w-4 h-4' />
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: <Car className='w-4 h-4' />
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <DollarSign className='w-4 h-4' />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className='w-4 h-4' />
    }
  ]

  const systemStats = [
    {
      label: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: <Users className='w-6 h-6' />,
      color: 'blue'
    },
    {
      label: 'Active Vehicles',
      value: '567',
      change: '+8%',
      icon: <Car className='w-6 h-6' />,
      color: 'green'
    },
    {
      label: 'Alerts Today',
      value: '23',
      change: '-5%',
      icon: <AlertTriangle className='w-6 h-6' />,
      color: 'yellow'
    },
    {
      label: 'Revenue',
      value: '₹1.2L',
      change: '+15%',
      icon: <DollarSign className='w-6 h-6' />,
      color: 'purple'
    }
  ]

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Acme Corp',
      email: 'admin@acme.com',
      role: 'enterprise',
      status: 'pending',
      joinDate: '2024-01-14'
    },
    {
      id: 3,
      name: 'Raj Kumar',
      email: 'raj@example.com',
      role: 'driver',
      status: 'active',
      joinDate: '2024-01-13'
    },
    {
      id: 4,
      name: 'Smith Enterprises',
      email: 'contact@smith.com',
      role: 'enterprise',
      status: 'active',
      joinDate: '2024-01-12'
    }
  ]

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Admin Dashboard
              </h1>
              <p className='text-gray-600'>
                System administration and monitoring
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <button className='bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2'>
                <Download className='w-4 h-4' />
                Export Report
              </button>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <Shield className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className='flex space-x-8 overflow-x-auto'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {systemStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: index * 0.1}}
                  className='bg-white rounded-xl p-6 shadow-sm border'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>
                        {stat.label}
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {stat.value}
                      </p>
                      <p
                        className={`text-sm ${
                          stat.change.startsWith('+')
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                        {stat.change} from last week
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${
                        stat.color === 'blue'
                          ? 'bg-blue-100'
                          : stat.color === 'green'
                            ? 'bg-green-100'
                            : stat.color === 'yellow'
                              ? 'bg-yellow-100'
                              : 'bg-purple-100'
                      } rounded-full flex items-center justify-center`}>
                      {cloneElement(stat.icon, {
                        className: `w-6 h-6 ${
                          stat.color === 'blue'
                            ? 'text-blue-600'
                            : stat.color === 'green'
                              ? 'text-green-600'
                              : stat.color === 'yellow'
                                ? 'text-yellow-600'
                                : 'text-purple-600'
                        }`
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Users */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.4}}
              className='bg-white rounded-xl shadow-sm border overflow-hidden'>
              <div className='p-6 border-b'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Recent Users
                </h3>
                <p className='text-gray-600'>
                  Latest user registrations
                </p>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        User
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Role
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Join Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {recentUsers.map(user => (
                      <tr
                        key={user.id}
                        className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <div className='font-medium text-gray-900'>
                              {user.name}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize'>
                            {user.role}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user.joinDate}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <button className='text-blue-600 hover:text-blue-900 mr-3'>
                            Edit
                          </button>
                          <button className='text-red-600 hover:text-red-900'>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
